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

Run the Cloudflare deployment setup script to prepare your repository:

```bash
chmod +x cloudflare-deploy.sh
./cloudflare-deploy.sh
```

This script will:
- Create necessary configuration files for Cloudflare Pages
- Set up security headers and redirects files

### 2. GitHub Repository Configuration

1. Commit and push the changes to your GitHub repository:

```bash
git add .
git commit -m "Set up Cloudflare Pages deployment"
git push origin main
```

### 3. Cloudflare Pages Configuration

1. Sign up for Cloudflare Pages at https://pages.cloudflare.com/
2. Connect your GitHub repository to Cloudflare Pages
3. Configure the build settings:
   - Build command: `./build.sh`
   - Build output directory: `public`
   - Environment variables:
     - `HUGO_VERSION`: `0.123.6`
4. Click "Save and Deploy"

### 4. Custom Domains Setup

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" > "Custom domains"
3. Add all your domains:
   - www.confoot.eu
   - www.confoot.cz
   - www.confoot.de
   - etc.

### 5. DNS Configuration

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
www.confoot.de    A    <Cloudflare Pages IP>    Proxied
```

## How It Works

This setup uses Cloudflare Pages Functions to handle multi-domain routing:

1. **Cloudflare Pages** hosts your Hugo site
2. **Pages Functions** intercept requests to all your domains
3. The middleware function determines the language based on the domain
4. It rewrites the request to include the appropriate language path
5. Content is served directly from the domain, without visible redirects

### Domain to Language Mapping

The middleware maps domains to languages as follows:

- www.confoot.eu → English (en)
- www.confoot.cz → Czech (cs)
- www.confoot.sk → Slovak (sk)
- www.confoot.de → German (de)
- etc.

## Deployment Process

The deployment process works as follows:

1. When you push changes to the `main` branch, Cloudflare Pages is triggered
2. The build script builds your Hugo site with all languages
3. The site is deployed to Cloudflare Pages
4. The Pages Functions middleware handles routing requests based on the domain

## Troubleshooting

### Domain Not Working

1. Verify DNS configuration in Cloudflare
2. Check that the domain is added as a custom domain in Cloudflare Pages
3. Check the Functions logs for errors (in Cloudflare dashboard)
4. Ensure the domain is properly mapped in the middleware function

### Build Failures

Check the Cloudflare Pages build logs:
1. Go to your Cloudflare Pages project
2. Click on the failed deployment
3. Examine the build logs for errors

## Maintenance

To update your site:

1. Make changes to your content
2. Commit and push to the `main` branch
3. Cloudflare Pages will automatically build and deploy your site

## Advanced Configuration

### Custom Headers

The build script automatically creates a `_headers` file with security headers:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
```

You can modify these headers in the build.sh script.

### Custom Functions

You can add more Cloudflare Pages Functions in the `functions` directory to add additional functionality:

- API endpoints
- Authentication
- Custom redirects
- Server-side rendering

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
- [Hugo Multilingual Documentation](https://gohugo.io/content-management/multilingual/)
