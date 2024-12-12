#!/usr/bin/env bash

if [ $? -ne 0 ]; then
  echo "Not a git repository."
  exit 1
fi

cd $(git rev-parse --show-toplevel)
if [ -z "$1" ]; then
  # If no parameter is given, dump the whole git directory
  FILES=$(git ls-files)
else
  FILES=$(grep -rl "PROJECT ID: $1" .)
  if [ -z "$FILES" ]; then
    echo "No files found containing 'projectId: $1'"
    exit 0
  fi
fi

OUTPUT="I've attached all the relevant files. Please print out updated versions of all files that have changed. Do not print out unchanged files. Each file should be in its own code block. Please make only the changes I've asked and no others. In particular, do not modify or delete any comments unless they're directly related to your changes. Do not add any comments unless they would be useful to someone reading this code in a year.\n\n"

for f in $FILES; do
  OUTPUT+="// FILE: $(realpath $f)\n"
  OUTPUT+=$(cat "$f")
  OUTPUT+="\n\n"
done

# Install xclip if not present
if ! command -v xclip >/dev/null 2>&1; then
  echo "xclip not found, installing..."
  sudo apt-get update && sudo apt-get install -y xclip
fi

# Copy to clipboard
echo -e "$OUTPUT" | xclip -selection clipboard

echo "Copied files to clipboard"

