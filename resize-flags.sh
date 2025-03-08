#!/bin/bash

# Create a backup directory for flags
FLAG_BACKUP_DIR="/Users/viktorzeman/work/confoot/flag-backups"
mkdir -p "$FLAG_BACKUP_DIR"

# Find all flag images and process them
find /Users/viktorzeman/work/confoot/static/images/flags -type f -name "*.png" | while read img; do
  # Get image dimensions
  width=$(identify -format "%w" "$img")
  
  # Create backup of original image
  backup_path="$FLAG_BACKUP_DIR/$(basename "$img")"
  cp "$img" "$backup_path"
  
  echo "Processing flag: $img (width: $width)"
  
  if [ "$width" -gt 30 ]; then
    echo "Resizing to 30px width: $img"
    # Resize image to 30px width while maintaining aspect ratio and optimize
    mogrify -resize 30x -quality 95 -strip "$img"
  else
    echo "Flag already 30px or smaller, skipping: $img"
  fi
done

echo "Flag image resizing complete. Backups stored in $FLAG_BACKUP_DIR"
