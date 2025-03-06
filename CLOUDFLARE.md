# ConFoot - Cloudflare Pages Migration Guide

This document outlines the migration of the ConFoot website from Netlify to Cloudflare Pages, focusing on maintaining multi-domain support for different languages.

## Configuration Files

The following files have been created for Cloudflare Pages:

1. `functions/_middleware.js` - Handles domain-based language routing
2. `public/_redirects` - Defines redirect rules for apex domains and fallback routing
3. `public/_headers` - Defines security headers for all pages
4. `cloudflare-pages.json` - Reference for build settings (not used by Cloudflare directly)

## How It Works

### Domain-Based Language Routing

The ConFoot website serves different language content based on the domain:

- www.confoot.eu → English content (/en/)
- www.confoot.cz → Czech content (/cs/)
- www.confoot.sk → Slovak content (/sk/)
- etc.

This is implemented using Cloudflare Pages Functions with a middleware that intercepts requests and routes them to the appropriate language folder based on the hostname.

### Redirect Rules

The `_redirects` file handles:
1. Redirecting apex domains to www versions (e.g., confoot.cz → www.confoot.cz)
2. Redirecting the Cloudflare Pages subdomain to the primary domain
3. Fallback rules for language-based routing if Functions are disabled

## Deployment Steps

### 1. Connect Your Repository

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** > **Create a project** > **Connect to Git**
3. Select your repository provider and authorize Cloudflare
4. Select the `confoot` repository

### 2. Configure Build Settings

In the build settings form:

```
Project name: confoot
Production branch: main
Build command: hugo --gc --minify --cleanDestinationDir --enableGitInfo
Build output directory: public
```

Add these environment variables:
```
HUGO_VERSION: 0.125.4
HUGO_ENABLEGITINFO: true
```

### 3. Enable Cloudflare Pages Functions

1. In your project settings, go to the **Functions** tab
2. Ensure that Functions are enabled for your project
3. The `_middleware.js` file in the `functions` directory will be automatically detected

### 4. Set Up Custom Domains

1. After initial deployment, go to **Custom domains**
2. Add each of your language domains:
   - www.confoot.eu (primary)
   - www.confoot.cz
   - www.confoot.sk
   - www.confoot.de
   - www.confoot.gr
   - www.confoot.hr
   - www.confoot.lt
   - www.confoot.lv
   - www.confoot.ru
   - www.confoot.si
   - www.confoot.ro
   - www.confoot.li
   - www.confoot.at
   - www.confoot.ch
   - www.confoot.pt

3. Update DNS records for each domain to point to Cloudflare Pages

### 5. Verify Deployment

After deployment, test each domain to ensure it serves the correct language content:

```
https://www.confoot.eu/ → Should serve English content
https://www.confoot.cz/ → Should serve Czech content
https://www.confoot.sk/ → Should serve Slovak content
```

## Additional Configuration

### Apex Domains

For apex domains (e.g., confoot.eu without www), create additional redirects in Cloudflare using Page Rules or ensure your DNS is properly configured with CNAME flattening.

### Cache Configuration

Cloudflare offers powerful caching capabilities. Consider adding cache-control headers to optimize performance:

```
# In public/_headers
/*
  Cache-Control: public, max-age=3600
```

## Troubleshooting

### Functions Not Working

If the domain-based language routing is not working:

1. Check that Functions are enabled in your project settings
2. Verify that the `functions/_middleware.js` file is correctly deployed
3. Check the Functions logs in the Cloudflare Dashboard

### Redirect Issues

If redirects are not working as expected:

1. Check the `_redirects` file syntax
2. Ensure the file is in the `public` directory
3. Verify that the build process is correctly copying the file to the output directory
