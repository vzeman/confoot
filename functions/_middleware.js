// Cloudflare Pages Functions - Basic domain-based language routing
export async function onRequest(context) {
  try {
    // Log the start of function execution
    console.log('Middleware started, URL:', context.request.url);
    
    // Get the hostname from the request
    const url = new URL(context.request.url);
    const hostname = url.hostname.toLowerCase();
    console.log('Hostname:', hostname);
    
    // Default to English
    let lang = 'en';
    
    // Map domains to language codes based on user's configuration
    if (hostname.indexOf('confoot.cz') > -1) lang = 'cs';
    if (hostname.indexOf('confoot.sk') > -1) lang = 'sk';
    if (hostname.indexOf('confoot.de') > -1) lang = 'de';
    if (hostname.indexOf('confoot.gr') > -1) lang = 'gr';
    if (hostname.indexOf('confoot.hr') > -1) lang = 'hr';
    if (hostname.indexOf('confoot.lt') > -1) lang = 'lt';
    if (hostname.indexOf('confoot.lv') > -1) lang = 'lv';
    if (hostname.indexOf('confoot.ru') > -1) lang = 'ru';
    if (hostname.indexOf('confoot.si') > -1) lang = 'sl';
    if (hostname.indexOf('confoot.ro') > -1) lang = 'ro';
    if (hostname.indexOf('confoot.li') > -1) lang = 'li';
    if (hostname.indexOf('confoot.at') > -1) lang = 'at';
    if (hostname.indexOf('confoot.ch') > -1) lang = 'ch';
    if (hostname.indexOf('confoot.pt') > -1) lang = 'pt';
    console.log('Selected language:', lang);
    
    // Skip rewriting if already on a language path
    const path = url.pathname;
    console.log('Original path:', path);
    
    if (path.startsWith(`/${lang}/`)) {
      console.log('Path already has language prefix, no rewrite needed');
      return context.next();
    }
    
    // Add language prefix to path
    const newUrl = new URL(url);
    newUrl.pathname = `/${lang}${path}`;
    console.log('Rewritten URL:', newUrl.toString());
    
    // Return modified request
    return context.next({
      request: {
        ...context.request,
        url: newUrl.toString()
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
