// Cloudflare Pages Functions - Domain-based language routing
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const hostname = url.hostname;
  let languagePrefix = '';

  // Map domains to language prefixes
  const domainLanguageMap = {
    'www.confoot.eu': 'en',
    'www.confoot.cz': 'cs',
    'www.confoot.sk': 'sk',
    'www.confoot.de': 'de',
    'www.confoot.gr': 'gr',
    'www.confoot.hr': 'hr',
    'www.confoot.lt': 'lt',
    'www.confoot.lv': 'lv',
    'www.confoot.ru': 'ru',
    'www.confoot.si': 'sl',
    'www.confoot.ro': 'ro',
    'www.confoot.li': 'li',
    'www.confoot.at': 'at',
    'www.confoot.ch': 'ch',
    'www.confoot.pt': 'pt'
  };

  // Get language prefix based on hostname
  if (domainLanguageMap[hostname]) {
    languagePrefix = domainLanguageMap[hostname];
  } else {
    // Default to English for unknown domains
    languagePrefix = 'en';
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
}
