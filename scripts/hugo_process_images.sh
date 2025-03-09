#!/bin/bash

# ConFoot Hugo Image Processing Script
# This script uses Hugo's built-in image processing to generate multiple sizes and WebP versions

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "Error: Hugo is not installed. Please install Hugo to run this script."
    exit 1
fi

echo "ConFoot Hugo Image Processing"
echo "============================"
echo "This script will use Hugo to process all images in your project."
echo "It will generate the following sizes for each image:"
echo "- 100px width (for all images)"
echo "- 400px width (only if original is larger than 400px)"
echo "- 1024px width (only if original is larger than 1024px)"
echo "And create WebP versions for each size."
echo ""

# Create a temporary content file that references all images
echo "Creating temporary content file to process images..."
TEMP_DIR="content/temp-image-processing"
mkdir -p "$TEMP_DIR"

# Find all images in the assets directory
echo "Finding images in assets directory..."
IMAGES=$(find assets -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \))
IMAGE_COUNT=$(echo "$IMAGES" | wc -l | tr -d ' ')
echo "Found $IMAGE_COUNT images."

# Create a markdown file that references all images
cat > "$TEMP_DIR/index.md" << EOF
---
title: "Image Processing"
date: $(date +%Y-%m-%dT%H:%M:%S%z)
draft: false
---

This is a temporary page to process all images in the project.

EOF

# Add image processing shortcodes for each image
for img in $IMAGES; do
    # Get relative path from assets directory
    rel_path=${img#assets/}
    
    # Add image processing for each size
    cat >> "$TEMP_DIR/index.md" << EOF

### Processing: $rel_path

{{< process-image src="$rel_path" alt="Image" sizes="100,400,1024" >}}

EOF
done

# Create a shortcode to process images
mkdir -p "layouts/shortcodes"
cat > "layouts/shortcodes/process-image.html" << EOF
{{/* 
  Image processing shortcode
  
  Parameters:
  - src: Image source path (required)
  - alt: Alt text for accessibility (optional)
  - sizes: Comma-separated list of widths to generate (optional, default: "100,400,1024")
*/}}

{{ \$src := .Get "src" }}
{{ \$alt := .Get "alt" | default "Image" }}
{{ \$sizesStr := .Get "sizes" | default "100,400,1024" }}
{{ \$sizes := split \$sizesStr "," }}

{{ \$image := resources.Get \$src }}
{{ if \$image }}
  {{ \$originalWidth := \$image.Width }}
  {{ \$originalHeight := \$image.Height }}
  {{ \$originalType := \$image.MediaType.SubType }}
  
  <div class="image-processing-result">
    <p>Original: {{ \$src }} ({{ \$originalWidth }}x{{ \$originalHeight }}px, {{ \$originalType }})</p>
    <ul>
      {{ range \$sizes }}
        {{ \$targetWidth := int . }}
        {{ if le \$targetWidth \$originalWidth }}
          {{ \$resized := \$image.Resize (printf "%dx" \$targetWidth) }}
          {{ \$webp := \$image.Resize (printf "%dx webp" \$targetWidth) }}
          <li>
            {{ \$targetWidth }}px: 
            {{ \$resized.RelPermalink }} ({{ \$resized.Width }}x{{ \$resized.Height }}px)
            WebP: {{ \$webp.RelPermalink }}
          </li>
        {{ else }}
          <li>{{ \$targetWidth }}px: Skipped (original width {{ \$originalWidth }}px is smaller than target)</li>
        {{ end }}
      {{ end }}
    </ul>
  </div>
{{ else }}
  <div class="image-processing-error">
    <p>Error: Image not found - {{ \$src }}</p>
  </div>
{{ end }}
EOF

# Build the site to process all images
echo "Building site to process images..."
hugo --minify

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Image processing completed successfully."
    
    # Count processed images
    WEBP_COUNT=$(find public/temp-image-processing -name "*.webp" | wc -l | tr -d ' ')
    echo "Generated $WEBP_COUNT WebP images."
    
    # Clean up temporary files
    echo "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
    rm -f "layouts/shortcodes/process-image.html"
    
    echo "You can now use the processed images in your Hugo templates."
else
    echo "Image processing failed. Please check the error messages above."
    exit 1
fi
