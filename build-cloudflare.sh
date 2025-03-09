#!/bin/bash

# ConFoot Build Script for Cloudflare Pages
# This script processes images and builds the site for Cloudflare Pages deployment

echo "Starting ConFoot build process for Cloudflare Pages..."

# Process images first
echo "Step 1: Processing images..."
bash ./scripts/simple_image_processor.sh

# Build the site with Hugo
echo "Step 2: Building site with Hugo..."
hugo --minify

echo "Build completed successfully!"
echo "The site is ready for deployment to Cloudflare Pages."
