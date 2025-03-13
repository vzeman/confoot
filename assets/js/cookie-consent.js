/**
 * ConFoot Cookie Consent
 * Simple cookie consent banner with support for necessary, analytics, and marketing cookies
 */

class CookieConsent {
  constructor(config = {}) {
    this.cookieName = config.cookieName || 'confoot_cookie_consent';
    this.expirationDays = config.expirationDays || 365;
    this.analyticsCallback = config.analyticsCallback || this.defaultAnalyticsCallback;
    this.marketingCallback = config.marketingCallback || this.defaultMarketingCallback;
    this.necessaryCallback = config.necessaryCallback || this.defaultNecessaryCallback;
    this.language = document.documentElement.lang || 'en';
    
    this.translations = {
      en: {
        title: 'Cookie Consent',
        description: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.',
        acceptAll: 'Accept All',
        acceptNecessary: 'Accept Necessary',
        customize: 'Customize',
        save: 'Save Settings',
        necessary: 'Necessary',
        necessaryDescription: 'These cookies are essential for the website to function properly.',
        analytics: 'Analytics',
        analyticsDescription: 'These cookies help us understand how visitors interact with our website.',
        marketing: 'Marketing',
        marketingDescription: 'These cookies are used to deliver relevant advertisements.',
        privacyPolicy: 'Privacy Policy',
        cookiePolicy: 'Cookie Policy'
      },
      de: {
        title: 'Cookie-Zustimmung',
        description: 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, den Website-Verkehr zu analysieren und Inhalte zu personalisieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu.',
        acceptAll: 'Alle akzeptieren',
        acceptNecessary: 'Nur notwendige',
        customize: 'Anpassen',
        save: 'Einstellungen speichern',
        necessary: 'Notwendig',
        necessaryDescription: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich.',
        analytics: 'Analyse',
        analyticsDescription: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
        marketing: 'Marketing',
        marketingDescription: 'Diese Cookies werden verwendet, um relevante Werbung zu liefern.',
        privacyPolicy: 'Datenschutzrichtlinie',
        cookiePolicy: 'Cookie-Richtlinie'
      },
      cs: {
        title: 'Souhlas s cookies',
        description: 'Používáme cookies pro vylepšení vašeho prohlížení, analýzu návštěvnosti a personalizaci obsahu. Kliknutím na "Přijmout vše" souhlasíte s používáním cookies.',
        acceptAll: 'Přijmout vše',
        acceptNecessary: 'Pouze nezbytné',
        customize: 'Přizpůsobit',
        save: 'Uložit nastavení',
        necessary: 'Nezbytné',
        necessaryDescription: 'Tyto cookies jsou nezbytné pro správné fungování webových stránek.',
        analytics: 'Analytické',
        analyticsDescription: 'Tyto cookies nám pomáhají pochopit, jak návštěvníci interagují s našimi stránkami.',
        marketing: 'Marketingové',
        marketingDescription: 'Tyto cookies se používají k zobrazování relevantní reklamy.',
        privacyPolicy: 'Zásady ochrany osobních údajů',
        cookiePolicy: 'Zásady používání cookies'
      },
      es: {
        title: 'Consentimiento de cookies',
        description: 'Utilizamos cookies para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Al hacer clic en "Aceptar todo", usted consiente nuestro uso de cookies.',
        acceptAll: 'Aceptar todo',
        acceptNecessary: 'Solo necesarias',
        customize: 'Personalizar',
        save: 'Guardar configuración',
        necessary: 'Necesarias',
        necessaryDescription: 'Estas cookies son esenciales para que el sitio web funcione correctamente.',
        analytics: 'Analíticas',
        analyticsDescription: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.',
        marketing: 'Marketing',
        marketingDescription: 'Estas cookies se utilizan para entregar publicidad relevante.',
        privacyPolicy: 'Política de privacidad',
        cookiePolicy: 'Política de cookies'
      },
      gr: {
        title: 'Συγκατάθεση για cookies',
        description: 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία περιήγησής σας, να αναλύσουμε την επισκεψιμότητα του ιστότοπου και να εξατομικεύσουμε το περιεχόμενο. Κάνοντας κλικ στο "Αποδοχή όλων", συναινείτε στη χρήση των cookies από εμάς.',
        acceptAll: 'Αποδοχή όλων',
        acceptNecessary: 'Μόνο απαραίτητα',
        customize: 'Προσαρμογή',
        save: 'Αποθήκευση ρυθμίσεων',
        necessary: 'Απαραίτητα',
        necessaryDescription: 'Αυτά τα cookies είναι απαραίτητα για τη σωστή λειτουργία του ιστότοπου.',
        analytics: 'Αναλυτικά',
        analyticsDescription: 'Αυτά τα cookies μας βοηθούν να κατανοήσουμε πώς αλληλεπιδρούν οι επισκέπτες με τον ιστότοπό μας.',
        marketing: 'Μάρκετινγκ',
        marketingDescription: 'Αυτά τα cookies χρησιμοποιούνται για την προβολή σχετικών διαφημίσεων.',
        privacyPolicy: 'Πολιτική απορρήτου',
        cookiePolicy: 'Πολιτική cookies'
      },
      hr: {
        title: 'Pristanak za kolačiće',
        description: 'Koristimo kolačiće za poboljšanje vašeg iskustva pregledavanja, analizu prometa na web stranici i personalizaciju sadržaja. Klikom na "Prihvati sve", pristajete na našu upotrebu kolačića.',
        acceptAll: 'Prihvati sve',
        acceptNecessary: 'Samo nužne',
        customize: 'Prilagodi',
        save: 'Spremi postavke',
        necessary: 'Nužni',
        necessaryDescription: 'Ovi kolačići su neophodni za pravilno funkcioniranje web stranice.',
        analytics: 'Analitički',
        analyticsDescription: 'Ovi kolačići nam pomažu razumjeti kako posjetitelji koriste našu web stranicu.',
        marketing: 'Marketinški',
        marketingDescription: 'Ovi kolačići se koriste za prikazivanje relevantnih oglasa.',
        privacyPolicy: 'Politika privatnosti',
        cookiePolicy: 'Politika kolačića'
      },
      it: {
        title: 'Consenso ai cookie',
        description: 'Utilizziamo i cookie per migliorare la tua esperienza di navigazione, analizzare il traffico del sito e personalizzare i contenuti. Cliccando su "Accetta tutti", acconsenti al nostro utilizzo dei cookie.',
        acceptAll: 'Accetta tutti',
        acceptNecessary: 'Solo necessari',
        customize: 'Personalizza',
        save: 'Salva impostazioni',
        necessary: 'Necessari',
        necessaryDescription: 'Questi cookie sono essenziali per il corretto funzionamento del sito web.',
        analytics: 'Analitici',
        analyticsDescription: 'Questi cookie ci aiutano a capire come i visitatori interagiscono con il nostro sito web.',
        marketing: 'Marketing',
        marketingDescription: 'Questi cookie vengono utilizzati per fornire pubblicità pertinenti.',
        privacyPolicy: 'Informativa sulla privacy',
        cookiePolicy: 'Informativa sui cookie'
      },
      lt: {
        title: 'Slapukų sutikimas',
        description: 'Mes naudojame slapukus, kad pagerintume jūsų naršymo patirtį, analizuotume svetainės srautą ir personalizuotume turinį. Spustelėdami "Priimti visus", sutinkate su mūsų slapukų naudojimu.',
        acceptAll: 'Priimti visus',
        acceptNecessary: 'Tik būtinus',
        customize: 'Pritaikyti',
        save: 'Išsaugoti nustatymus',
        necessary: 'Būtini',
        necessaryDescription: 'Šie slapukai yra būtini, kad svetainė tinkamai veiktų.',
        analytics: 'Analitiniai',
        analyticsDescription: 'Šie slapukai padeda mums suprasti, kaip lankytojai sąveikauja su mūsų svetaine.',
        marketing: 'Rinkodaros',
        marketingDescription: 'Šie slapukai naudojami pateikti aktualius skelbimus.',
        privacyPolicy: 'Privatumo politika',
        cookiePolicy: 'Slapukų politika'
      },
      lv: {
        title: 'Sīkdatņu piekrišana',
        description: 'Mēs izmantojam sīkdatnes, lai uzlabotu jūsu pārlūkošanas pieredzi, analizētu vietnes apmeklējumus un personalizētu saturu. Noklikšķinot uz "Pieņemt visus", jūs piekrītat mūsu sīkdatņu izmantošanai.',
        acceptAll: 'Pieņemt visus',
        acceptNecessary: 'Tikai nepieciešamie',
        customize: 'Pielāgot',
        save: 'Saglabāt iestatījumus',
        necessary: 'Nepieciešamie',
        necessaryDescription: 'Šīs sīkdatnes ir būtiskas, lai vietne darbotos pareizi.',
        analytics: 'Analītiskie',
        analyticsDescription: 'Šīs sīkdatnes palīdz mums saprast, kā apmeklētāji mijiedarbojas ar mūsu vietni.',
        marketing: 'Mārketinga',
        marketingDescription: 'Šīs sīkdatnes tiek izmantotas, lai piegādātu atbilstošas reklāmas.',
        privacyPolicy: 'Privātuma politika',
        cookiePolicy: 'Sīkdatņu politika'
      },
      pt: {
        title: 'Consentimento de cookies',
        description: 'Utilizamos cookies para melhorar a sua experiência de navegação, analisar o tráfego do site e personalizar o conteúdo. Ao clicar em "Aceitar todos", você consente com o nosso uso de cookies.',
        acceptAll: 'Aceitar todos',
        acceptNecessary: 'Apenas necessários',
        customize: 'Personalizar',
        save: 'Guardar configurações',
        necessary: 'Necessários',
        necessaryDescription: 'Estes cookies são essenciais para o funcionamento correto do site.',
        analytics: 'Analíticos',
        analyticsDescription: 'Estes cookies ajudam-nos a entender como os visitantes interagem com o nosso site.',
        marketing: 'Marketing',
        marketingDescription: 'Estes cookies são usados para entregar publicidade relevante.',
        privacyPolicy: 'Política de privacidade',
        cookiePolicy: 'Política de cookies'
      },
      ro: {
        title: 'Consimțământ pentru cookie-uri',
        description: 'Folosim cookie-uri pentru a îmbunătăți experiența dvs. de navigare, a analiza traficul site-ului și a personaliza conținutul. Făcând clic pe "Acceptă toate", vă dați consimțământul pentru utilizarea cookie-urilor de către noi.',
        acceptAll: 'Acceptă toate',
        acceptNecessary: 'Doar necesare',
        customize: 'Personalizează',
        save: 'Salvează setările',
        necessary: 'Necesare',
        necessaryDescription: 'Aceste cookie-uri sunt esențiale pentru funcționarea corectă a site-ului web.',
        analytics: 'Analitice',
        analyticsDescription: 'Aceste cookie-uri ne ajută să înțelegem cum interacționează vizitatorii cu site-ul nostru web.',
        marketing: 'Marketing',
        marketingDescription: 'Aceste cookie-uri sunt utilizate pentru a livra reclame relevante.',
        privacyPolicy: 'Politica de confidențialitate',
        cookiePolicy: 'Politica de cookie-uri'
      },
      ru: {
        title: 'Согласие на использование файлов cookie',
        description: 'Мы используем файлы cookie для улучшения вашего опыта просмотра, анализа трафика сайта и персонализации контента. Нажимая "Принять все", вы соглашаетесь с нашим использованием файлов cookie.',
        acceptAll: 'Принять все',
        acceptNecessary: 'Только необходимые',
        customize: 'Настроить',
        save: 'Сохранить настройки',
        necessary: 'Необходимые',
        necessaryDescription: 'Эти файлы cookie необходимы для правильной работы веб-сайта.',
        analytics: 'Аналитические',
        analyticsDescription: 'Эти файлы cookie помогают нам понять, как посетители взаимодействуют с нашим веб-сайтом.',
        marketing: 'Маркетинговые',
        marketingDescription: 'Эти файлы cookie используются для показа релевантной рекламы.',
        privacyPolicy: 'Политика конфиденциальности',
        cookiePolicy: 'Политика в отношении файлов cookie'
      },
      sk: {
        title: 'Súhlas s cookies',
        description: 'Používame cookies na zlepšenie vášho zážitku z prehliadania, analýzu návštevnosti stránok a prispôsobenie obsahu. Kliknutím na "Prijať všetky" súhlasíte s naším používaním cookies.',
        acceptAll: 'Prijať všetky',
        acceptNecessary: 'Iba nevyhnutné',
        customize: 'Prispôsobiť',
        save: 'Uložiť nastavenia',
        necessary: 'Nevyhnutné',
        necessaryDescription: 'Tieto cookies sú nevyhnutné pre správne fungovanie webovej stránky.',
        analytics: 'Analytické',
        analyticsDescription: 'Tieto cookies nám pomáhajú pochopiť, ako návštevníci interagujú s našou webovou stránkou.',
        marketing: 'Marketingové',
        marketingDescription: 'Tieto cookies sa používajú na zobrazovanie relevantných reklám.',
        privacyPolicy: 'Zásady ochrany osobných údajov',
        cookiePolicy: 'Zásady používania cookies'
      },
      sl: {
        title: 'Soglasje za piškotke',
        description: 'Uporabljamo piškotke za izboljšanje vaše izkušnje brskanja, analizo prometa na spletnem mestu in prilagajanje vsebine. S klikom na "Sprejmi vse" soglašate z našo uporabo piškotkov.',
        acceptAll: 'Sprejmi vse',
        acceptNecessary: 'Samo nujne',
        customize: 'Prilagodi',
        save: 'Shrani nastavitve',
        necessary: 'Nujni',
        necessaryDescription: 'Ti piškotki so bistveni za pravilno delovanje spletnega mesta.',
        analytics: 'Analitični',
        analyticsDescription: 'Ti piškotki nam pomagajo razumeti, kako obiskovalci uporabljajo našo spletno stran.',
        marketing: 'Trženjski',
        marketingDescription: 'Ti piškotki se uporabljajo za prikazovanje ustreznih oglasov.',
        privacyPolicy: 'Politika zasebnosti',
        cookiePolicy: 'Politika piškotkov'
      }
    };
    
    // Add fallbacks for languages not explicitly defined
    this.getTranslation = (key) => {
      const lang = this.language.substring(0, 2);
      const translations = this.translations[lang] || this.translations['en'];
      return translations[key] || this.translations['en'][key];
    };
    
    this.init();
  }
  
