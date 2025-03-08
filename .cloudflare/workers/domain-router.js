// ConFoot Domain Router Worker
// This worker routes requests based on the domain to the correct language content

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const domain = url.hostname
  
  // Map domains to language paths
  const domainLanguageMap = {
    'www.confoot.eu': 'en',
    'confoot.eu': 'en',
    'www.confoot.cz': 'cs',
    'confoot.cz': 'cs',
    'www.confoot.sk': 'sk',
    'confoot.sk': 'sk',
    'www.confoot.de': 'de',
    'confoot.de': 'de',
    'www.confoot.gr': 'gr',
    'confoot.gr': 'gr',
    'www.confoot.hr': 'hr',
    'confoot.hr': 'hr',
    'www.confoot.lt': 'lt',
    'confoot.lt': 'lt',
    'www.confoot.ru': 'ru',
    'confoot.ru': 'ru',
    'www.confoot.lv': 'lv',
    'confoot.lv': 'lv',
    'www.confoot.si': 'si',
    'confoot.si': 'si',
    'www.confoot.ro': 'ro',
    'confoot.ro': 'ro',
    'www.confoot.li': 'de',
    'confoot.li': 'de',
    'www.confoot.at': 'de',
    'confoot.at': 'de',
    'www.confoot.ch': 'de',
    'confoot.ch': 'de',
    'www.confoot.pt': 'pt',
    'confoot.pt': 'pt',
    'www.confoot.co.uk': 'en',
    'confoot.co.uk': 'en'
  }
  
  // Get language code for the domain
  const languageCode = domainLanguageMap[domain] || 'en'
  
  // Clone the request
  let newRequest = new Request(request)
  let newUrl = new URL(request.url)
  
  // Cloudflare Pages URL (replace with your actual Pages URL)
  const pagesUrl = 'https://confoot.pages.dev'
  
  // Construct the new URL with language path
  // For the default language (en), don't add a language prefix
  if (languageCode === 'en') {
    newUrl = new URL(`${pagesUrl}${url.pathname}${url.search}`)
  } else {
    // For other languages, add the language prefix
    newUrl = new URL(`${pagesUrl}/${languageCode}${url.pathname}${url.search}`)
  }
  
  // Create a new request with the modified URL
  newRequest = new Request(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })
  
  // Add a header to indicate the original domain
  newRequest.headers.set('X-Original-Domain', domain)
  newRequest.headers.set('X-Language', languageCode)
  
  // Fetch from Cloudflare Pages
  return fetch(newRequest)
}
