// This file is used as the entry point for Wrangler
// It's a simple placeholder that doesn't do anything

export default {
  async fetch(request, env, ctx) {
    return new Response("ConFoot website is served by Cloudflare Pages Functions", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
