// Simple test function to check if Functions are working
export async function onRequest(context) {
  return new Response("Functions are working!", {
    headers: { "Content-Type": "text/plain" }
  });
}
