#!/bin/bash

# Script to update language-specific netlify.toml files for monorepo setup
# Based on Netlify's recommended monorepo setup

# Template file
TEMPLATE_FILE="language-netlify-template.toml"

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Error: Template file $TEMPLATE_FILE not found!"
  exit 1
fi

# Define language codes and their corresponding domains
LANG_CODES=("cs" "sk" "de" "en" "gr" "hr" "lt" "lv" "ru" "sl" "ro" "li" "at" "ch" "pt")
DOMAIN_TLDS=("cz" "sk" "de" "eu" "gr" "hr" "lt" "lv" "ru" "si" "ro" "li" "at" "ch" "pt")

# Process each language
for i in "${!LANG_CODES[@]}"; do
  lang_code="${LANG_CODES[$i]}"
  domain_tld="${DOMAIN_TLDS[$i]}"
  target_file="content/$lang_code/netlify.toml"
  
  echo "Updating $target_file for language $lang_code (domain: $domain_tld)"
  
  # Create the language-specific netlify.toml
  sed -e "s/LANG_CODE/$lang_code/g" -e "s/DOMAIN_TLD/$domain_tld/g" "$TEMPLATE_FILE" > "$target_file"
done

echo "Done! Updated netlify.toml files for all languages."
