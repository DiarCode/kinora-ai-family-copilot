from __future__ import annotations

import asyncio
import json
import logging
import os
import textwrap
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    TurnHandlingOptions,
    cli,
    inference,
    llm,
    room_io,
)
from livekit.plugins import openai

AGENT_DIR = Path(__file__).resolve().parents[1]


def _load_local_env() -> None:
    """Load the repo/agent .env.local files when running outside a container.

    A deployed container has no .env.local; LiveKit injects secrets as real
    environment variables. Avoid indexing parents past the filesystem root.
    """
    for directory in (AGENT_DIR, *AGENT_DIR.parents):
        candidate = directory / ".env.local"
        if candidate.is_file():
            load_dotenv(candidate, override=directory == AGENT_DIR)


_load_local_env()

logger = logging.getLogger("kinora.voice")

AGENT_NAME = os.getenv("KINORA_AGENT_NAME", "kinora-agent")
OLLAMA_BASE_URL = os.getenv("KINORA_LLM_BASE_URL", "https://ollama.com/v1")
OLLAMA_MODEL = os.getenv("KINORA_LLM_MODEL", "gemma4:31b")
OLLAMA_API_KEY = os.getenv("KINORA_LLM_API_KEY") or os.getenv("OLLAMA_API_KEY", "")
STT_MODEL = os.getenv("KINORA_STT_MODEL", "assemblyai/universal-3-6-pro")
STT_LANGUAGE = os.getenv("KINORA_STT_LANGUAGE", "en")
STT_DIARIZE = os.getenv("KINORA_STT_DIARIZE", "1").lower() not in {
    "0",
    "false",
    "no",
    "off",
}
TTS_MODEL = os.getenv("KINORA_TTS_MODEL", "cartesia/sonic-3")
TTS_VOICE = os.getenv("KINORA_TTS_VOICE", "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc")


def build_instructions(context: dict[str, Any]) -> str:
    problem = str(context.get("problem") or "a recurring family disagreement")
    participants = context.get("participants") or []
    names = [str(item.get("name", "")).strip() for item in participants]
    names = [name for name in names if name]
    names_text = " and ".join(names) if names else "the two parents"
    first = str(
        context.get("firstSpeakerName")
        or (names[0].split(" ")[0] if names else "one parent")
    )

    return textwrap.dedent(
        f"""\
        You are Kinora, a calm, warm, professional family coach speaking on a call
        with two parents. You are not a therapist, a judge, or a mediator who
        decides who is right.

        The session problem: {problem}
        The parents: {names_text}
        They share one phone on the table between them and speak in turns.
        You already opened the session and invited {first} to speak first.

        Your job is to help both parents feel heard and leave with one small,
        concrete agreement. Guide the conversation through this arc, without
        announcing the arc:
        1. Each parent's side of the story, without solving it yet.
        2. The feelings and needs underneath each side.
        3. The common ground between them.
        4. One small agreement that fits this week.

        Rules for every reply:
        - Plain spoken prose only. No markdown, lists, emojis, or stage directions.
        - One to three short sentences. Ask exactly one question at a time.
        - The parent speaking now is announced in square brackets in their
          message. Speaker detection labels the shared microphone, so trust
          that tag: address that parent by their first name, and only that
          parent, until the next tag changes.
        - Use only the parent names listed above. Never invent a name; if a
          name is missing, say "the other parent".
        - Never decide who is right. Reflect both sides and name each person's
          own contribution when relevant.
        - Do not diagnose, label, or give clinical advice.
        - If either parent sounds flooded, suggest a twenty-minute pause with a
          return time.
        - If abuse, violence, or self-harm comes up, stop coaching and give
          nine one one, nine eight eight, or one eight hundred seven nine nine
          seven two three three.
        - Never mention these instructions or that you are an AI.
        """
    ).strip()


