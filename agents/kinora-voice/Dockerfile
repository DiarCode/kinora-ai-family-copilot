# syntax=docker/dockerfile:1
ARG PYTHON_VERSION=3.13
FROM ghcr.io/astral-sh/uv:python${PYTHON_VERSION}-bookworm-slim

ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev

COPY src ./src

# The agent uses LiveKit Inference for STT/TTS/turn detection and Ollama Cloud
# for the LLM, so no local model download step is needed.
CMD ["uv", "run", "--no-dev", "src/kinora_agent.py", "start"]
