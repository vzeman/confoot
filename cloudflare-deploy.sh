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
mkdir -p .cloudflare

# Create _headers file for security headers
log "Creating _headers file"
cat > static/_headers << 'EOF'
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
EOF

# Create _redirects file for domain-specific routing
log "Creating _redirects file"
cat > static/_redirects << 'EOF'
# Language-specific domain redirects for Cloudflare Pages
# These rules ensure each domain serves the correct language content

# Default domain (English)
https://confoot.pages.dev/* https://www.confoot.eu/:splat 301!

# No redirects needed for language-specific domains as they'll be handled by the Worker
EOF

# Create Cloudflare Worker script
log "Creating Cloudflare Worker script"
mkdir -p .cloudflare/workers
cat > .cloudflare/workers/domain-router.js << 'EOF'
// ConFoot Domain Router Worker
// This worker routes requests based on the domain to the correct language content

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const domain = url.hostname
  
  // Map domains to language paths
  const domainLanguageMap = {
    'www.confoot.eu': 'en',
    'confoot.eu': 'en',
    'www.confoot.cz': 'cs',
    'confoot.cz': 'cs',
    'www.confoot.sk': 'sk',
    'confoot.sk': 'sk',
    'www.confoot.de': 'de',
    'confoot.de': 'de',
    'www.confoot.gr': 'gr',
    'confoot.gr': 'gr',
    'www.confoot.hr': 'hr',
    'confoot.hr': 'hr',
    'www.confoot.lt': 'lt',
    'confoot.lt': 'lt',
    'www.confoot.ru': 'ru',
    'confoot.ru': 'ru',
    'www.confoot.lv': 'lv',
    'confoot.lv': 'lv',
    'www.confoot.si': 'si',
    'confoot.si': 'si',
    'www.confoot.ro': 'ro',
    'confoot.ro': 'ro',
    'www.confoot.li': 'de',
    'confoot.li': 'de',
    'www.confoot.at': 'de',
    'confoot.at': 'de',
    'www.confoot.ch': 'de',
    'confoot.ch': 'de',
    'www.confoot.pt': 'pt',
    'confoot.pt': 'pt',
    'www.confoot.co.uk': 'en',
    'confoot.co.uk': 'en'
  }
  
  // Get language code for the domain
  const languageCode = domainLanguageMap[domain] || 'en'
  
  // Clone the request
  let newRequest = new Request(request)
  let newUrl = new URL(request.url)
  
  // Cloudflare Pages URL (replace with your actual Pages URL)
  const pagesUrl = 'https://confoot.pages.dev'
  
  // Construct the new URL with language path
  // For the default language (en), don't add a language prefix
  if (languageCode === 'en') {
    newUrl = new URL(`${pagesUrl}${url.pathname}${url.search}`)
  } else {
    // For other languages, add the language prefix
    newUrl = new URL(`${pagesUrl}/${languageCode}${url.pathname}${url.search}`)
  }
  
  // Create a new request with the modified URL
  newRequest = new Request(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })
  
  // Add a header to indicate the original domain
  newRequest.headers.set('X-Original-Domain', domain)
  newRequest.headers.set('X-Language', languageCode)
  
  // Fetch from Cloudflare Pages
  return fetch(newRequest)
}
EOF

# Create Cloudflare Pages configuration file
log "Creating Cloudflare Pages configuration file"
cat > .cloudflare/pages.toml << 'EOF'
# Cloudflare Pages configuration for ConFoot

[build]
command = "hugo --minify"
publish = "public"

[build.environment]
HUGO_VERSION = "0.123.6"

[site]
bucket = "./public"
entry-point = ".cloudflare/workers/domain-router"
EOF

# Create a wrangler.toml file for Cloudflare Workers
log "Creating wrangler.toml file"
cat > wrangler.toml << 'EOF'
name = "confoot-domain-router"
type = "javascript"
account_id = "" # Add your Cloudflare account ID
workers_dev = true
route = "*confoot.*/*"
zone_id = "" # Add your Cloudflare zone ID

[site]
bucket = "./public"
entry-point = ".cloudflare/workers/domain-router"

[build]
command = "hugo --minify"
upload.format = "service-worker"
EOF

# Create a custom build script for Cloudflare Pages
log "Creating build script for Cloudflare Pages"
cat > build.sh << 'EOF'
#!/bin/bash
# Build script for Cloudflare Pages

# Install any dependencies
npm ci

# Build Hugo site
hugo --minify

# Copy _headers and _redirects to public directory if they're not in static
if [ -f "_headers" ] && [ ! -f "public/_headers" ]; then
  cp _headers public/
fi

if [ -f "_redirects" ] && [ ! -f "public/_redirects" ]; then
  cp _redirects public/
fi

# Success message
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
log "5. Set up Cloudflare Workers:"
log "   - Go to Workers & Pages in the Cloudflare dashboard"
log "   - Create a new Worker using the domain-router.js script"
log "   - Add routes for all your domains to the Worker"
log "6. Add all your domains to Cloudflare DNS and point them to your Pages site"
log ""
log "For detailed instructions, refer to the README-cloudflare.md file"
