#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)
if [ $# -eq 0 ]; then
  # If no parameter is given, dump the whole git directory
  FILES=$(git ls-files)
else
  PATTERNS=""
  for pid in "$@"; do
    PATTERNS+="(PROJECT ID: $pid)|"
  done
  PATTERNS="${PATTERNS%|}"

  FILES=$(git ls-files | xargs grep -rlE "$PATTERNS" 2>/dev/null)
  if [ -z "$FILES" ]; then
    echo "No files found containing any of the specified project IDs."
    exit 0
  fi
fi

OUTPUT="I've attached all the relevant files. Please print out updated versions of all files that have changed. Print out changed files in full, and do not print out unchanged files. Each file should be in its own code block and should have a FILE comment at the top with its absolute path. Please make only the changes I've asked and no others. In particular, do not modify or delete any comments. *VERY IMPORTANT*: Do not remove any PROJECT ID comment, under any circumstance! Do not add any extra comments unless explicitly asked."
OUTPUT+=$'\n\n'

for f in $FILES; do
  OUTPUT+="// FILE: $(realpath $f)"
  OUTPUT+=$'\n'
  OUTPUT+=$(cat "$f")
  OUTPUT+=$'\n\n'
done

# Install xclip if not present
if ! command -v xclip >/dev/null 2>&1; then
  echo "xclip not found, installing..."
  sudo apt-get update && sudo apt-get install -y xclip
fi

# Copy to clipboard
echo "$OUTPUT" | xclip -selection clipboard

echo "Copied files to clipboard"
