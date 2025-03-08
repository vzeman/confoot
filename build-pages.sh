#!/bin/bash
# Cloudflare Pages Build Script
# This script is specifically designed to handle the Cloudflare Pages build process

# Exit on error
set -e

echo "Starting Cloudflare Pages build process"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Build the Hugo site first
echo "Building Hugo site with Hugo version: $(hugo version)"
hugo --minify

# Create _headers file for security headers
echo "Creating security headers"
cat > public/_headers << 'EOH'
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOH

# Ensure the functions directory exists
echo "Setting up Cloudflare Pages Functions"
mkdir -p functions

# Create the middleware function if it doesn't exist
if [ ! -f "functions/_middleware.js" ]; then
  echo "Creating _middleware.js for domain routing"
  cat > functions/_middleware.js << 'EOF'
// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  try {
    // Log the start of function execution
    console.log('Middleware started, URL:', context.request.url);
    
    // Get the hostname from the request
    const url = new URL(context.request.url);
    const hostname = url.hostname.toLowerCase();
    console.log('Hostname:', hostname);
    
    // Default to English
    let lang = 'en';
    
    // Map domains to language codes
    const domainLanguageMap = {
      'confoot.eu': 'en',
      'www.confoot.eu': 'en',
      'confoot.cz': 'cs',
      'www.confoot.cz': 'cs',
      'confoot.sk': 'sk',
      'www.confoot.sk': 'sk',
      'confoot.gr': 'gr',
      'www.confoot.gr': 'gr',
      'confoot.hr': 'hr',
      'www.confoot.hr': 'hr',
      'confoot.lt': 'lt',
      'www.confoot.lt': 'lt',
      'confoot.ru': 'ru',
      'www.confoot.ru': 'ru',
      'confoot.lv': 'lv',
      'www.confoot.lv': 'lv',
      'confoot.si': 'si',
      'www.confoot.si': 'si',
      'confoot.ro': 'ro',
      'www.confoot.ro': 'ro',
      'confoot.li': 'de',
      'www.confoot.li': 'de',
      'confoot.at': 'de',
      'www.confoot.at': 'de',
      'confoot.ch': 'de',
      'www.confoot.ch': 'de',
      'confoot.pt': 'pt',
      'www.confoot.pt': 'pt',
      'confoot.co.uk': 'en',
      'www.confoot.co.uk': 'en'
    };
    
    // Check for exact domain match first
    if (domainLanguageMap[hostname]) {
      lang = domainLanguageMap[hostname];
    } else {
      // Fallback to partial matching
      for (const domain in domainLanguageMap) {
        if (hostname.includes(domain.replace('www.', ''))) {
          lang = domainLanguageMap[domain];
          break;
        }
      }
    }
    
    console.log('Selected language:', lang);
    
    // Skip rewriting if already on a language path
    const path = url.pathname;
    console.log('Original path:', path);
    
    if (path.startsWith(`/${lang}/`)) {
      console.log('Path already has language prefix, no rewrite needed');
      return context.next();
    }
    
    // Add language prefix to path
    const newUrl = new URL(url);
    
    // Handle root path special case
    if (path === '/' || path === '') {
      newUrl.pathname = `/${lang}/`;
    } else {
      // Ensure we don't add double slashes
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      newUrl.pathname = `/${lang}${cleanPath}`;
    }
    
    console.log('Rewritten URL:', newUrl.toString());
    
    // Return modified request
    return context.next({
      request: {
        ...context.request,
        url: newUrl.toString()
      }
    });
  } catch (error) {
    // Detailed error logging
    console.error('Error in middleware:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // If anything fails, just continue without modification
    return context.next();
  }
}
EOF
fi

echo "Build completed successfully"
echo "Contents of public directory:"
ls -la public/
