import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../translations';
import { SITE_URL, seoContent } from '../seo.config';

type Language = 'en' | 'tr';
type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Detect browser language
    const userLang = navigator.language.split('-')[0];
    if (userLang === 'tr') {
      setLanguage('tr');
    }

    // Check for saved theme in localStorage
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
    const supportedLanguages: Language[] = ['en', 'tr'];
    supportedLanguages.forEach((lang) => {
      const localizedUrl =
        lang === 'en'
          ? canonicalUrl
          : `${SITE_URL}${window.location.pathname}?lang=${lang}`;
      upsertLink('alternate', { href: localizedUrl, hreflang: lang });
    });
    upsertLink('alternate', { href: canonicalUrl, hreflang: 'x-default' });
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
