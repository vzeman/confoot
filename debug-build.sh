#!/bin/bash
# Debug build script for Cloudflare Pages

# Create backup of functions directory
echo "Creating backup of functions directory..."
cp -r functions functions_backup

# Create a simplified functions directory
echo "Creating simplified functions directory..."
mkdir -p functions_simple
cat > functions_simple/test.js << 'EOF'
// Simple test function
export async function onRequest(context) {
  return new Response("Functions are working!", {
    headers: { "Content-Type": "text/plain" }
  });
}
EOF

# Create a simplified _middleware.js
cat > functions_simple/_middleware.js << 'EOF'
// Simplified middleware
export async function onRequest(context) {
  try {
    // Just pass through the request without modification
    return context.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return context.next();
  }
}
EOF

# Create minimal redirects
echo "Creating minimal redirects..."
cp public/_redirects public/_redirects.backup
cat > public/_redirects.minimal << 'EOF'
# Minimal redirects for testing
https://confoot.pages.dev/* https://www.confoot.eu/:splat 301!
EOF

# Create test HTML file
echo "Creating test HTML file..."
cat > public/debug.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Debug Page</title>
</head>
<body>
  <h1>Debug Page</h1>
  <p>If you can see this page, the basic deployment is working.</p>
  <p>Current time: <span id="time"></span></p>
  <script>
    document.getElementById('time').textContent = new Date().toString();
  </script>
</body>
</html>
EOF

echo "Debug files created. To use them:"
echo "1. mv functions functions_original"
echo "2. cp -r functions_simple functions"
echo "3. cp public/_redirects.minimal public/_redirects"
echo "4. Deploy to Cloudflare Pages"
echo "5. Test https://confoot.pages.dev/debug.html and https://confoot.pages.dev/test"
