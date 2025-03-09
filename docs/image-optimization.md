# ConFoot Image Optimization System

This document explains how the image optimization system works in the ConFoot project.

## Overview

The ConFoot image optimization system automatically processes all images in the project to:

1. Generate multiple sizes (100px, 400px, and 1024px width)
2. Create WebP versions for modern browsers
3. Ensure all images have responsive versions available

The system respects original image dimensions and will not upscale smaller images. It only generates larger sizes when the original image is big enough.

## Components

### 1. Image Processing Script

The main script that processes all images is `scripts/simple_image_processor.sh`. This script:

- Scans for images in `assets/`, `static/images/`, and `content/` directories
- Copies images to the assets directory for Hugo to process
- Creates a temporary page that triggers Hugo's image processing
- Copies all processed images to a static directory for deployment

### 2. Responsive Image Partials

Two Hugo partials handle responsive images:

- `layouts/partials/picture.html`: For standard responsive images
- `layouts/partials/lazyimg.html`: For lazy-loaded responsive images

These partials automatically generate:
- Multiple image sizes (100px, 400px, 1024px)
- WebP versions with appropriate quality settings
- Proper `srcset` and `sizes` attributes for responsive behavior

### 3. Template Updater

The `scripts/update_image_templates.sh` script helps update existing templates to use the responsive image partials.

### 4. Build Integration

The image processing is integrated into the build process through:

- NPM scripts in `package.json`
- Hugo pre-build hooks in `hugo.yaml`
- A dedicated build script for Cloudflare Pages (`build-cloudflare.sh`)

## Usage

### Using Responsive Images in Templates

To use responsive images in your templates, use the partials:

```html
<!-- Standard responsive image -->
{{ partial "picture.html" (dict "src" "path/to/image.jpg" "alt" "Description" "class" "additional-classes") }}

<!-- Lazy-loaded responsive image -->
{{ partial "lazyimg.html" (dict "src" "path/to/image.jpg" "alt" "Description" "class" "additional-classes") }}
```

### Parameters for Image Partials

Both partials accept the following parameters:

- `src`: Image source path (required)
- `alt`: Alt text for accessibility (required)
- `class`: Additional CSS classes (optional)
- `width`: Image width (optional)
- `height`: Image height (optional)
- `loading`: Loading attribute (optional, default: "lazy" for picture.html)
- `decoding`: Decoding attribute (optional, default: "async")
- `sizes`: Sizes attribute (optional, default: "(min-width: 1024px) 1024px, (min-width: 400px) 400px, 100px")

### Building the Site

To build the site with image optimization:

```bash
# Using npm
npm run build

# Using Hugo directly
hugo --minify  # The pre-build hook will run image processing

# For Cloudflare Pages deployment
./build-cloudflare.sh
```

## How It Works

1. When the build process starts, the image processing script runs first
2. It finds all images in the project and copies them to the assets directory
3. It creates a temporary page that includes all images
4. Hugo processes these images and generates all required sizes and formats
5. The processed images are copied to the static directory
6. Hugo builds the site, using the responsive image partials to include the processed images

## Troubleshooting

If images are not being processed correctly:

1. Check that the image paths in your templates are correct
2. Ensure the image processing script has run successfully
3. Look for errors in the Hugo build output
4. Verify that the processed images exist in the resources directory

## Maintenance

To update the image optimization system:

1. Edit the image processing script if you need to change the sizes or formats
2. Modify the responsive image partials if you need to change how images are displayed
3. Run the image processing script manually if you add new images without rebuilding the site

## Credits

This image optimization system uses Hugo's built-in image processing capabilities to generate responsive images and WebP alternatives.
