#!/bin/bash

# Script to copy netlify.toml to each language subdirectory
# This ensures each language has its own Netlify configuration

# Source netlify.toml file
SOURCE_FILE="netlify.toml"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "Error: Source file $SOURCE_FILE not found!"
  exit 1
fi

# Get all language directories
LANG_DIRS=$(find content -maxdepth 1 -type d | grep -v "^content$")

# Copy netlify.toml to each language directory
for dir in $LANG_DIRS; do
  echo "Copying $SOURCE_FILE to $dir/"
  cp "$SOURCE_FILE" "$dir/"
done

echo "Done! netlify.toml has been copied to all language directories."
