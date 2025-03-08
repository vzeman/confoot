# Cloudflare Pages Configuration Guide

## Step 1: Create a New Cloudflare Pages Project

1. Go to the Cloudflare dashboard: https://dash.cloudflare.com/
2. Click on "Pages" in the left sidebar
3. Click "Create a project" 
4. Select "Connect to Git"
5. Connect to your GitHub account if not already connected
6. Select the "confoot" repository
7. Click "Begin setup"

## Step 2: Configure Build Settings

Configure your project with these exact settings:

- **Project name**: confoot (or your preferred name)
- **Production branch**: main
- **Framework preset**: None (or select Hugo if available)
- **Build command**: `hugo --minify`
- **Build output directory**: `public`
- **Root directory**: (leave blank)
- **Environment variables**:
  - Add variable: `HUGO_VERSION` = `0.123.6`

## Step 3: Save and Deploy

1. Click "Save and Deploy"
2. Wait for the initial build to complete
3. If the build fails, go to "Settings" > "Build & deployments" and update the settings as described above

## Step 4: Add Custom Domains

After successful deployment:

1. Go to the "Custom domains" tab
2. Click "Set up a custom domain"
3. Add each of your domains one by one (www.confoot.eu, www.confoot.cz, etc.)
4. Follow the DNS verification process for each domain

## Important Notes

- Do NOT use Wrangler for deployment
- The `functions` directory will be automatically detected by Cloudflare Pages
- The `_middleware.js` file in the functions directory handles language routing
