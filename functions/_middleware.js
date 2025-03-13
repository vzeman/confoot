// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  try {
    // Log the start of function execution
    // Extract hostname from request headers
    const host = context.request.headers.get('host') || '';
    const hostname = host.toLowerCase();
    
    // Get the path from the URL
    const urlString = context.request.url;
    const url = new URL(urlString);
    const path = url.pathname;
    const queryString = url.search; // Preserve query parameters
    
    // Default to English
    let lang = 'en';
    
    // Map domains to language codes
    const domainLanguageMap = {
      'confoot.eu': 'en',
      'www.confoot.eu': 'en',
      'confoot.us': 'us',
      'www.confoot.us': 'us',
      'confoot.cz': 'cs',
      'www.confoot.cz': 'cs',
      'confoot.sk': 'sk',
      'www.confoot.sk': 'sk',
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
      'confoot.si': 'sl',
      'www.confoot.si': 'sl',
      'confoot.ro': 'ro',
      'www.confoot.ro': 'ro',
      'confoot.li': 'li',
      'www.confoot.li': 'li',
      'confoot.at': 'at',
      'www.confoot.at': 'at',
      'confoot.ch': 'ch',
      'www.confoot.ch': 'ch',
      'confoot.pt': 'pt',
      'www.confoot.pt': 'pt',
      'confoot.es': 'es',
      'www.confoot.es': 'es',
      'confoot.it': 'it',
      'www.confoot.it': 'it',
      'confoot.hu': 'hu',
      'www.confoot.hu': 'hu',
      'confoot.fr': 'fr',
      'www.confoot.fr': 'fr',
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
    
    // Check if the path already has a language prefix
    const allLangsPattern = new RegExp(`^\\/(${Object.values(domainLanguageMap).join('|')})(?:\\/|$)`);
    
    if (allLangsPattern.test(path)) {
      // Extract the language from the path
      const pathLangMatch = path.match(allLangsPattern);
      const pathLang = pathLangMatch ? pathLangMatch[1] : null;
      
      // If the URL has a language prefix that doesn't match the domain language,
      // redirect to the clean URL without any language prefix
      if (pathLang && pathLang !== lang) {
        const pathWithoutLang = path.replace(allLangsPattern, '/');
        const cleanPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
        
        return new Response(null, {
          status: 301, // Permanent redirect
          headers: {
            'Location': cleanPath + queryString, // Preserve query parameters
            'Cache-Control': 'max-age=3600'
          }
        });
      }
      
      // If the URL has the correct language prefix, redirect to the clean URL without language prefix
      if (pathLang && pathLang === lang) {
        const pathWithoutLang = path.replace(allLangsPattern, '/');
        const cleanPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
        
        return new Response(null, {
          status: 301, // Permanent redirect
          headers: {
            'Location': cleanPath + queryString, // Preserve query parameters
            'Cache-Control': 'max-age=3600'
          }
        });
      }
    }
    
    // At this point, we have a URL without language prefix
    // Rewrite the URL internally to include the language prefix
    
    // Create a new request with the language prefix added to the path
    const newUrl = new URL(context.request.url);
    const langPath = `/${lang}${path === '/' ? '/' : path}`;
    newUrl.pathname = langPath;
    // Query parameters are automatically preserved in the URL object

    // Create a new request with the modified URL
    const newRequest = new Request(newUrl.toString(), {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.body,
      redirect: 'manual'
    });
    
    // Get the response from the origin with the rewritten URL
    const response = await context.env.ASSETS.fetch(newRequest);
    
    // Add cache control headers based on file type
    const url_path = newUrl.pathname.toLowerCase();
    let cacheControl;
    
    // Set one month (31 days) cache for static assets
    cacheControl = 'public, max-age=2678400'; // 31 days with revalidation
    
    // Clone the response and add the cache control header
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', cacheControl);
    
    return newResponse;
    
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
