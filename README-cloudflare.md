# ConFoot Deployment with Cloudflare Pages

This guide explains how to deploy the ConFoot website on Cloudflare Pages with multiple domains, each serving its specific language content directly.

## Overview

Cloudflare Pages is a JAMstack platform for frontend developers to collaborate and deploy websites. Combined with Cloudflare Workers, it provides a powerful solution for multi-domain, multi-language websites.

This setup will:

1. Deploy your Hugo site to Cloudflare Pages
2. Use Cloudflare Workers to route requests based on the domain
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
- Set up a Cloudflare Worker script for domain routing
- Create security headers and redirects files

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

### 4. Cloudflare Workers Setup

1. Go to the Cloudflare dashboard and navigate to "Workers & Pages"
2. Create a new Worker:
   - Click "Create a Service"
   - Name it "confoot-domain-router"
   - Use the code from `.cloudflare/workers/domain-router.js`
3. Configure routes:
   - Add routes for all your domains (e.g., `*confoot.eu/*`, `*confoot.cz/*`, etc.)
   - Set the Worker to handle these routes

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

### 6. Custom Domains in Cloudflare Pages

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" > "Custom domains"
3. Add all your domains:
   - www.confoot.eu
   - www.confoot.cz
   - www.confoot.de
   - etc.

## How It Works

This setup uses a combination of Cloudflare Pages and Workers:

1. **Cloudflare Pages** hosts your Hugo site
2. **Cloudflare Worker** intercepts requests to all your domains
3. The Worker determines the language based on the domain
4. It forwards the request to the appropriate language path on your Cloudflare Pages site
5. Content is served directly from the domain, without redirects

### Domain to Language Mapping

The Worker maps domains to languages as follows:

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
4. The Cloudflare Worker handles routing requests based on the domain

## Troubleshooting

### Domain Not Working

1. Verify DNS configuration in Cloudflare
2. Check that the domain is added as a custom domain in Cloudflare Pages
3. Ensure the Worker routes are configured correctly
4. Check the Worker logs for errors

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

You can add custom headers in the `static/_headers` file:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
```

### Custom Redirects

You can add custom redirects in the `static/_redirects` file:

```
# Redirect old pages
/old-page /new-page 301
```

### Worker Customization

You can customize the Worker script (`.cloudflare/workers/domain-router.js`) to add more complex routing logic, such as:

- A/B testing
- Geolocation-based routing
- Custom caching strategies
- Content transformation

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hugo Multilingual Documentation](https://gohugo.io/content-management/multilingual/)
