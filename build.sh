#!/bin/bash
# Build script for Cloudflare Pages

# Exit on error
set -e

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

echo "Build completed successfully!"
