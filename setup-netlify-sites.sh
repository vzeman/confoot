#!/bin/bash

# Script to set up multiple language-specific sites on Netlify
# This script helps create and configure Netlify sites for each language domain

# Define language codes and their corresponding domains
LANG_CODES=("cs" "sk" "de" "en" "gr" "hr" "lt" "lv" "ru" "sl" "ro" "li" "at" "ch" "pt")
DOMAIN_TLDS=("cz" "sk" "de" "eu" "gr" "hr" "lt" "lv" "ru" "si" "ro" "li" "at" "ch" "pt")

# Function to create a new Netlify site for a language
create_site() {
  lang_code=$1
  domain_tld=$2
  site_name="confoot-${lang_code}"
  domain="www.confoot.${domain_tld}"
  
  echo "Creating Netlify site for ${lang_code} (domain: ${domain})..."
  
  # Create the site
  npx netlify sites:create --name "${site_name}" --account-slug confoot
  
  # Configure the site with the package directory
  npx netlify sites:config --site-id "${site_name}" --package-directory "content/${lang_code}"
  
  # Set up the custom domain
  npx netlify domain:add "${site_name}" "${domain}"
  
  echo "Site created for ${lang_code} with domain ${domain}"
  echo "-----------------------------------------------------"
}

# Main script execution
echo "Setting up Netlify sites for all language domains..."
echo "-----------------------------------------------------"

# Process each language
for i in "${!LANG_CODES[@]}"; do
  lang_code="${LANG_CODES[$i]}"
  domain_tld="${DOMAIN_TLDS[$i]}"
  
  # Skip English (en) as it's already set up as the primary site
  if [ "${lang_code}" != "en" ]; then
    create_site "${lang_code}" "${domain_tld}"
  else
    echo "Skipping English (en) as it's already set up as the primary site"
    echo "-----------------------------------------------------"
  fi
done

echo "Done! All Netlify sites have been created."
echo "Next steps:"
echo "1. Go to the Netlify dashboard to verify all sites"
echo "2. Set up DNS records for each domain to point to Netlify"
echo "3. Deploy each site using 'npx netlify deploy --prod --site=site-name'"
