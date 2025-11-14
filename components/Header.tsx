
import React, { useState, useEffect, Fragment } from 'react';
import { useAppContext } from '../contexts/AppContext';

const LIGHT_LOGO_PLACEHOLDER = '/logo-light.svg';
const DARK_LOGO_PLACEHOLDER = '/logo-dark.svg';
const LOGO_BASE_WIDTH = 71;
const LOGO_BASE_HEIGHT = 22;
const LOGO_DISPLAY_HEIGHT = 32;
const LOGO_DISPLAY_WIDTH = Math.round((LOGO_BASE_WIDTH / LOGO_BASE_HEIGHT) * LOGO_DISPLAY_HEIGHT);

const Logo: React.FC<{ className?: string; forceTheme?: 'light' | 'dark' }> = ({ className = '', forceTheme }) => {
  const lightClasses = forceTheme
    ? forceTheme === 'light'
      ? 'block'
      : 'hidden'
    : 'block dark:hidden';
  const darkClasses = forceTheme
    ? forceTheme === 'dark'
      ? 'block'
      : 'hidden'
    : 'hidden dark:block';

  return (
    <div
      className={`relative flex items-center ${className}`}
      style={{ width: LOGO_DISPLAY_WIDTH, height: LOGO_DISPLAY_HEIGHT }}
    >
      <img
        src={LIGHT_LOGO_PLACEHOLDER}
        alt="PhotoFlow logo for light mode"
        width={LOGO_BASE_WIDTH}
        height={LOGO_BASE_HEIGHT}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${lightClasses}`}
      />
      <img
        src={DARK_LOGO_PLACEHOLDER}
        alt="PhotoFlow logo for dark mode"
        width={LOGO_BASE_WIDTH}
        height={LOGO_BASE_HEIGHT}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${darkClasses}`}
      />
    </div>
  );
};

const Header: React.FC = () => {
  const { t } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t('header.features'), href: '#features' },
    { name: t('header.results'), href: '#results' },
    { name: t('header.pricing'), href: '#pricing' },
    { name: t('header.testimonials'), href: '#testimonials' },
    { name: t('header.contact'), href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    const targetElement = document.querySelector(href);
    
    if (targetElement) {
      const headerOffset = 64; // Corresponds to h-16
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
     if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const headerClasses = `
    sticky top-0 z-40 border-b transition-all duration-500 ease-out
    ${isScrolled
      ? 'bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm'
      : 'bg-transparent border-transparent'
    }
  `;

  return (
    <Fragment>
      <header className={headerClasses}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-10">
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex-shrink-0 inline-flex cursor-pointer"
              aria-label="Scroll to top"
            >
              <Logo
                className="transition-opacity duration-300"
                forceTheme={isScrolled ? undefined : 'dark'}
              />
            </a>
            <nav className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => (
                  <a key={link.name} href={link.href} onClick={handleNavClick} className={`font-medium ${isScrolled ? 'text-slate-700 dark:text-slate-300' : 'text-white'} hover:text-brand-teal-500 dark:hover:text-brand-teal-400 transition-colors duration-200 cursor-pointer`}>
                    {link.name}
                  </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
                <a href="#" className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${isScrolled ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-white'}`}>{t('header.login')}</a>
                <a href="#" className="bg-brand-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-teal-600 dark:bg-brand-teal-500 dark:hover:bg-brand-teal-400 transition-colors duration-200 shadow-lg shadow-brand-teal-500/30">
                  {t('header.signup')}
                </a>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal-500 transition-colors ${
                  isScrolled ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800' : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        role="dialog"
        aria-modal="true"
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div 
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
        
        <div 
          className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-slate-900 dark:bg-slate-950 shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
           <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-slate-800">
              <a
                href="/"
                onClick={handleLogoClick}
                className="inline-flex cursor-pointer"
                aria-label="Scroll to top"
              >
                <Logo forceTheme="dark" />
              </a>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal-500"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-grow px-4 py-8">
              <ul className="flex flex-col items-center justify-center h-full space-y-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={handleNavClick}
                      className="text-2xl font-semibold text-slate-300 hover:text-brand-teal-400 transition-all duration-300 hover:tracking-wider"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 sm:p-6 border-t border-slate-800">
              <div className="flex flex-col space-y-4">
                <a href="#" className="w-full text-center py-3 px-4 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 font-medium transition-colors duration-200">{t('header.login')}</a>
                <a href="#" className="w-full text-center py-3 px-4 rounded-lg bg-brand-teal-500 text-white font-semibold hover:bg-brand-teal-600 dark:hover:bg-brand-teal-400 transition-colors duration-200">
                  {t('header.signup')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