  initCookieSettingsButtons() {
    // Add event listener for the cookie settings buttons
    document.addEventListener('DOMContentLoaded', () => {
      const cookieSettingsButtons = document.querySelectorAll('.open-cookie-settings');
      
      if (cookieSettingsButtons.length > 0) {
        cookieSettingsButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCustomizeModal();
          });
        });
      }
    });
    
    // Also add the event listeners immediately in case the DOM is already loaded
    const cookieSettingsButtons = document.querySelectorAll('.open-cookie-settings');
    if (cookieSettingsButtons.length > 0) {
      cookieSettingsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.showCustomizeModal();
        });
      });
    }
  }
  
  init() {
    // Check if consent has already been given
    const consent = this.getConsent();
    
    if (!consent) {
      // If no consent has been given, show the banner
      this.createBanner();
    } else {
      // Apply the saved consent settings
      this.applyConsent(consent);
    }
    
    // Initialize cookie settings buttons in the footer
    this.initCookieSettingsButtons();
  }
  
  createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent-banner';
    
    banner.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-content">
          <h3>${this.getTranslation('title')}</h3>
          <p>${this.getTranslation('description')}</p>
        </div>
        <div class="cookie-consent-buttons">
          <button id="cookie-accept-necessary" class="cookie-button cookie-button-secondary">${this.getTranslation('acceptNecessary')}</button>
          <button id="cookie-customize" class="cookie-button cookie-button-secondary">${this.getTranslation('customize')}</button>
          <button id="cookie-accept-all" class="cookie-button cookie-button-primary">${this.getTranslation('acceptAll')}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add event listeners
    document.getElementById('cookie-accept-all').addEventListener('click', () => this.acceptAll());
    document.getElementById('cookie-accept-necessary').addEventListener('click', () => this.acceptNecessary());
    document.getElementById('cookie-customize').addEventListener('click', () => this.showCustomizeModal());
  }
  
  showCustomizeModal() {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('cookie-customize-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'cookie-customize-modal';
    modal.className = 'cookie-consent-modal';
    
    // Get current consent or default values
    const consent = this.getConsent() || { necessary: true, analytics: false, marketing: false };
    
    modal.innerHTML = `
      <div class="cookie-consent-modal-content">
        <h3>${this.getTranslation('title')}</h3>
        
        <div class="cookie-consent-option">
          <div class="cookie-consent-option-header">
            <label>
              <input type="checkbox" id="necessary-checkbox" checked disabled>
              <span>${this.getTranslation('necessary')}</span>
            </label>
          </div>
          <p>${this.getTranslation('necessaryDescription')}</p>
        </div>
        
        <div class="cookie-consent-option">
          <div class="cookie-consent-option-header">
            <label>
              <input type="checkbox" id="analytics-checkbox" ${consent.analytics ? 'checked' : ''}>
              <span>${this.getTranslation('analytics')}</span>
            </label>
          </div>
          <p>${this.getTranslation('analyticsDescription')}</p>
        </div>
        
        <div class="cookie-consent-option">
          <div class="cookie-consent-option-header">
            <label>
              <input type="checkbox" id="marketing-checkbox" ${consent.marketing ? 'checked' : ''}>
              <span>${this.getTranslation('marketing')}</span>
            </label>
          </div>
          <p>${this.getTranslation('marketingDescription')}</p>
        </div>
        
        <div class="cookie-consent-modal-buttons">
          <button id="cookie-save-preferences" class="cookie-button cookie-button-primary">${this.getTranslation('save')}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for save button
    document.getElementById('cookie-save-preferences').addEventListener('click', () => {
      const newConsent = {
        necessary: true, // Always required
        analytics: document.getElementById('analytics-checkbox').checked,
        marketing: document.getElementById('marketing-checkbox').checked
      };
      
      this.saveConsent(newConsent);
      this.applyConsent(newConsent);
      modal.remove();
      
      // Remove the banner if it exists
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) {
        banner.remove();
      }
    });
  }
  
  acceptAll() {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    
    // Remove the banner
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.remove();
    }
  }
  
  acceptNecessary() {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    
    // Remove the banner
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.remove();
    }
  }
  
  saveConsent(consent) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.expirationDays);
    
    const consentString = JSON.stringify(consent);
    document.cookie = `${this.cookieName}=${encodeURIComponent(consentString)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
  }
  
  getConsent() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${this.cookieName}=`)) {
        try {
          return JSON.parse(decodeURIComponent(cookie.substring(this.cookieName.length + 1)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }
  
  applyConsent(consent) {
    // Always apply necessary cookies
    this.necessaryCallback(true);
    
    // Apply analytics cookies if consented
    this.analyticsCallback(consent.analytics);
    
    // Apply marketing cookies if consented
    this.marketingCallback(consent.marketing);
  }
  
  defaultNecessaryCallback(isAllowed) {
    // Necessary cookies are always allowed
    // This is a placeholder for any necessary cookie initialization
  }
  
  defaultAnalyticsCallback(isAllowed) {
    // Handle Google Analytics
    if (isAllowed) {
      // Enable Google Analytics
      if (typeof gtag === 'function') {
        // If gtag is already loaded, update consent
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      } else {
        // Set consent before gtag is loaded
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          'analytics_storage': 'granted'
        });
      }
    } else {
      // Disable Google Analytics
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      } else {
        // Set consent before gtag is loaded
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          'analytics_storage': 'denied'
        });
      }
      
      // Optionally, delete existing analytics cookies
      this.deleteCookie('_ga');
      this.deleteCookie('_gat');
      this.deleteCookie('_gid');
    }
  }
  
  defaultMarketingCallback(isAllowed) {
    // This is a placeholder for marketing cookies
    
    // Example: handle marketing cookies
    if (isAllowed) {
      // Enable marketing cookies
    } else {
      // Disable marketing cookies
    }
  }
  
  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  }
}

// Initialize the cookie consent when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsent();
});
