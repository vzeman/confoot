#!/bin/bash
# Build script for Cloudflare Pages

# Exit on error
set -e

# Build Hugo site
echo "Building Hugo site..."
hugo --minify

# Create workers directory structure
echo "Setting up Workers directory structure..."
mkdir -p .cloudflare/workers/domain-router
cp .cloudflare/workers/domain-router.js .cloudflare/workers/domain-router/index.js

# Copy _headers and _redirects to public directory if they're not in static
if [ -f "_headers" ] && [ ! -f "public/_headers" ]; then
  cp _headers public/
fi

if [ -f "_redirects" ] && [ ! -f "public/_redirects" ]; then
  cp _redirects public/
fi

# Success message
echo "Build completed successfully!"
