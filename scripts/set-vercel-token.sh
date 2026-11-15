#!/usr/bin/env bash
# Stores a Vercel access token as the VERCEL_TOKEN GitHub Actions secret
# without passing it through chat. Uses the GitHub credential already stored
# by git (macOS keychain / credential store).
#
# Create a token at https://vercel.com/account/tokens (name: kinora-github-actions),
# then run: ./scripts/set-vercel-token.sh
set -euo pipefail

REPO="DiarCode/kinora-ai-family-copilot"
CRED=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null)
GH_TOKEN_VALUE=$(printf "%s" "$CRED" | sed -n 's/^password=//p')
[ -n "$GH_TOKEN_VALUE" ] || { echo "No stored GitHub credential found."; exit 1; }

printf "Paste the Vercel token (input hidden): "
read -rs VTOKEN
printf "\n"
[ -n "$VTOKEN" ] || { echo "Empty token."; exit 1; }

printf "%s" "$VTOKEN" | GH_TOKEN="$GH_TOKEN_VALUE" gh secret set VERCEL_TOKEN --repo "$REPO"
echo "VERCEL_TOKEN stored for $REPO."
