// Debug function to capture and display errors
export async function onRequest(context) {
  try {
    // Get request information
    const url = new URL(context.request.url);
    const hostname = url.hostname;
    const path = url.pathname;
    
    // Create a response with debug information
    const debugInfo = {
      timestamp: new Date().toISOString(),
      url: context.request.url,
      hostname: hostname,
      path: path,
      headers: Object.fromEntries(context.request.headers.entries()),
      method: context.request.method,
      environment: {
        // Add any environment variables you want to check
        NODE_ENV: process.env.NODE_ENV || 'unknown'
      }
    };
    
    // Return the debug information as JSON
    return new Response(JSON.stringify(debugInfo, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    // Return the error details
    const errorDetails = {
      error: true,
      name: error.name,
      message: error.message,
      stack: error.stack,
      toString: error.toString()
    };
    
    return new Response(JSON.stringify(errorDetails, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
}
