

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

const ChevronDownIcon: React.FC = () => (
  <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const Footer: React.FC = () => {
  const { t, theme, toggleTheme, language, setLanguage } = useAppContext();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    tr: { name: 'Turkish', flag: '🇹🇷' }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
            setIsLangMenuOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const footerLinks = {
    product: [
      { name: t('footer.features'), href: '#features' },
      { name: t('footer.pricing'), href: '#pricing' },
      { name: t('footer.aiFeatures'), href: '#ai-features' },
      { name: t('footer.updates'), href: '#' },
    ],
    company: [
      { name: t('footer.about'), href: '#' },
      { name: t('footer.blog'), href: '#' },
      { name: t('footer.careers'), href: '#' },
      { name: t('footer.contact'), href: '#' },
    ],
    legal: [
      { name: t('footer.privacy'), href: '#' },
      { name: t('footer.terms'), href: '#' },
    ],
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#" className="text-2xl font-bold text-slate-900 dark:text-white">
              Photo<span className="text-brand-teal-500 dark:text-brand-teal-400">Flow</span>
            </a>
            <p className="mt-4 text-slate-500 dark:text-slate-400">{t('footer.tagline')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('footer.product')}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}><a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 dark:hover:text-brand-teal-400">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}><a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 dark:hover:text-brand-teal-400">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('footer.legal')}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}><a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-brand-teal-500 dark:hover:text-brand-teal-400">{link.name}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-200/80 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('footer.copyright', { year: new Date().getFullYear().toString() })}</p>
          <div className="flex items-center space-x-4">
              <div ref={langMenuRef} className="relative">
              <button 
                  type="button" 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                  className="inline-flex items-center justify-center w-full rounded-lg px-4 py-2 font-medium transition-colors duration-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              >
                  <span className="text-lg">{languages[language].flag}</span>
                  <span className="ml-2 text-sm">{languages[language].name}</span>
                  <ChevronDownIcon />
              </button>
              {isLangMenuOpen && (
                  <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-40 rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                          {Object.keys(languages).map(langCode => (
                              <a
                                  key={langCode}
                                  href="#"
                                  onClick={(e) => {
                                      e.preventDefault();
                                      setLanguage(langCode as 'en' | 'tr');
                                      setIsLangMenuOpen(false);
                                  }}
                                  className={`flex items-center px-4 py-2 text-sm ${language === langCode ? 'font-semibold text-brand-teal-600 dark:text-brand-teal-400' : 'text-slate-700 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-700`}
                                  role="menuitem"
                              >
                                  <span className="text-lg">{languages[langCode as 'en' | 'tr'].flag}</span>
                                  <span className="ml-3">{languages[langCode as 'en' | 'tr'].name}</span>
                              </a>
                          ))}
                      </div>
                  </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 focus:outline-none transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;