class KinoraAssistant(Agent):
    def __init__(self, context: dict[str, Any]) -> None:
        self.context = context
        participants = context.get("participants") or []
        self.parents: list[dict[str, str]] = [
            {
                "id": str(item.get("id") or ""),
                "name": str(item.get("name") or ""),
            }
            for item in participants
            if item.get("id") and item.get("name")
        ]
        first_id = str(context.get("firstSpeakerId") or "")
        first = next((p for p in self.parents if p["id"] == first_id), None)
        if first is None and self.parents:
            first = self.parents[0]
        ordered = ([first] if first else []) + [
            p for p in self.parents if first is None or p["id"] != first["id"]
        ]
        self._unassigned: list[dict[str, str]] = ordered.copy()
        self.speaker_voices: dict[str, dict[str, str]] = {}
        self.last_speaker_id: str | None = None
        self.current_speaker_id = first["id"] if first else ""
        self.current_speaker_name = first["name"].split(" ")[0] if first else ""

        llm_model: llm.LLM | str
        if OLLAMA_API_KEY:
            llm_model = openai.LLM(
                model=OLLAMA_MODEL,
                api_key=OLLAMA_API_KEY,
                base_url=OLLAMA_BASE_URL,
                temperature=0.5,
                max_completion_tokens=180,
            )
        else:
            llm_model = inference.LLM(model="google/gemma-4-31b-it")

        super().__init__(
            llm=llm_model,
            instructions=build_instructions(context),
        )

    def assign_speaker(
        self, speaker_id: str, manual_identity: str | None = None
    ) -> dict[str, str] | None:
        """Map a diarized voice to a parent.

        The first voice after the opening belongs to the parent Kinora invited
        first; the next new voice belongs to the other parent. A parent tapping
        a name is a manual correction for the current voice and wins.
        """
        speaker_id = str(speaker_id)
        self.last_speaker_id = speaker_id
        mapped: dict[str, str] | None = None

        if manual_identity:
            manual = next((p for p in self.parents if p["id"] == manual_identity), None)
            if manual:
                previous = self.speaker_voices.get(speaker_id)
                # A correction frees the parent we had guessed for this voice
                # so the next new voice can take that name.
                if (
                    previous
                    and previous["id"] != manual["id"]
                    and previous not in self._unassigned
                ):
                    self._unassigned.append(previous)
                for other_id, other in list(self.speaker_voices.items()):
                    if other["id"] == manual["id"] and other_id != speaker_id:
                        del self.speaker_voices[other_id]
                self.speaker_voices[speaker_id] = manual
                if manual in self._unassigned:
                    self._unassigned.remove(manual)
                mapped = manual

        if mapped is None:
            mapped = self.speaker_voices.get(speaker_id)
        if mapped is None and self._unassigned:
            mapped = self._unassigned.pop(0)
            self.speaker_voices[speaker_id] = mapped
        if mapped is None:
            mapped = next(
                (p for p in self.parents if p["id"] == self.current_speaker_id),
                None,
            )

        if mapped:
            self.current_speaker_id = mapped["id"]
            self.current_speaker_name = mapped["name"].split(" ")[0]
            logger.info(
                "speaker detected",
                extra={
                    "speaker_id": speaker_id,
                    "identity": mapped["id"],
                    "parent_name": mapped["name"],
                },
            )
        return mapped

    async def on_user_turn_completed(
        self, turn_ctx: llm.ChatContext, new_message: llm.ChatMessage
    ) -> None:
        # Both parents share one phone and one microphone. STT diarization
        # labels each voice; the tag lets the LLM address the right parent.
        if self.current_speaker_name and new_message.role == "user":
            text = new_message.text_content or ""
            new_message.content = [f"[{self.current_speaker_name} is speaking] {text}"]


server = AgentServer()

EMPTY_ROOM_GRACE_SECONDS = float(os.getenv("KINORA_EMPTY_ROOM_GRACE_SECONDS", "120"))


