import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../translations';
import { SITE_URL, seoContent } from '../seo.config';

type Language = 'en' | 'tr';
type Theme = 'light' | 'dark';

export type SeoOverrides = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogLocale?: string;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  canonicalUrl?: string;
  structuredDataGraph?: Array<Record<string, unknown>>;
  extraMeta?: Array<{
    attribute: 'name' | 'property';
    key: string;
    content: string;
  }>;
};

const SUPPORTED_LANGUAGES: Language[] = ['en', 'tr'];

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
  setSeoOverrides: (overrides: SeoOverrides | null) => void;
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
  const [seoOverrides, setSeoOverrides] = useState<SeoOverrides | null>(null);

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
    if (url.searchParams.has('lang')) {
      url.searchParams.delete('lang');
      if (url.href !== window.location.href) {
        window.history.replaceState({}, '', url.href);
      }
    }
  }, [language]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const siteOrigin = SITE_URL.replace(/\/$/, '');
    const meta = seoContent[language];
    const mergedTitle = seoOverrides?.title || meta.title;
    const mergedDescription = seoOverrides?.description || meta.description;
    const mergedKeywords = seoOverrides?.keywords || meta.keywords;
    const mergedOgTitle = seoOverrides?.ogTitle || seoOverrides?.title || meta.ogTitle;
    const mergedOgDescription = seoOverrides?.ogDescription || mergedDescription || meta.ogDescription;
    const mergedOgLocale = seoOverrides?.ogLocale || meta.ogLocale;
    const mergedOgType = seoOverrides?.ogType || 'website';
    const mergedTwitterTitle = seoOverrides?.twitterTitle || mergedOgTitle;
    const mergedTwitterDescription = seoOverrides?.twitterDescription || mergedOgDescription;
    const defaultSocialImage = `${siteOrigin}/og-image.jpg`;
    const defaultSocialAlt =
      translations[language]?.['hero.imageAlt'] ||
      translations.en['hero.imageAlt'] ||
      'Lumiso dashboard showcasing revenue trends, bookings, calendar, and client tasks.';
    const ogImage = seoOverrides?.ogImage || defaultSocialImage;
    const ogImageAlt = seoOverrides?.ogImageAlt || defaultSocialAlt;
    const twitterImage = seoOverrides?.twitterImage || ogImage;
    const twitterImageAlt = seoOverrides?.twitterImageAlt || ogImageAlt;

    document.title = mergedTitle;

    const upsertMeta = (attribute: 'name' | 'property', key: string, content?: string) => {
      const selector = `meta[${attribute}="${key}"]`;
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!content) {
        if (element && element.parentElement) {
          element.parentElement.removeChild(element);
        }
        return;
      }
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const upsertLink = (rel: string, attrs: Record<string, string | undefined>) => {
      if (!attrs.href) return;
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
    const canonicalUrl = seoOverrides?.canonicalUrl || `${siteOrigin}${currentPath}`;

    upsertMeta('name', 'description', mergedDescription);
    upsertMeta('name', 'keywords', mergedKeywords);
    upsertMeta('property', 'og:title', mergedOgTitle);
    upsertMeta('property', 'og:description', mergedOgDescription);
    upsertMeta('property', 'og:locale', mergedOgLocale);
    upsertMeta('property', 'og:type', mergedOgType);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', ogImageAlt);
    upsertMeta('property', 'og:site_name', 'Lumiso');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', mergedTwitterTitle);
    upsertMeta('name', 'twitter:description', mergedTwitterDescription);
    upsertMeta('name', 'twitter:url', canonicalUrl);
    upsertMeta('name', 'twitter:image', twitterImage);
    upsertMeta('name', 'twitter:image:alt', twitterImageAlt);

    upsertLink('canonical', { href: canonicalUrl });
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const localizedUrl = seoOverrides?.canonicalUrl
        ? lang === 'en'
          ? seoOverrides.canonicalUrl
          : `${seoOverrides.canonicalUrl}?lang=${lang}`
        : lang === 'en'
        ? canonicalUrl
        : `${siteOrigin}${window.location.pathname}?lang=${lang}`;
      upsertLink('alternate', { href: localizedUrl, hreflang: lang });
    });
    upsertLink('alternate', { href: canonicalUrl, hreflang: 'x-default' });

    const faqItems = (translations[language]['faq.items'] as Array<{ question: string; answer: string }>) || [];
    const faqTitle = `${translations[language]['faq.title.regular'] ?? ''} ${translations[language]['faq.title.bold'] ?? ''}`.trim();
    const structuredDataGraph = [
      {
        '@type': 'Organization',
        name: 'Lumiso',
        url: SITE_URL,
        description: mergedDescription,
      },
      {
        '@type': 'Product',
        name: mergedTitle,
        description: mergedDescription,
        url: canonicalUrl,
        brand: {
          '@type': 'Organization',
          name: 'Lumiso',
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
        name: faqTitle || mergedTitle,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      ...(seoOverrides?.structuredDataGraph ?? []),
    ].filter(Boolean);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': structuredDataGraph,
    };
    upsertJsonLd('lumiso-structured-data', structuredData);

    if (seoOverrides?.extraMeta?.length) {
      seoOverrides.extraMeta.forEach(({ attribute, key, content }) => {
        upsertMeta(attribute, key, content);
      });
    }
  }, [language, seoOverrides]);

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
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, t, setSeoOverrides }}>
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
