#!/bin/bash

# Script to update HTML templates to use responsive image partials
# This script will scan all template files and replace standard <img> tags with our responsive partials

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

echo "ConFoot Template Updater"
echo "========================"
echo "This script will update HTML templates to use responsive image partials."
echo ""

# Function to process HTML files
process_html_files() {
    local dir=$1
    echo "Processing HTML files in $dir..."
    
    # Find all HTML files
    find "$dir" -type f -name "*.html" | while read -r file; do
        echo "Checking file: $file"
        
        # Look for standard img tags that aren't already in picture tags
        if grep -q "<img " "$file" && ! grep -q "<picture" "$file"; then
            echo "  Found standard img tags in $file"
            
            # Create a backup of the original file
            cp "$file" "${file}.bak"
            
            # Process the file with sed to replace img tags with partial calls
            # This is a simplified approach - manual review may be needed
            sed -i '' -E 's|<img([^>]*)src="([^"]*)"([^>]*)>|{{ partial "picture.html" (dict "src" "\2" "alt" "Image" "class" "img-fluid") }}|g' "$file"
            
            echo "  Updated img tags in $file"
        fi
    done
}

# Process layout templates
process_html_files "layouts"
process_html_files "themes/confoot/layouts"

echo ""
echo "Template update completed."
echo "Please review the changes manually to ensure they work correctly."
echo "Backup files with .bak extension have been created for all modified files."
echo ""
echo "Note: You may need to adjust the 'alt' text and other attributes in the updated templates."
