#!/bin/bash
# Build script for Cloudflare Pages

# Install any dependencies
npm ci

# Build Hugo site
hugo --minify

# Copy _headers and _redirects to public directory if they're not in static
if [ -f "_headers" ] && [ ! -f "public/_headers" ]; then
  cp _headers public/
fi

if [ -f "_redirects" ] && [ ! -f "public/_redirects" ]; then
  cp _redirects public/
fi

# Success message
echo "Build completed successfully!"
