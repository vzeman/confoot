#!/bin/bash

# Simple Image Processor for ConFoot
# This script uses Hugo's built-in image processing capabilities

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "Error: Hugo is not installed. Please install Hugo to run this script."
    exit 1
fi

echo "ConFoot Simple Image Processor"
echo "============================="
echo "This script will create a temporary Hugo page that processes all images."
echo ""

# Create a temporary content file to process images
mkdir -p content/temp-processor
cat > content/temp-processor/index.md << EOF
---
title: "Image Processor"
date: $(date +%Y-%m-%d)
draft: false
---

## Image Processing Test Page

This page processes images to ensure all required sizes and formats exist.

EOF

# Process images from assets directory
echo "Finding images in assets directory..."
find assets -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r img; do
    rel_path=${img#assets/}
    echo "Processing asset: $rel_path"
    
    # Add image processing for each image to the markdown file
    cat >> content/temp-processor/index.md << EOF

### Asset: $rel_path

{{< figure src="$rel_path" alt="Image" >}}

EOF
done

# Process images from static/images directory
echo "Finding images in static/images directory..."
find static/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r img; do
    # For static images, we need to copy them to assets for Hugo to process them
    rel_path=${img#static/}
    target_path="assets/$rel_path"
    
    echo "Processing static image: $rel_path"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$target_path")"
    
    # Copy the image to assets if it doesn't already exist there
    if [ ! -f "$target_path" ]; then
        cp "$img" "$target_path"
        echo "  Copied to assets for processing"
    fi
    
    # Add image processing for each image to the markdown file
    cat >> content/temp-processor/index.md << EOF

### Static: $rel_path

{{< figure src="$rel_path" alt="Image" >}}

EOF
done

# Process images from content directory (featured images, etc.)
echo "Finding images in content directory..."
find content -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -not -path "*/temp-processor/*" | while read -r img; do
    # For content images, we need to copy them to assets for Hugo to process them
    rel_path=${img#content/}
    target_path="assets/content-images/$rel_path"
    
    echo "Processing content image: $rel_path"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$target_path")"
    
    # Copy the image to assets
    cp "$img" "$target_path"
    echo "  Copied to assets for processing"
    
    # Add image processing for each image to the markdown file
    cat >> content/temp-processor/index.md << EOF

### Content: $rel_path

{{< figure src="content-images/$rel_path" alt="Image" >}}

EOF
done

# Process all image references in content markdown files
echo "Finding image references in markdown files..."
grep -r --include="*.md" --exclude-dir="temp-processor" -E '!\[.*\]\(.*\.(jpg|jpeg|png)' content | while read -r line; do
    # Extract the file path and the image path
    file_path=$(echo "$line" | cut -d':' -f1)
    img_ref=$(echo "$line" | grep -oE '\(.*\.(jpg|jpeg|png)' | sed 's/^(//' | sed 's/)$//')
    
    # Skip external URLs
    if [[ "$img_ref" == http* ]]; then
        continue
    fi
    
    echo "Found image reference: $img_ref in $file_path"
    
    # Handle relative paths
    if [[ "$img_ref" != /* ]]; then
        # Get the directory of the markdown file
        md_dir=$(dirname "$file_path")
        # Resolve the relative path
        img_path="$md_dir/$img_ref"
    else
        # Remove leading slash for absolute paths
        img_path="${img_ref#/}"
        # Check if it exists in static
        if [[ -f "static/$img_path" ]]; then
            img_path="static/$img_path"
        else
            # Try content
            img_path="content/$img_path"
        fi
    fi
    
    # Check if the image exists
    if [[ -f "$img_path" ]]; then
        # Determine target path in assets
        if [[ "$img_path" == static/* ]]; then
            target_path="assets/${img_path#static/}"
        else
            target_path="assets/content-images/${img_path#content/}"
        fi
        
        # Create directory if it doesn't exist
        mkdir -p "$(dirname "$target_path")"
        
        # Copy the image to assets if it doesn't already exist there
        if [ ! -f "$target_path" ]; then
            cp "$img_path" "$target_path"
            echo "  Copied to assets for processing: $target_path"
        fi
        
        # Add to the processor page
        rel_target_path=${target_path#assets/}
        cat >> content/temp-processor/index.md << EOF

### Markdown Reference: $img_ref

{{< figure src="$rel_target_path" alt="Image from markdown" >}}

EOF
    else
        echo "  Warning: Image file not found: $img_path"
    fi
done

# Create a script to copy processed images back to static
cat > scripts/copy_processed_to_static.sh << EOF
#!/bin/bash

# Copy processed images back to static directory
echo "Copying processed images back to static directory..."

# Find all processed images in resources/_gen/images
find resources/_gen/images -type f | while read -r img; do
    # Get the relative path
    rel_path=\${img#resources/_gen/images/}
    
    # Create the target directory in static if it doesn't exist
    target_dir="static/processed/\$(dirname "\$rel_path")"
    mkdir -p "\$target_dir"
    
    # Copy the processed image to static
    cp "\$img" "\$target_dir/\$(basename "\$img")"
    echo "Copied: \$img -> \$target_dir/\$(basename "\$img")"
done

echo "Done copying processed images to static directory."
EOF

chmod +x scripts/copy_processed_to_static.sh

# Start Hugo server to process the images
echo "Starting Hugo server to process images..."
echo "Please wait while Hugo processes the images..."
hugo server -D --disableFastRender &
SERVER_PID=$!

# Give Hugo some time to process the images
sleep 20

# Kill the Hugo server
kill $SERVER_PID

echo "Image processing completed."
echo "Cleaning up temporary files..."
rm -rf content/temp-processor

echo "Verifying processed images..."
find resources/_gen/images -type f | grep -E '\.(webp|jpg|jpeg|png)' | wc -l

echo "Running script to copy processed images to static directory..."
./scripts/copy_processed_to_static.sh

echo "Done! You can now use the processed images in your Hugo templates."
