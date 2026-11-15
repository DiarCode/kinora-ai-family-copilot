# Deployment

**Production: https://kinora-swart.vercel.app** — project `begisbayev7-1091/kinora`.
Push-to-deploy verified 2026-11-15 (GitHub Actions run 43686979177 → Vercel Ready in 26s).

Kinora runs on **Vercel** (Next.js 16, Node.js 24) with:

- **Supabase** for durable state (`DATA_BACKEND=supabase`)
- **LiveKit Cloud** for two-phone voice rooms and the hosted `kinora-agent` worker
- **Ollama Cloud** for the optional LLM path

The repo is connected to Vercel through the GitHub integration. Every push to
`main` produces a **Production** deployment; every pull request produces an
isolated **Preview** deployment.

---

## 1. One-time project setup

```bash
# Vercel CLI (or use npx vercel@latest)
npm i -g vercel

vercel login                 # device flow: approve in the browser
vercel link                  # create/link the "kinora" project
vercel git connect https://github.com/DiarCode/kinora-ai-family-copilot.git
```

`vercel git connect` requires the Vercel GitHub App to have access to the
repository. If the CLI prints an authorization URL, open it once; every later
push deploys automatically.

---

## 2. Environment variables

Production, Preview and Development all use the same values. Copy them from
your local `.env.local` (never commit that file) with the provided script:

```bash
./scripts/vercel-env-sync.sh                # production + preview + development
```

or add them manually:

```bash
vercel env add DATA_BACKEND production --value supabase
vercel env add LIVEKIT_API_SECRET production --sensitive
```

### Required for the app to function

| Variable | Example / notes |
| --- | --- |
| `DATA_BACKEND` | `supabase` — Vercel's filesystem is read-only and ephemeral |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional; server-side writes if RLS is tightened |
| `LIVEKIT_URL` | `wss://<project>.livekit.cloud` |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `KINORA_AI_MODE` | `llm` for the model-backed assistant, `engine` for deterministic |
| `KINORA_LLM_BASE_URL` | `https://ollama.com/v1` |
| `KINORA_LLM_MODEL` | `gemma4:31b` |
| `KINORA_LLM_API_KEY` | Ollama Cloud key |
| `KINORA_AGENT_NAME` | `kinora-agent` — must match the deployed worker |
| `KINORA_TTS_MODEL` / `KINORA_TTS_VOICE` | Cartesia Sonic 3 + voice id |

`KINORA_AGENT_DEPLOYMENT` and `LIVEKIT_AGENT_DEPLOYMENT` must stay **empty**
for the hosted default worker. `KINORA_TEST_MODE` must **not** be set in
Production; it exposes the e2e reset endpoint.

`NEXT_PUBLIC_*` variables cannot be stored as write-only secrets — Vercel
inlines them into the client bundle at build time.

After changing an environment variable, redeploy (or use **Redeploy** in the
dashboard) because values are captured at build time.

---

## 3. CI/CD pipeline

```
pull request ──► GitHub Actions: typecheck, lint, vitest, Playwright
main push    ──► GitHub Actions Deploy: same checks, then `vercel deploy --prod`
                 └─ Vercel builds remotely and updates the production domain
```

- **CI** — `.github/workflows/ci.yml`
  - `quality`: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`
  - `e2e`: Playwright (its config builds and starts the app with the
    deterministic file backend)
- **CD** — `.github/workflows/deploy.yml`. On every push to `main` it re-runs
  typecheck/lint/unit tests and then deploys with the Vercel CLI. It needs the
  repository secret `VERCEL_TOKEN`; project and org IDs are in the workflow.
  Without the secret the deploy step is skipped with a notice, so CI stays green.
- **Setting the token without pasting it into chat**:

  ```bash
  # create a token at https://vercel.com/account/tokens (name: kinora-github-actions)
  ./scripts/set-vercel-token.sh     # hidden prompt, uses your stored git credential
  ```

- **Alternative** — Vercel's native Git integration. Connect GitHub at
  <https://vercel.com/account/settings/connections>, then run
  `vercel git connect https://github.com/DiarCode/kinora-ai-family-copilot.git`.
  Vercel then builds on every push with no token. If you enable it, disable the
  Actions deploy job to avoid two production builds per commit.
- **Fast path** — `vercel --prod` deploys the working tree directly.

Promote or roll back from **Vercel → Project → Deployments**: any earlier
production deployment can be re-promoted instantly.

---

## 4. Vercel MCP (Claude Code)

The official Vercel plugin is installed and exposes the Vercel MCP server:

```bash
claude plugin install vercel@claude-plugins-official
```

On the next Claude Code session, authenticate it with `/mcp` → `vercel`.
MCP tools then cover deployment listing, build logs, runtime logs, projects and
domains. CLI commands remain the source of truth for env vars and git linking.

---

## 5. Verification after a deploy

```bash
curl -s https://<deployment-url>/api/health | jq
# { "ok": true, "storage": "ok", "storageBackend": "supabase",
#   "ai": {...}, "livekit": true, ... }

curl -s https://<deployment-url>/api/supabase/health | jq
# { "configured": true, "tableReady": true, ... }
```

Pages: `/` (landing), `/app` (home), `/app/assistant`, `/app/sessions`,
`/app/children`, `/app/courses`.

---

## 6. Known platform constraints

- **Rate limiter is in-memory.** Each serverless instance keeps its own
  counters. Move `src/lib/rate-limit.ts` to Upstash Redis for hard production
  limits.
- **Filesystem is not durable.** `DATA_BACKEND=file` will not survive a
  request on Vercel; keep Supabase enabled.
- **The voice agent is not hosted on Vercel.** It runs in LiveKit Cloud
  (`agents/kinora-voice`, deployed with `lk agent deploy`). The Vercel app only
  issues tokens and dispatch requests.
- **Supabase RLS is demo-scoped.** The included policies cover the single demo
  row; add per-family auth policies before storing real family data.

---

## 7. Troubleshooting

| Symptom | Check |
| --- | --- |
| Build fails on Vercel only | Node version (`engines.node` = 24.x), lockfile committed |
| `storage: "error"` in `/api/health` | Supabase URL/key and migration `0001_kinora_state.sql` |
| Voice room never dispatches | `LIVEKIT_*` values, `KINORA_AGENT_NAME`, agent status in LiveKit Cloud |
| Env change has no effect | Redeploy — env values are baked at build time |
| 401/403 from Supabase | Table exists and RLS policies were applied |
