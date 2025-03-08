// This is a dummy entry point for Wrangler
// The actual functionality is handled by Cloudflare Pages Functions

export default {
  async fetch(request, env) {
    return new Response("This worker is not used. Routing is handled by Cloudflare Pages Functions.", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
