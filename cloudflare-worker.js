// Cloudflare Worker entry point for Wrangler
// This file exists solely to satisfy the Wrangler deploy command
// The actual functionality is handled by Cloudflare Pages Functions

export default {
  async fetch(request, env, ctx) {
    // This worker does nothing - it's just a placeholder
    // The real routing is handled by Cloudflare Pages Functions
    return new Response("This worker is not used. Routing is handled by Cloudflare Pages Functions.", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