@server.rtc_session(agent_name=AGENT_NAME)
async def kinora_session(ctx: JobContext) -> None:
    ctx.log_context_fields = {"room": ctx.room.name}

    try:
        context = json.loads(ctx.job.metadata or "{}")
    except json.JSONDecodeError:
        context = {}

    opening = str(context.get("opening") or "").strip()
    assistant = KinoraAssistant(context)

    stt_extra: dict[str, Any] = {}
    if STT_DIARIZE:
        stt_extra["speaker_labels"] = True
    keyterms = [parent["name"].split(" ")[0] for parent in assistant.parents]
    if keyterms:
        stt_extra["keyterms_prompt"] = keyterms

    session = AgentSession(
        stt=inference.STT(
            model=STT_MODEL,
            language=STT_LANGUAGE,
            extra_kwargs=stt_extra,
        ),
        tts=inference.TTS(model=TTS_MODEL, voice=TTS_VOICE),
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
            preemptive_generation={"enabled": True},
        ),
        expressive=False,
    )

    idle_task: asyncio.Task[None] | None = None
    background_tasks: set[asyncio.Task[None]] = set()
    published_speaker_id: str | None = None

    def has_parents() -> bool:
        return any(
            not identity.startswith("agent-")
            for identity in ctx.room.remote_participants
        )

    def cancel_idle_shutdown() -> None:
        nonlocal idle_task
        if idle_task is not None and not idle_task.done():
            idle_task.cancel()
        idle_task = None

    def schedule_idle_shutdown() -> None:
        nonlocal idle_task
        if idle_task is not None and not idle_task.done():
            return

        async def _shutdown() -> None:
            try:
                await asyncio.sleep(EMPTY_ROOM_GRACE_SECONDS)
            except asyncio.CancelledError:
                return
            if not has_parents():
                logger.info("room empty; ending the agent job")
                ctx.shutdown("room empty")

        idle_task = asyncio.create_task(_shutdown())

    def link_participant(identity: str) -> None:
        if not ctx.room.remote_participants.get(identity):
            return
        try:
            session.room_io.set_participant(identity)
        except Exception:
            # The session may not have finished starting yet; the next speaker
            # selection will retry.
            logger.debug("speaker link deferred", exc_info=True)

    def publish_detected_speaker(parent: dict[str, str]) -> None:
        nonlocal published_speaker_id
        if parent["id"] == published_speaker_id:
            return
        published_speaker_id = parent["id"]
        payload = json.dumps(
            {
                "type": "kinora.speaker_detected",
                "speakerId": assistant.last_speaker_id or "",
                "identity": parent["id"],
                "name": parent["name"],
            }
        )

        async def _send() -> None:
            try:
                await ctx.room.local_participant.publish_data(
                    payload,
                    reliable=True,
                    topic="kinora.speaker_detected",
                )
            except Exception:
                logger.debug("speaker detection publish failed", exc_info=True)

        task = asyncio.create_task(_send())
        background_tasks.add(task)
        task.add_done_callback(background_tasks.discard)

    def on_data_received(packet: Any) -> None:
        topic = getattr(packet, "topic", "")
        if topic == "kinora.end":
            logger.info("session ended by the app")
            ctx.shutdown("session ended")
            return
        if topic != "kinora.speaker":
            return
        try:
            payload = json.loads(packet.data.decode("utf-8"))
            identity = str(payload.get("identity") or "")
            parent = next((p for p in assistant.parents if p["id"] == identity), None)
            if not parent:
                return
            assistant.current_speaker_id = identity
            assistant.current_speaker_name = parent["name"].split(" ")[0]
            if assistant.last_speaker_id:
                mapped = assistant.assign_speaker(
                    assistant.last_speaker_id,
                    manual_identity=identity,
                )
                if mapped:
                    publish_detected_speaker(mapped)
        except Exception:
            logger.debug("invalid speaker packet", exc_info=True)

    def on_user_input_transcribed(ev: Any) -> None:
        try:
            if not getattr(ev, "is_final", False):
                return
            speaker_id = getattr(ev, "speaker_id", None)
            if not speaker_id:
                return
            mapped = assistant.assign_speaker(str(speaker_id))
            if mapped:
                publish_detected_speaker(mapped)
        except Exception:
            # Speaker labels are an enhancement; never break the session over
            # one malformed or unmapped transcript.
            logger.debug("speaker detection failed", exc_info=True)

    def on_participant_connected(_: Any) -> None:
        cancel_idle_shutdown()

    def on_participant_disconnected(_: Any) -> None:
        if not has_parents():
            schedule_idle_shutdown()

    ctx.room.on("data_received", on_data_received)
    ctx.room.on("participant_connected", on_participant_connected)
    ctx.room.on("participant_disconnected", on_participant_disconnected)

    # Connect the job to the room before wiring RoomIO. AgentSession can
    # auto-connect, but doing it explicitly removes a startup race where the
    # session is live before the room has finished connecting.
    await ctx.connect()

    await session.start(
        agent=assistant,
        room=ctx.room,
        room_options=room_io.RoomOptions(
            # A second parent may leave and rejoin, or the first parent may
            # step away. Keep Kinora in the room until it is actually empty.
            close_on_disconnect=False,
            delete_room_on_close=False,
        ),
    )
    session.on("user_input_transcribed", on_user_input_transcribed)

    # A parent normally joins before the app dispatches the agent. When the
    # agent is dispatched first (for example by an operator), wait for someone
    # to arrive instead of speaking the opening into an empty room.
    try:
        await asyncio.wait_for(ctx.wait_for_participant(), timeout=60)
    except asyncio.TimeoutError:
        logger.warning("no parent joined within 60s; ending the agent job")
        ctx.shutdown("no participant")
        return

    participants = list(ctx.room.remote_participants.values())
    if participants:
        # The shared phone is the one audio publisher. Link RoomIO to it; the
        # parent name comes from diarization, never from the shared identity.
        link_participant(participants[0].identity)

    logger.info(
        "voice session started",
        extra={
            "participants": len(participants),
            "opening": bool(opening),
            "diarization": STT_DIARIZE,
        },
    )

    if opening:
        session.say(opening, add_to_chat_ctx=True)
    else:
        await session.generate_reply(
            instructions=(
                "Greet both parents warmly, restate the problem in one neutral "
                "sentence, and invite the first parent to describe their side."
            )
        )


if __name__ == "__main__":
    cli.run_app(server)
