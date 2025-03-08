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
    
    // Check if the path already starts with the language code
    // This prevents redirect loops
    const langPattern = new RegExp(`^\\/${lang}\\/`);
    if (langPattern.test(path)) {
      console.log('Path already has correct language prefix, no redirect needed');
      return context.next();
    }
    
    // Check if the path has any language prefix
    const allLangsPattern = new RegExp(`^\\/(${Object.values(domainLanguageMap).join('|')})\\/`);
    if (allLangsPattern.test(path)) {
      // Extract the path without the language prefix
      const pathWithoutLang = path.replace(allLangsPattern, '/');
      // Create new path with correct language
      const correctLangPath = `/${lang}${pathWithoutLang === '/' ? '/' : pathWithoutLang}`;
      console.log('Replacing incorrect language prefix with:', correctLangPath);
      
      return new Response(null, {
        status: 301, // Permanent redirect
        headers: {
          'Location': correctLangPath,
          'Cache-Control': 'max-age=3600'
        }
      });
    }
    
    // Create the language-specific path
    const langPath = `/${lang}${path === '/' ? '/' : path}`;
    console.log('Redirecting to language path:', langPath);
    
    // Return a redirect response
    return new Response(null, {
      status: 302, // Temporary redirect
      headers: {
        'Location': langPath,
        'Cache-Control': 'no-cache'
      }
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
