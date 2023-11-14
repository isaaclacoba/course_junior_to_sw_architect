#!/usr/bin/env bash
# One-click launcher for the training site.
# A browser cannot start a server by itself (security sandbox), so this small
# script starts a local web server and then opens the site for you.
#
# It sends "Cache-Control: no-store" on everything. Plain `python3 -m http.server`
# sends no cache header at all, so browsers fall back to heuristic caching and
# happily serve a lesson's data file from memory minutes after it changed. That
# has misled three content reviews: an edit was on disk, in the commit and on the
# wire, and the page still showed the old text through repeated reloads.
cd "$(dirname "$0")" || exit 1
PORT="${1:-8080}"
URL="http://localhost:$PORT"
echo
echo "  Starting the training site on $URL"
echo "  Nothing is cached, so a reload always shows what is on disk."
echo "  Keep this window open while you use it. Press Ctrl+C to stop."
echo

# Open the browser once the server is up (detect macOS vs Linux).
( sleep 1
  if command -v open >/dev/null 2>&1; then open "$URL"        # macOS
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" # Linux
  fi ) &

python3 - "$PORT" <<'PY'
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

ThreadingHTTPServer(("", int(sys.argv[1])), NoCache).serve_forever()
PY
