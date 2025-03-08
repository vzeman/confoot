// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  try {
    // Log the start of function execution
    console.log('Middleware started, URL:', context.request.url);
    
    // Get the hostname from the request
    const url = new URL(context.request.url);
    const hostname = url.hostname.toLowerCase();
    const path = url.pathname;
    console.log('Hostname:', hostname);
    console.log('Original path:', path);
    
    // Default to English
    let lang = 'en';
    
    // Map domains to language codes
    const domainLanguageMap = {
      'confoot.eu': 'en',
      'www.confoot.eu': 'en',
      'confoot.cz': 'cs',
      'www.confoot.cz': 'cs',
      'confoot.sk': 'sk',
      'www.confoot.sk': 'sk',
      'confoot.de': 'de',
      'www.confoot.de': 'de',
      'confoot.gr': 'gr',
      'www.confoot.gr': 'gr',
      'confoot.hr': 'hr',
      'www.confoot.hr': 'hr',
      'confoot.lt': 'lt',
      'www.confoot.lt': 'lt',
      'confoot.ru': 'ru',
      'www.confoot.ru': 'ru',
      'confoot.lv': 'lv',
      'www.confoot.lv': 'lv',
      'confoot.si': 'si',
      'www.confoot.si': 'si',
      'confoot.ro': 'ro',
      'www.confoot.ro': 'ro',
      'confoot.li': 'de',
      'www.confoot.li': 'de',
      'confoot.at': 'de',
      'www.confoot.at': 'de',
      'confoot.ch': 'de',
      'www.confoot.ch': 'de',
      'confoot.pt': 'pt',
      'www.confoot.pt': 'pt',
      'confoot.co.uk': 'en',
      'www.confoot.co.uk': 'en'
    };
    
    // Check for exact domain match first
    if (domainLanguageMap[hostname]) {
      lang = domainLanguageMap[hostname];
    } else {
      // Fallback to partial matching
      for (const domain in domainLanguageMap) {
        if (hostname.includes(domain.replace('www.', ''))) {
          lang = domainLanguageMap[domain];
          break;
        }
      }
    }
    
    console.log('Selected language:', lang);
    
    // Check if the path already starts with a language code
    // This handles cases where URLs might still have language prefixes
    const langPattern = /^\/(en|cs|sk|de|gr|hr|lt|ru|lv|si|ro|pt)\//;
    const langMatch = path.match(langPattern);
    
    if (langMatch) {
      // If the URL already has a language prefix that matches the domain language,
      // redirect to remove the language prefix
      if (langMatch[1] === lang) {
        const newPath = path.replace(langPattern, '/');
        const redirectUrl = `${url.protocol}//${hostname}${newPath}${url.search}`;
        console.log('Removing language prefix, redirecting to:', redirectUrl);
        
        return new Response(null, {
          status: 301, // Permanent redirect
          headers: {
            'Location': redirectUrl,
            'Cache-Control': 'max-age=3600'
          }
        });
      }
      // If the URL has a language prefix that doesn't match the domain language,
      // let it pass through as is (this is an edge case)
      return context.next();
    }
    
    // Internally rewrite the URL to include the language prefix for Hugo
    // This doesn't change the URL visible to the user
    const internalPath = `/${lang}${path === '/' ? '/' : path}`;
    console.log('Internal rewrite to:', internalPath);
    
    // Create a new URL for internal routing
    const newUrl = new URL(url);
    newUrl.pathname = internalPath;
    
    // Create a new request with the modified URL for internal routing only
    const newRequest = new Request(newUrl.toString(), {
      method: context.request.method,
      headers: context.request.headers
    });
    
    // Pass the modified request to the next handler
    return context.next({
      request: newRequest
    });
  } catch (error) {
    // Detailed error logging
    console.error('Error in middleware:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // If anything fails, just continue without modification
    return context.next();
  }
}
