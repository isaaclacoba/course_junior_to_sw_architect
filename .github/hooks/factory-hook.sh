#!/bin/sh
# sw-factory hook wrapper.
#
# A command hook that cannot start is FAIL-OPEN: the agent carries on and the
# hook silently never works. `node` is not on PATH in every shell here, so this
# looks for it rather than assuming it. If no node is found we print `{}` and
# exit 0 - quiet and harmless - because a way-of-working reminder must never be
# the reason a session breaks.
set -u
event="${1:-}"
root="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"

find_node() {
  command -v node 2>/dev/null && return 0
  # globs sort ascending, so keeping the last match picks the newest install
  newest=""
  for n in "$HOME"/.nvm/versions/node/*/bin/node; do
    [ -x "$n" ] && newest="$n"
  done
  [ -n "$newest" ] && printf '%s\n' "$newest" && return 0
  for n in /usr/local/bin/node /usr/bin/node /opt/homebrew/bin/node; do
    [ -x "$n" ] && printf '%s\n' "$n" && return 0
  done
  return 1
}

node_bin="$(find_node | head -n 1)"
if [ -z "$node_bin" ]; then
  printf '{}'
  exit 0
fi

"$node_bin" "$root/tools/factory.mjs" hook "$event" 2>/dev/null || printf '{}'
exit 0
