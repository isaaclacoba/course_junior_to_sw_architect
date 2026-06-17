#!/usr/bin/env bash
# One-click launcher for the training site.
# A browser cannot start a server by itself (security sandbox), so this small
# script starts a local web server and then opens the site for you.
cd "$(dirname "$0")" || exit 1
URL="http://localhost:8080"
echo
echo "  Starting the training site..."
echo "  Keep this window open while you use it. Press Ctrl+C to stop."
echo

# Open the browser once the server is up (detect macOS vs Linux).
( sleep 1
  if command -v open >/dev/null 2>&1; then open "$URL"        # macOS
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" # Linux
  fi ) &

python3 -m http.server 8080
