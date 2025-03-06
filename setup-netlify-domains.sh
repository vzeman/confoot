#!/bin/bash

# Script to add multiple domains to a Netlify site
# Make sure you have Netlify CLI installed and are logged in
# Install with: npm install -g netlify-cli
# Login with: netlify login

# Set your Netlify site name here
NETLIFY_SITE_NAME="confoot"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI is not installed. Please install it with: npm install -g netlify-cli"
    exit 1
fi

# Check if user is logged in
if ! netlify status | grep -q "Logged in"; then
    echo "You are not logged in to Netlify. Please login with: netlify login"
    exit 1
fi

# Read domains from file
while read -r domain; do
    # Skip empty lines
    if [ -z "$domain" ]; then
        continue
    fi
    
    echo "Adding domain: $domain"
    netlify domain:add "$domain" --site="$NETLIFY_SITE_NAME"
    
    # Add a small delay to avoid rate limiting
    sleep 1
done < "netlify-domains.txt"

echo "All domains have been added to your Netlify site."
echo "Please go to your Netlify dashboard to verify domain ownership and configure DNS settings."
echo "Netlify dashboard: https://app.netlify.com/sites/$NETLIFY_SITE_NAME/settings/domain"
