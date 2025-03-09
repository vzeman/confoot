/**
 * Image Processing Script for ConFoot
 * 
 * This script:
 * 1. Finds all images in the assets directory
 * 2. Processes them to generate multiple sizes (100px, 400px, 1024px width)
 * 3. Creates WebP versions for each size
 * 4. Verifies that all required versions exist
 * 
 * Usage: node process_images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

// Configuration
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const RESOURCES_DIR = path.join(__dirname, '..', 'resources', '_gen', 'images');
const TARGET_SIZES = [100, 400, 1024];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const QUALITY = 85;

// Create directories if they don't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Find all images in the assets directory
function findImages(directory) {
  let images = [];
  
  const items = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    
    if (item.isDirectory()) {
      // Recursively search subdirectories
      images = images.concat(findImages(fullPath));
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }
  
  return images;
}

// Process an image to create multiple sizes and WebP versions
async function processImage(imagePath) {
  const relativePath = path.relative(ASSETS_DIR, imagePath);
  const outputDir = path.join(RESOURCES_DIR, path.dirname(relativePath));
  const filename = path.basename(imagePath, path.extname(imagePath));
  const ext = path.extname(imagePath).toLowerCase();
  
  ensureDirectoryExists(outputDir);
  
  console.log(`Processing: ${relativePath}`);
  
  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    const originalWidth = metadata.width;
    
    console.log(`  Original size: ${originalWidth}px width`);
    
    // Process each target size
    for (const targetWidth of TARGET_SIZES) {
      // Skip if target size is larger than original
      if (targetWidth > originalWidth) {
        console.log(`  Skipping ${targetWidth}px (original is smaller: ${originalWidth}px)`);
        continue;
      }
      
      // Skip 100px version for very small images where it wouldn't make sense
      if (targetWidth === 100 && originalWidth < 150) {
        console.log(`  Skipping ${targetWidth}px (original is too small: ${originalWidth}px)`);
        continue;
      }
      
      const outputFilename = `${filename}_${targetWidth}${ext}`;
      const outputWebpFilename = `${filename}_${targetWidth}.webp`;
      const outputPath = path.join(outputDir, outputFilename);
      const outputWebpPath = path.join(outputDir, outputWebpFilename);
      
      // Generate resized original format
      await sharp(imagePath)
        .resize(targetWidth)
        .toFormat(ext.replace('.', ''))
        .toFile(outputPath);
      
      // Generate WebP version
      await sharp(imagePath)
        .resize(targetWidth)
        .toFormat('webp', { quality: QUALITY })
        .toFile(outputWebpPath);
      
      console.log(`  Created ${targetWidth}px: ${outputFilename} and ${outputWebpFilename}`);
    }
    
    return {
      path: relativePath,
      originalWidth,
      success: true
    };
  } catch (error) {
    console.error(`  Error processing ${relativePath}: ${error.message}`);
    return {
      path: relativePath,
      error: error.message,
      success: false
    };
  }
}

// Verify that all required versions exist for an image
function verifyImageVersions(imagePath, originalWidth) {
  const relativePath = path.relative(ASSETS_DIR, imagePath);
  const outputDir = path.join(RESOURCES_DIR, path.dirname(relativePath));
  const filename = path.basename(imagePath, path.extname(imagePath));
  const ext = path.extname(imagePath).toLowerCase();
  
  let missingFiles = [];
  
  // Check each target size
  for (const targetWidth of TARGET_SIZES) {
    // Skip if target size is larger than original
    if (targetWidth > originalWidth) {
      continue;
    }
    
    const outputFilename = `${filename}_${targetWidth}${ext}`;
    const outputWebpFilename = `${filename}_${targetWidth}.webp`;
    const outputPath = path.join(outputDir, outputFilename);
    const outputWebpPath = path.join(outputDir, outputWebpFilename);
    
    if (!fs.existsSync(outputPath)) {
      missingFiles.push(outputFilename);
    }
    
    if (!fs.existsSync(outputWebpPath)) {
      missingFiles.push(outputWebpFilename);
    }
  }
  
  return missingFiles;
}

// Main function
async function main() {
  console.log('ConFoot Image Processing Script');
  console.log('===============================');
  
  // Check if Sharp is installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('Sharp is not installed. Installing now...');
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('Sharp installed successfully.');
  }
  
  // Find all images
  console.log('\nFinding images in assets directory...');
  const images = findImages(ASSETS_DIR);
  console.log(`Found ${images.length} images.\n`);
  
  // Process all images
  console.log('Processing images...');
  const results = [];
  
  for (const imagePath of images) {
    const result = await processImage(imagePath);
    results.push(result);
  }
  
  // Verify all versions
  console.log('\nVerifying image versions...');
  let allVersionsExist = true;
  
  for (const result of results) {
    if (!result.success) continue;
    
    const imagePath = path.join(ASSETS_DIR, result.path);
    const missingFiles = verifyImageVersions(imagePath, result.originalWidth);
    
    if (missingFiles.length > 0) {
      console.log(`Missing files for ${result.path}:`);
      missingFiles.forEach(file => console.log(`  - ${file}`));
      allVersionsExist = false;
    }
  }
  
  // Summary
  console.log('\nProcessing Summary');
  console.log('=================');
  console.log(`Total images: ${images.length}`);
  console.log(`Successfully processed: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  
  if (allVersionsExist) {
    console.log('\nAll required image versions exist!');
  } else {
    console.log('\nSome image versions are missing. Please check the logs above.');
  }
}

// Run the script
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
