// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  try {
    // Log the start of function execution
    console.log('Middleware started, URL:', context.request.url);
    
    // Parse the URL manually to avoid URL object issues
    const fullUrl = context.request.url;
    const urlParts = fullUrl.split('//');
    if (urlParts.length < 2) {
      console.log('Invalid URL format, continuing without modification');
      return context.next();
    }
    
    const protocol = urlParts[0];
    const hostAndPath = urlParts[1].split('/');
    const hostname = hostAndPath[0].toLowerCase();
    
    console.log('Hostname:', hostname);
    
    // Reconstruct the path
    let path = '/' + hostAndPath.slice(1).join('/');
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
    const langPattern = new RegExp(`^\\/(${Object.values(domainLanguageMap).join('|')})\\/`);
    const langMatch = path.match(langPattern);
    
    if (langMatch) {
      // If URL already has language prefix, remove it
      if (langMatch[1] === lang) {
        const newPath = path.replace(langPattern, '/');
        const redirectUrl = `${protocol}//${hostname}${newPath}`;
        console.log('Removing language prefix, redirecting to:', redirectUrl);
        
        return new Response(null, {
          status: 301,
          headers: {
            'Location': redirectUrl,
            'Cache-Control': 'max-age=3600'
          }
        });
      }
      return context.next();
    }
    
    // Create path with language prefix for internal routing
    const internalPath = path === '/' ? `/${lang}/` : `/${lang}${path}`;
    console.log('Internal rewrite to:', internalPath);
    
    // Create a new request with the modified path
    // Manually construct the URL string to avoid URL object issues
    const newUrlString = `${protocol}//${hostname}${internalPath}`;
    
    try {
      // Create a new request with the modified URL
      const newRequest = new Request(newUrlString, {
        method: context.request.method,
        headers: context.request.headers,
        body: context.request.body
      });
      
      // Return the modified request
      return context.next({
        request: newRequest
      });
    } catch (urlError) {
      console.error('Error creating request with new URL:', urlError);
      console.error('Attempted URL:', newUrlString);
      
      // If we can't create a new request, just continue without modification
      return context.next();
    }
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
