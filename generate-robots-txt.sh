#!/bin/bash

# Script to generate robots.txt files for each language domain
# This ensures each language has its own robots.txt file with the correct domain

# Template file
TEMPLATE_FILE="robots-template.txt"

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
  target_file="content/$lang_code/robots.txt"
  
  echo "Generating $target_file for domain: confoot.$domain_tld"
  
  # Create the language-specific robots.txt
  sed -e "s/DOMAIN_TLD/$domain_tld/g" "$TEMPLATE_FILE" > "$target_file"
done

echo "Done! Generated robots.txt files for all language domains."
