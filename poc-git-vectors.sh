#!/usr/bin/env bash
# Regenerate the git object-format test vectors from the REAL git binary.
#
#   ./git-object-vectors.sh [workdir] [outdir]
#
# Defaults: workdir=/tmp/git-vectors-run  outdir=/tmp
# Writes <outdir>/git-object-vectors.json
#
# Every id below comes from git itself (hash-object / write-tree / commit-tree).
# The preimage recorded for each vector is the zlib-INFLATED loose object on
# disk, so it is git's own bytes, not a reconstruction. The script then hashes
# those bytes with sha1sum and asserts the result equals git's id.

set -eu

WORK="${1:-/tmp/git-vectors-run}"
OUT="${2:-/tmp}"

rm -rf "$WORK"
mkdir -p "$WORK"
cd "$WORK"

# --- fixed, reproducible identity and clock -------------------------------
export GIT_AUTHOR_NAME="Vector Author"
export GIT_AUTHOR_EMAIL="vectors@example.com"
export GIT_COMMITTER_NAME="Vector Author"
export GIT_COMMITTER_EMAIL="vectors@example.com"
export TZ=UTC
export LC_ALL=C

git init -q -b main .
git config core.autocrlf false
git config core.fileMode true
git config gc.auto 0

MANIFEST="$WORK/manifest.tsv"
: > "$MANIFEST"
record() { printf '%s\t%s\t%s\n' "$1" "$2" "$3" >> "$MANIFEST"; }

# --- blobs ----------------------------------------------------------------
printf '' > empty.txt
B_EMPTY=$(git hash-object -t blob -w empty.txt)
record blob "blob-empty" "$B_EMPTY"

printf 'hello world\n' > hello.txt
B_HELLO=$(git hash-object -t blob -w hello.txt)
record blob "blob-hello-world" "$B_HELLO"

printf 'line one\nline two\nline three\n' > multi.txt
B_MULTI=$(git hash-object -t blob -w multi.txt)
record blob "blob-multiline" "$B_MULTI"

# non-ASCII: 5 characters, 6 bytes - the header length is in BYTES
printf 'caf\xc3\xa9\n' > utf8.txt
B_UTF8=$(git hash-object -t blob -w utf8.txt)
record blob "blob-utf8-cafe" "$B_UTF8"

# supporting blobs used by the trees
printf 'alpha\n' > a.txt
printf 'beta\n' > b.txt
mkdir -p sub && printf 'nested\n' > sub/deep.txt
mkdir -p a && printf 'in-dir\n' > a/f.txt
printf 'zero\n' > a0.txt

# --- tree 1: flat, two files, one of them executable ----------------------
export GIT_INDEX_FILE="$WORK/.idx-flat"; rm -f "$GIT_INDEX_FILE"
git add a.txt b.txt
git update-index --chmod=+x b.txt        # filesystem-independent 100755
T_FLAT=$(git write-tree)
record tree "tree-flat-two-files" "$T_FLAT"

# --- tree 2: contains a subdirectory --------------------------------------
export GIT_INDEX_FILE="$WORK/.idx-nested"; rm -f "$GIT_INDEX_FILE"
git add a.txt sub/deep.txt
T_NESTED=$(git write-tree)
record tree "tree-with-subdirectory" "$T_NESTED"

# --- tree 3: sort order, file 'a.txt' against directory 'a' ---------------
export GIT_INDEX_FILE="$WORK/.idx-sort1"; rm -f "$GIT_INDEX_FILE"
git add a.txt a/f.txt
T_SORT1=$(git write-tree)
record tree "tree-sort-a.txt-vs-dir-a" "$T_SORT1"

# --- tree 4: sort order, directory 'a' against file 'a0.txt' --------------
export GIT_INDEX_FILE="$WORK/.idx-sort2"; rm -f "$GIT_INDEX_FILE"
git add a/f.txt a0.txt
T_SORT2=$(git write-tree)
record tree "tree-sort-dir-a-vs-a0.txt" "$T_SORT2"

unset GIT_INDEX_FILE

# --- commits --------------------------------------------------------------
export GIT_AUTHOR_DATE="1700000000 +0000"
export GIT_COMMITTER_DATE="1700000000 +0000"
C_ROOT=$(git commit-tree "$T_FLAT" -m "first save")
record commit "commit-root-no-parent" "$C_ROOT"

export GIT_AUTHOR_DATE="1700003600 +0100"
export GIT_COMMITTER_DATE="1700003600 +0100"
C_CHILD=$(git commit-tree "$T_NESTED" -p "$C_ROOT" -m "second save")
record commit "commit-with-parent" "$C_CHILD"

# --- emit JSON and self-check --------------------------------------------
python3 - "$WORK" "$OUT/git-object-vectors.json" <<'PY'
import hashlib, json, pathlib, sys, zlib

work = pathlib.Path(sys.argv[1])
outfile = pathlib.Path(sys.argv[2])
objdir = work / ".git" / "objects"

PRINTABLE = set(range(0x20, 0x7F)) | {0x09, 0x0A, 0x0D}

def escape(raw: bytes) -> str:
    out = []
    for i, b in enumerate(raw):
        if b == 0x00:
            # "\0" is only JS-safe when the next character is not a digit;
            # "\04" would be read as a legacy octal escape.
            nxt = raw[i + 1] if i + 1 < len(raw) else 0
            out.append("\\x00" if 0x30 <= nxt <= 0x39 else "\\0")
        elif b == 0x0A:
            out.append("\\n")
        elif b == 0x5C:
            out.append("\\\\")
        elif b == 0x22:
            out.append('\\"')
        elif b in PRINTABLE:
            out.append(chr(b))
        else:
            out.append("\\x%02x" % b)
    return "".join(out)

vectors, failures = [], []
for line in (work / "manifest.tsv").read_text().splitlines():
    typ, label, sha = line.split("\t")
    raw = zlib.decompress((objdir / sha[:2] / sha[2:]).read_bytes())
    actual = hashlib.sha1(raw).hexdigest()
    if actual != sha:
        failures.append((label, sha, actual))
    body = raw.split(b"\0", 1)[1]
    binary = any(b not in PRINTABLE for b in body)
    vectors.append({
        "type": typ,
        "label": label,
        "preimageEscaped": escape(raw),
        "preimageHexIfBinary": raw.hex() if binary else None,
        "sha": sha,
    })

outfile.write_text(json.dumps(vectors, indent=2) + "\n")
for v in vectors:
    print("%-8s %-28s %s" % (v["type"], v["label"], v["sha"]))
print("self-check sha1(preimage) == git id:",
      "PASS" if not failures else "FAIL %r" % (failures,))
if failures:
    sys.exit(1)
PY
