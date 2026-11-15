from kinora_agent import KinoraAssistant, build_instructions


def make_assistant() -> KinoraAssistant:
    return KinoraAssistant(
        {
            "problem": "Bedtime has become a fight every night.",
            "participants": [
                {"id": "member_michael", "name": "Michael Bennett"},
                {"id": "member_lucy", "name": "Lucy Bennett"},
            ],
            "firstSpeakerId": "member_michael",
            "firstSpeakerName": "Michael Bennett",
        }
    )


def test_instructions_include_the_problem_and_both_parents() -> None:
    text = build_instructions(
        {
            "problem": "Bedtime has become a fight every night.",
            "participants": [
                {"id": "member_michael", "name": "Michael Bennett"},
                {"id": "member_lucy", "name": "Lucy Bennett"},
            ],
            "firstSpeakerName": "Michael Bennett",
        }
    )
    assert "Bedtime has become a fight every night." in text
    assert "Michael Bennett" in text
    assert "Lucy Bennett" in text
    assert "twenty-minute pause" in text
    assert "nine eight eight" in text


def test_instructions_have_a_safe_generic_fallback() -> None:
    text = build_instructions({})
    assert "recurring family disagreement" in text
    assert "the two parents" in text
    assert "Never decide who is right" in text


def test_diarization_maps_the_first_voice_to_the_invited_parent() -> None:
    assistant = make_assistant()
    assert assistant.current_speaker_name == "Michael"

    first = assistant.assign_speaker("0")
    assert first is not None
    assert first["id"] == "member_michael"
    assert assistant.current_speaker_name == "Michael"

    second = assistant.assign_speaker("1")
    assert second is not None
    assert second["id"] == "member_lucy"
    assert assistant.current_speaker_name == "Lucy"

    # The same voice keeps its parent on later turns.
    again = assistant.assign_speaker("0")
    assert again is not None
    assert again["id"] == "member_michael"


def test_manual_speaker_correction_wins_and_frees_the_other_parent() -> None:
    assistant = make_assistant()
    assistant.assign_speaker("0")

    corrected = assistant.assign_speaker("0", manual_identity="member_lucy")
    assert corrected is not None
    assert corrected["id"] == "member_lucy"

    next_voice = assistant.assign_speaker("1")
    assert next_voice is not None
    assert next_voice["id"] == "member_michael"
