// Absolute minimal test function
export async function onRequest() {
  return new Response("OK", {
    headers: { "Content-Type": "text/plain" }
  });
}
