#!/bin/bash
# ConFoot Cloudflare Pages Setup Script
# This script prepares your Hugo site for deployment to Cloudflare Pages

# Exit on error
set -e

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Cloudflare Pages setup"

# Remove any old Workers configuration
log "Removing old Workers configuration"
rm -rf .cloudflare wrangler.toml node_modules package-lock.json

# Create functions directory if it doesn't exist
log "Setting up Pages Functions directory"
mkdir -p functions

# Check if _middleware.js already exists
if [ ! -f "functions/_middleware.js" ]; then
  log "Creating _middleware.js file"
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
      'confoot.de': 'de',
      'www.confoot.de': 'de',
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

# Create a simplified package.json
log "Creating simplified package.json"
cat > package.json << 'EOF'
{
  "name": "confoot",
  "version": "1.0.0",
  "description": "ConFoot website",
  "private": true,
  "scripts": {
    "build": "hugo --minify",
    "dev": "hugo server"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vzeman/confoot.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/vzeman/confoot/issues"
  },
  "homepage": "https://github.com/vzeman/confoot#readme"
}
EOF

# Create Cloudflare Pages configuration
log "Creating Cloudflare Pages configuration"
cat > pages.toml << 'EOF'
# Cloudflare Pages configuration for ConFoot

[build]
command = "hugo --minify"
publish = "public"

[build.environment]
HUGO_VERSION = "0.123.6"
EOF

# Create _headers file template
log "Creating _headers file template"
mkdir -p public
cat > public/_headers << 'EOF'
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOF

log "Cloudflare Pages setup completed"
log ""
log "Next steps:"
log "1. Commit and push these changes to your GitHub repository:"
log "   git add ."
log "   git commit -m \"Set up Cloudflare Pages deployment\""
log "   git push origin main"
log ""
log "2. In the Cloudflare Pages dashboard:"
log "   - Build command: hugo --minify"
log "   - Build output directory: public"
log "   - Environment variable: HUGO_VERSION = 0.123.6"
log ""
log "3. For detailed instructions, refer to the README-cloudflare.md file"
