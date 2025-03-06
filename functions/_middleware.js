// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  try {
    const request = context.request;
    const url = new URL(request.url);
    const hostname = url.hostname;
    let languagePrefix = 'en'; // Default to English
    
    // Simple domain-to-language mapping with fallbacks
    if (hostname.includes('confoot.cz')) languagePrefix = 'cs';
    else if (hostname.includes('confoot.sk')) languagePrefix = 'sk';
    else if (hostname.includes('confoot.de')) languagePrefix = 'de';
    else if (hostname.includes('confoot.gr')) languagePrefix = 'gr';
    else if (hostname.includes('confoot.hr')) languagePrefix = 'hr';
    else if (hostname.includes('confoot.lt')) languagePrefix = 'lt';
    else if (hostname.includes('confoot.lv')) languagePrefix = 'lv';
    else if (hostname.includes('confoot.ru')) languagePrefix = 'ru';
    else if (hostname.includes('confoot.si')) languagePrefix = 'sl';
    else if (hostname.includes('confoot.ro')) languagePrefix = 'ro';
    else if (hostname.includes('confoot.li')) languagePrefix = 'li';
    else if (hostname.includes('confoot.at')) languagePrefix = 'at';
    else if (hostname.includes('confoot.ch')) languagePrefix = 'ch';
    else if (hostname.includes('confoot.pt')) languagePrefix = 'pt';
    // Default is already set to 'en'
    
    // Skip rewriting if already accessing a language path
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts[0] === languagePrefix) {
      return context.next();
    }
    
    // Create new URL with language prefix
    const newUrl = new URL(url);
    newUrl.pathname = `/${languagePrefix}${url.pathname}`;
    
    // Return modified request
    return context.next({
      request: {
        ...request,
        url: newUrl.toString()
      }
    });
  } catch (error) {
    // If anything fails, just continue without modification
    console.error('Error in middleware:', error);
    return context.next();
  }
}
