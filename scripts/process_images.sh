#!/bin/bash

# ConFoot Image Processing Script
# This script processes all images in the project to generate multiple sizes and WebP versions

# Change to the project root directory
cd "$(dirname "$0")/.." || exit

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d '.' -f 1)

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "Creating package.json..."
    cat > "package.json" << EOF
{
  "name": "confoot-image-processing",
  "version": "1.0.0",
  "description": "ConFoot Image Processing",
  "private": true,
  "scripts": {
    "process-images": "node scripts/process_images.js"
  },
  "dependencies": {
    "sharp": "^0.29.3"
  }
}
EOF
fi

# Install Sharp if not already installed
echo "Installing Sharp image processing library..."
if [ -d "node_modules/sharp" ]; then
    echo "Sharp is already installed."
else
    # For older Node.js versions, use a compatible version of Sharp
    if [ "$NODE_MAJOR" -lt "14" ]; then
        echo "Using Sharp 0.29.3 for compatibility with Node.js v$NODE_VERSION"
        npm install sharp@0.29.3 --no-fund --no-audit --no-package-lock
    else
        npm install sharp --no-fund --no-audit --no-package-lock
    fi
fi

# Check if Sharp was installed successfully
if [ ! -d "node_modules/sharp" ]; then
    echo "Failed to install Sharp. Falling back to simple_image_processor.sh"
    bash ./scripts/simple_image_processor.sh
    exit 0
fi

# Create resources directory if it doesn't exist
mkdir -p resources/_gen/images

# Run the image processing script
echo "Running image processing script..."
node scripts/process_images.js

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo "Image processing completed successfully."
    echo "You can now build your Hugo site to use the processed images."
else
    echo "Image processing failed. Falling back to simple_image_processor.sh"
    bash ./scripts/simple_image_processor.sh
fi
