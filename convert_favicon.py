import os
import base64
import sys

# This is a simple script to create a basic ICO file from a PNG
# It's not a perfect solution but should work for basic favicon needs

# Path to the PNG file
png_path = "/Users/viktorzeman/work/confoot/static/images/favicon-32x32.png"
# Path for the output ICO file
ico_path = "/Users/viktorzeman/work/confoot/static/favicon.ico"

# Read the PNG file
with open(png_path, "rb") as f:
    png_data = f.read()

# Create a simple ICO file structure
# ICO header (6 bytes) + ICO directory entry (16 bytes) + PNG data
ico_header = bytes([0, 0, 1, 0, 1, 0])  # ICO file identifier and number of images
size = len(png_data)
ico_dir = bytes([
    32, 32,  # Width and height (32x32)
    0,       # Color palette
    0,       # Reserved
    1, 0,    # Color planes
    32, 0,   # Bits per pixel
    size & 0xFF, (size >> 8) & 0xFF, (size >> 16) & 0xFF, (size >> 24) & 0xFF,  # Size of image data
    22, 0, 0, 0  # Offset to image data (6 + 16 = 22)
])

# Write the ICO file
with open(ico_path, "wb") as f:
    f.write(ico_header + ico_dir + png_data)

print(f"Converted {png_path} to {ico_path}")
