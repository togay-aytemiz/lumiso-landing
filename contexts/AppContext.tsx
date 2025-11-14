import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../translations';
import { SITE_URL, seoContent } from '../seo.config';

type Language = 'en' | 'tr';
type Theme = 'light' | 'dark';

const SUPPORTED_LANGUAGES: Language[] = ['en', 'tr'];

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';

    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang');
    if (paramLang && SUPPORTED_LANGUAGES.includes(paramLang as Language)) {
      return paramLang as Language;
    }

    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      return storedLang;
    }

    const userLang = navigator.language.split('-')[0] as Language;
    if (SUPPORTED_LANGUAGES.includes(userLang)) {
      return userLang;
    }

    return 'en';
  });
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('language', language);
    const url = new URL(window.location.href);
    if (language === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', language);
    }
    if (url.href !== window.location.href) {
      window.history.replaceState({}, '', url.href);
    }
  }, [language]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const meta = seoContent[language];
    document.title = meta.title;

    const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      const selector = `meta[${attribute}="${key}"]`;
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const upsertLink = (rel: string, attrs: Record<string, string>) => {
      const selector = attrs.hreflang
        ? `link[rel="${rel}"][hreflang="${attrs.hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let element = document.head.querySelector<HTMLLinkElement>(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([attr, value]) => {
        element!.setAttribute(attr, value);
      });
    };
    const upsertJsonLd = (id: string, data: Record<string, unknown>) => {
      let script = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    const currentPath = window.location.pathname + window.location.search;
    const canonicalUrl = `${SITE_URL}${currentPath}`;

    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'keywords', meta.keywords);
    upsertMeta('property', 'og:title', meta.ogTitle);
    upsertMeta('property', 'og:description', meta.ogDescription);
    upsertMeta('property', 'og:locale', meta.ogLocale);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.ogTitle);
    upsertMeta('name', 'twitter:description', meta.ogDescription);
    upsertMeta('name', 'twitter:url', canonicalUrl);

    upsertLink('canonical', { href: canonicalUrl });
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const localizedUrl =
        lang === 'en'
          ? canonicalUrl
          : `${SITE_URL}${window.location.pathname}?lang=${lang}`;
      upsertLink('alternate', { href: localizedUrl, hreflang: lang });
    });
    upsertLink('alternate', { href: canonicalUrl, hreflang: 'x-default' });

    const faqItems = (translations[language]['faq.items'] as Array<{ question: string; answer: string }>) || [];
    const faqTitle = `${translations[language]['faq.title.regular'] ?? ''} ${translations[language]['faq.title.bold'] ?? ''}`.trim();
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'PhotoFlow',
          url: SITE_URL,
          description: meta.description,
        },
        {
          '@type': 'Product',
          name: meta.title,
          description: meta.description,
          url: canonicalUrl,
          brand: {
            '@type': 'Organization',
            name: 'PhotoFlow',
          },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            price: '0',
            availability: 'https://schema.org/PreOrder',
          },
        },
        {
          '@type': 'FAQPage',
          name: faqTitle || meta.title,
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ],
    };
    upsertJsonLd('photoflow-structured-data', structuredData);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const t = useCallback((key: string, replacements: { [key: string]: string } = {}): string => {
      let translation = translations[language][key] || translations['en'][key] || key;
      Object.keys(replacements).forEach(rKey => {
          translation = translation.replace(`{${rKey}}`, replacements[rKey]);
      });
      return translation;
  }, [language]);

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
