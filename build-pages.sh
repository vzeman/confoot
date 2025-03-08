#!/bin/bash
# Cloudflare Pages Build Script
# This script is specifically designed to handle the Cloudflare Pages build process

# Exit on error
set -e

echo "Starting Cloudflare Pages build process"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Check if Wrangler is being called and intercept it
if [[ "$1" == "wrangler" || "$1" == "npx wrangler deploy" ]]; then
  echo "Intercepting Wrangler command - using Hugo directly instead"
  # Skip Wrangler and just build with Hugo
  hugo --minify
  exit 0
fi

# Remove any Wrangler configuration
echo "Removing any Wrangler configuration"
rm -rf .cloudflare wrangler.toml

# Build the Hugo site
echo "Building Hugo site with Hugo version: $(hugo version)"
hugo --minify

# Create _headers file for security headers
echo "Creating security headers"
cat > public/_headers << 'EOH'
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOH

echo "Build completed successfully"
echo "Contents of public directory:"
ls -la public/
