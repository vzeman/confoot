// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  try {
    // Log the start of function execution
    console.log('Middleware started, URL:', context.request.url);
    
    // Extract hostname from request headers
    const host = context.request.headers.get('host') || '';
    const hostname = host.toLowerCase();
    console.log('Hostname from headers:', hostname);
    
    // Get the path from the URL
    const urlString = context.request.url;
    const pathMatch = urlString.match(/https?:\/\/[^\/]+(\/.*)/);
    const path = pathMatch ? pathMatch[1] : '/';
    console.log('Path:', path);
    
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
      'confoot.si': 'sl',
      'www.confoot.si': 'sl',
      'confoot.ro': 'ro',
      'www.confoot.ro': 'ro',
      'confoot.li': 'de',
      'www.confoot.li': 'de',
      'confoot.at': 'de',
      'www.confoot.at': 'de',
      'confoot.ch': 'ch',
      'www.confoot.ch': 'ch',
      'confoot.pt': 'pt',
      'www.confoot.pt': 'pt',
      'confoot.es': 'es',
      'www.confoot.es': 'es',
      'confoot.it': 'it',
      'www.confoot.it': 'it',
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
        
        console.log('Removing incorrect language prefix, redirecting to:', cleanPath);
        return new Response(null, {
          status: 301, // Permanent redirect
          headers: {
            'Location': cleanPath,
            'Cache-Control': 'max-age=3600'
          }
        });
      }
      
      // If the URL has the correct language prefix, redirect to the clean URL without language prefix
      if (pathLang && pathLang === lang) {
        const pathWithoutLang = path.replace(allLangsPattern, '/');
        const cleanPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
        
        console.log('Removing language prefix to keep URL clean, redirecting to:', cleanPath);
        return new Response(null, {
          status: 301, // Permanent redirect
          headers: {
            'Location': cleanPath,
            'Cache-Control': 'max-age=3600'
          }
        });
      }
    }
    
    // At this point, we have a URL without language prefix
    // Rewrite the URL internally to include the language prefix
    
    // Create a new request with the language prefix added to the path
    const url = new URL(context.request.url);
    const langPath = `/${lang}${path === '/' ? '/' : path}`;
    url.pathname = langPath;
    
    console.log('Internally rewriting request to:', url.pathname);
    
    // Create a new request with the modified URL
    const newRequest = new Request(url.toString(), {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.body,
      redirect: 'manual'
    });
    
    // Get the response from the origin with the rewritten URL
    return context.env.ASSETS.fetch(newRequest);
    
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
