#!/bin/bash
# Cloudflare Pages Build Script
# This script builds the Hugo site for Cloudflare Pages without using Wrangler

# Exit on error
set -e

# Print debug information
echo "Build environment:"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Hugo version: $(hugo version)"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Skip npm installation since we don't need it for Hugo
echo "Skipping npm installation as it's not required for Hugo build"

# Clean up any old Workers configuration
echo "Cleaning up any old Workers configuration"
rm -rf .cloudflare wrangler.toml

# Build Hugo site
echo "Building Hugo site..."
hugo --minify

# Create necessary directories and files for Cloudflare Pages
echo "Setting up Cloudflare Pages configuration..."

# Create _headers file for security headers if it doesn't exist
if [ ! -f "public/_headers" ]; then
  cat > public/_headers << 'EOH'
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOH
  echo "Created _headers file"
fi

# Create _redirects file for domain-specific routing if it doesn't exist
if [ ! -f "public/_redirects" ]; then
  cat > public/_redirects << 'EOR'
# Language-specific domain redirects
# These rules ensure each domain serves the correct language content
# No redirects needed as this will be handled by Cloudflare Pages Functions
EOR
  echo "Created _redirects file"
fi

# Cloudflare Pages Functions directory is automatically detected
# No need to copy it to the output directory
echo "Cloudflare Pages Functions directory: functions/"
ls -la functions/

echo "Build completed successfully!"
echo "Directory contents after build: $(ls -la public)"
