#!/bin/bash
set -e

# Build the Hugo site
echo "Building Hugo site..."
hugo --gc --minify --cleanDestinationDir --enableGitInfo

# Build the Docker image
echo "Building Docker image..."
docker build -t confoot-web .

echo "Build completed successfully!"
echo "Run 'docker-compose up -d' to start the server"
