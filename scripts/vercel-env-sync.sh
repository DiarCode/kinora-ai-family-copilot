#!/usr/bin/env bash
# Push the local .env.local values into a linked Vercel project.
# Usage: ./scripts/vercel-env-sync.sh [production|preview|development ...]
# Requires: vercel CLI logged in and `vercel link` already run.
set -euo pipefail

ENVS="${*:-production preview development}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

[ -f "$ENV_FILE" ] || { echo "missing $ENV_FILE"; exit 1; }

# Keys that must exist in the deployment. Empty values are skipped.
KEYS=(
  DATA_BACKEND
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  SUPABASE_SERVICE_ROLE_KEY
  LIVEKIT_URL LIVEKIT_API_KEY LIVEKIT_API_SECRET
  KINORA_AI_MODE KINORA_LLM_BASE_URL KINORA_LLM_MODEL KINORA_LLM_API_KEY KINORA_LLM_TIMEOUT_MS
  OLLAMA_API_KEY
  KINORA_AGENT_NAME KINORA_STT_MODEL KINORA_STT_LANGUAGE KINORA_TTS_MODEL KINORA_TTS_VOICE
)

get() { grep -E "^$1=" "$ENV_FILE" | tail -1 | cut -d= -f2- || true; }

for key in "${KEYS[@]}"; do
  value="$(get "$key")"
  if [ -z "${value:-}" ]; then
    echo "skip $key (empty or absent)"
    continue
  fi
  # NEXT_PUBLIC_* values are inlined into the client bundle and cannot be
  # stored as write-only secrets.
  case "$key" in
    NEXT_PUBLIC_*) FLAG="--no-sensitive" ;;
    DATA_BACKEND|KINORA_AI_MODE|KINORA_LLM_BASE_URL|KINORA_LLM_MODEL|KINORA_LLM_TIMEOUT_MS|KINORA_AGENT_NAME|KINORA_STT_MODEL|KINORA_STT_LANGUAGE|KINORA_TTS_MODEL|KINORA_TTS_VOICE) FLAG="--no-sensitive" ;;
    *) FLAG="--sensitive" ;;
  esac
  for env in $ENVS; do
    vercel env add "$key" "$env" --value "$value" --force "$FLAG" --yes >/dev/null
    echo "set $key ($env)"
  done
done
