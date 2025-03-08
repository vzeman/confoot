#!/bin/bash

# Create a backup directory
BACKUP_DIR="/Users/viktorzeman/work/confoot/image-backups"
mkdir -p "$BACKUP_DIR"

# Find all images and process them
find /Users/viktorzeman/work/confoot/static -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \) | grep -v "node_modules" | grep -v "public" | while read img; do
  # Get image dimensions
  width=$(identify -format "%w" "$img")
  
  # Create backup of original image
  backup_path="$BACKUP_DIR/$(basename "$img")"
  cp "$img" "$backup_path"
  
  echo "Processing: $img (width: $width)"
  
  if [ "$width" -gt 1024 ]; then
    echo "Resizing to 1024px width: $img"
    # Resize image to 1024px width while maintaining aspect ratio and optimize
    mogrify -resize 1024x -quality 85 -strip "$img"
  else
    echo "Optimizing without resizing: $img"
    # Just optimize the image without resizing
    mogrify -quality 85 -strip "$img"
  fi
done

echo "Image optimization complete. Backups stored in $BACKUP_DIR"
