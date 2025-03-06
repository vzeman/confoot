#!/bin/bash
# Script to remove all Netlify-related files

echo "Removing Netlify configuration files..."
rm -f netlify.toml
rm -f netlify.root.toml
rm -f netlify-domains.txt

echo "Removing Netlify setup scripts..."
rm -f copy-netlify-toml.sh
rm -f setup-netlify-domains.sh
rm -f setup-netlify-sites.sh
rm -f update-language-netlify.sh
rm -f language-netlify-template.toml

echo "Removing language-specific Netlify files..."
rm -f content/at/netlify.toml
rm -f content/ch/netlify.toml
rm -f content/cs/netlify.toml
rm -f content/de/netlify.toml
rm -f content/en/netlify.toml
rm -f content/gr/netlify.toml
rm -f content/hr/netlify.toml
rm -f content/li/netlify.toml
rm -f content/lt/netlify.toml
rm -f content/lv/netlify.toml
rm -f content/pt/netlify.toml
rm -f content/ro/netlify.toml
rm -f content/ru/netlify.toml
rm -f content/sk/netlify.toml
rm -f content/sl/netlify.toml

echo "All Netlify-related files have been removed."
