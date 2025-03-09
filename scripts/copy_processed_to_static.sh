#!/bin/bash

# Copy processed images back to static directory
echo "Copying processed images back to static directory..."

# Find all processed images in resources/_gen/images
find resources/_gen/images -type f | while read -r img; do
    # Get the relative path
    rel_path=${img#resources/_gen/images/}
    
    # Create the target directory in static if it doesn't exist
    target_dir="static/processed/$(dirname "$rel_path")"
    mkdir -p "$target_dir"
    
    # Copy the processed image to static
    cp "$img" "$target_dir/$(basename "$img")"
    echo "Copied: $img -> $target_dir/$(basename "$img")"
done

echo "Done copying processed images to static directory."
