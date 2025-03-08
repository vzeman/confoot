#!/bin/bash
# ConFoot Cloudflare Pages Deployment Script
# This script prepares your Hugo site for deployment to Cloudflare Pages

# Exit on error
set -e

# Variables
CLOUDFLARE_PROJECT="confoot"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Cloudflare Pages deployment setup"

# Create necessary directories
mkdir -p functions

# Ensure the functions directory exists
if [ ! -d "functions" ]; then
  log "Creating functions directory"
  mkdir -p functions
fi

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

# Create build.sh script
log "Creating build script for Cloudflare Pages"
cat > build.sh << 'EOF'
#!/bin/bash
# Build script for Cloudflare Pages

# Exit on error
set -e

# Build Hugo site
echo "Building Hugo site..."
hugo --minify

# Create necessary directories and files for Cloudflare Pages
echo "Setting up Cloudflare Pages configuration..."

# Create _headers file for security headers if it doesn't exist
if [ ! -f "public/_headers" ]; then
  cat > public/_headers << 'EOH'
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOH
  echo "Created _headers file"
fi

# Create _redirects file for domain-specific routing if it doesn't exist
if [ ! -f "public/_redirects" ]; then
  cat > public/_redirects << 'EOR'
# Language-specific domain redirects
# These rules ensure each domain serves the correct language content
# No redirects needed as this will be handled by Cloudflare Pages Functions
EOR
  echo "Created _redirects file"
fi

echo "Build completed successfully!"
EOF
chmod +x build.sh

log "Cloudflare Pages deployment setup completed"
log ""
log "Next steps:"
log "1. Sign up for Cloudflare Pages at https://pages.cloudflare.com/"
log "2. Connect your GitHub repository to Cloudflare Pages"
log "3. Configure the build settings:"
log "   - Build command: ./build.sh"
log "   - Build output directory: public"
log "   - Set environment variable HUGO_VERSION to 0.123.6"
log "4. Deploy your site"
log "5. Add all your domains as custom domains in your Cloudflare Pages project"
log "6. Set up DNS records for each domain pointing to Cloudflare Pages"
log ""
log "For detailed instructions, refer to the README-cloudflare.md file"
