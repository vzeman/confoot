# ConFoot Deployment with Cloudflare Pages

This guide explains how to deploy the ConFoot website on Cloudflare Pages with multiple domains, each serving its specific language content directly.

## Overview

Cloudflare Pages is a JAMstack platform for frontend developers to collaborate and deploy websites. Combined with Cloudflare Pages Functions, it provides a powerful solution for multi-domain, multi-language websites.

This setup will:

1. Deploy your Hugo site to Cloudflare Pages
2. Use Cloudflare Pages Functions to route requests based on the domain
3. Serve each language on its own domain without redirects
4. Automatically build and deploy when you push changes

## Setup Instructions

### 1. Initial Setup

First, make sure your repository is ready for Cloudflare Pages:

```bash
# Clean up any old configurations
rm -rf .cloudflare wrangler.toml node_modules package-lock.json

# Create the functions directory if it doesn't exist
mkdir -p functions
```

### 2. Create the Middleware Function

Create a file at `functions/_middleware.js` with the following content:

```javascript
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
      // Add all your domains here
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
```

### 3. Create a Simple package.json

Create a minimal `package.json` file:

```json
{
  "name": "confoot",
  "version": "1.0.0",
  "description": "ConFoot website",
  "private": true,
  "scripts": {
    "build": "hugo --minify",
    "dev": "hugo server"
  }
}
```

### 4. GitHub Repository Configuration

Commit and push the changes to your GitHub repository:

```bash
git add .
git commit -m "Set up Cloudflare Pages deployment"
git push origin main
```

### 5. Cloudflare Pages Configuration

1. Sign up for Cloudflare Pages at https://pages.cloudflare.com/
2. Connect your GitHub repository to Cloudflare Pages
3. Configure the build settings:
   - Build command: `hugo --minify`
   - Build output directory: `public`
   - Environment variables:
     - `HUGO_VERSION`: `0.123.6`
4. Click "Save and Deploy"

### 6. Custom Domains Setup

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" > "Custom domains"
3. Add all your domains:
   - www.confoot.eu
   - www.confoot.cz
   - etc.

### 7. DNS Configuration

1. Add all your domains to Cloudflare DNS:
   - Transfer your domains to Cloudflare (recommended)
   - Or use Cloudflare as your DNS provider while keeping your domain registrar
2. For each domain, create an A record:
   - Type: `A`
   - Name: `www` (or `@` for root domain)
   - Value: Cloudflare Pages IP (provided in your Pages dashboard)
   - Proxy status: Proxied (orange cloud)

Example DNS records:
```
www.confoot.eu    A    <Cloudflare Pages IP>    Proxied
www.confoot.cz    A    <Cloudflare Pages IP>    Proxied
```

## How It Works

This setup uses Cloudflare Pages Functions to handle multi-domain routing:

1. **Cloudflare Pages** hosts your Hugo site
2. **Pages Functions** intercept requests to all your domains
3. The middleware function determines the language based on the domain
4. It rewrites the request to include the appropriate language path
5. Content is served directly from the domain, without visible redirects

## Troubleshooting

### Build Failures

If you encounter build failures:

1. Make sure your build command is correct (`hugo --minify`)
2. Ensure the Hugo version is set correctly (`0.123.6`)
3. Check that your repository doesn't contain any Wrangler or Workers configuration
4. Verify that the `functions` directory is at the root of your repository

### Domain Not Working

1. Verify DNS configuration in Cloudflare
2. Check that the domain is added as a custom domain in Cloudflare Pages
3. Check the Functions logs for errors (in Cloudflare dashboard)

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
- [Hugo Multilingual Documentation](https://gohugo.io/content-management/multilingual/)
