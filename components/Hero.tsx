
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import SectionBadge from './ui/SectionBadge';
import CTAButton from './ui/CTAButton';
import BrowserMockup from './ui/BrowserMockup';

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DotsHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);


const ProjectDashboardMockup: React.FC = () => {
    return (
        <BrowserMockup className="max-w-7xl mx-auto">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Thompson Wedding</h2>
                    <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full">In Progress</span>
                </div>
                {/* Dashboard Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Timeline Widget */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Project Timeline</h3>
                            <ul className="mt-3 space-y-3">
                                <li className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Booking Confirmed</span>
                                    <span className="ml-auto text-slate-400 text-xs">June 1st</span>
                                </li>
                                <li className="flex items-center">
                                    <ClockIcon className="w-5 h-5 text-amber-500 mr-3" />
                                    <span className="text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm">Editing Photos</span>
                                    <span className="ml-auto text-slate-400 text-xs">In Progress</span>
                                </li>
                                <li className="flex items-center opacity-50">
                                    <ClockIcon className="w-5 h-5 text-slate-400 mr-3" />
                                    <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Gallery Delivery</span>
                                    <span className="ml-auto text-slate-400 text-xs">Est. July 15th</span>
                                </li>
                            </ul>
                        </div>
                        {/* Recent Files Widget */}
                        <div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">Recent Files</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-md bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542042161-d10f76236248?w=200')"}}></div>
                                <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-md bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1519225345934-2b99b278d488?w=200')"}}></div>
                                <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-md bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1515934751635-481eff0422d7?w=200')"}}></div>
                                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                                    <DotsHorizontalIcon className="w-6 h-6 text-slate-400"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Client Details</h3>
                        <div className="flex items-center mt-3">
                             <img
                                src="https://i.pravatar.cc/150?u=alexthompson"
                                alt="Alex Thompson"
                                className="w-10 h-10 rounded-full"
                                loading="lazy"
                                decoding="async"
                              />
                             <div className="ml-3">
                                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Alex Thompson</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">alex.t@example.com</p>
                             </div>
                        </div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mt-4">Notes</h3>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                            Client requested extra edits for black & white photos. Follow up on album design choices.
                        </p>
                    </div>
                </div>
            </div>
        </BrowserMockup>
    );
};

const backgroundImages = [
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475274226786-e636f48a5645?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623783356340-95375aac85ce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594296459195-8b2f3fbf1c86?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1699401984773-f6bf9a20b774?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop'
];


const Hero: React.FC = () => {
  const { t } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const startTimer = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveIndex(0);
      return;
    }
    startTimer();
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [prefersReducedMotion, startTimer]);

  // Slot machine animation logic
  const animatedWords = t('hero.animatedWords') as unknown as string[];
  const [wordIndex, setWordIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);
  const wordSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % animatedWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [animatedWords.length, prefersReducedMotion]);

  // This effect calculates the width of the animated word container.
  // It runs when the word changes, and it also accounts for font-loading and window resizing
  // to prevent the text from being clipped.
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const calculateAndSetWidth = () => {
      const currentWordRef = wordSpanRefs.current[wordIndex];
      if (currentWordRef) {
        const newWidth = currentWordRef.offsetWidth;
        // Set width only if it's a valid positive number to avoid flicker on re-renders.
        if (newWidth > 0) {
          setContainerWidth(newWidth);
        }
      }
    };

    // Calculate width immediately on render.
    calculateAndSetWidth();
    
    // Recalculate after fonts load to get the correct size with custom fonts applied.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts) {
      let isActive = true;
      fonts.ready.then(() => {
        if (isActive) {
          calculateAndSetWidth();
        }
      });
      // Add resize listener to handle responsive font sizes.
      window.addEventListener('resize', calculateAndSetWidth);
      return () => {
        isActive = false;
        window.removeEventListener('resize', calculateAndSetWidth);
      };
    }

    window.addEventListener('resize', calculateAndSetWidth);
    return () => window.removeEventListener('resize', calculateAndSetWidth);
  }, [wordIndex, animatedWords]);

  const titleEnd = t('hero.title.end');
  const lastCommaIndex = titleEnd.lastIndexOf(',');
  const mainPart = lastCommaIndex !== -1 ? titleEnd.substring(0, lastCommaIndex) : titleEnd;
  const commaPart = lastCommaIndex !== -1 ? titleEnd.substring(lastCommaIndex) : '';

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden pt-16 min-h-screen flex flex-col">
       <div className="absolute -left-[9999px] -top-[9999px] text-4xl sm:text-5xl md:text-6xl font-bold" aria-hidden="true">
        {animatedWords.map((word, index) => (
          // Fix: Ensure the ref callback function has a void return type by wrapping the assignment in curly braces.
          <span key={index} ref={el => { wordSpanRefs.current[index] = el; }}>
            {word}
          </span>
        ))}
      </div>
      <div className="absolute inset-0">
        {backgroundImages.map((src, index) => (
            <div key={src} className={`absolute inset-0 transition-opacity duration-3000 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}>
                <img 
                    src={src}
                    alt={t('hero.imageAlt')}
                    className="w-full h-full object-cover opacity-60 dark:opacity-50"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchpriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                />
            </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col flex-grow">
        <div className="text-center pt-12 sm:pt-20">
            <div className="max-w-4xl mx-auto">
                <div className="inline-block mb-4 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                    <SectionBadge variant="glass">{t('hero.tag')}</SectionBadge>
                </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight animate-slide-in-fade" style={{ animationDelay: '300ms' }}>
                <span className="block sm:inline">{t('hero.title.start')}</span>
                <span className="block sm:inline-block">
                  <span
                    className="inline-block relative overflow-hidden align-text-bottom leading-tight top-0.5"
                    style={{
                      height: '1.25em', // Corresponds to leading-tight
                      width: containerWidth ? `${containerWidth}px` : 'auto',
                      transition: 'width 0.4s ease-in-out, opacity 0.2s linear',
                      opacity: containerWidth ? 1 : 0,
                    }}
                  >
                    <span
                      className="absolute left-0 w-full"
                      style={{
                        transform: `translateY(-${wordIndex * 1.25}em)`,
                        transition: 'transform 1s cubic-bezier(0.76, 0, 0.24, 1)',
                      }}
                    >
                      {animatedWords.map((word) => (
                        <span
                          key={word}
                          className="block text-center shimmer-gradient animate-shimmer leading-tight"
                        >
                          {word}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
                <span className="block sm:inline">{mainPart}</span>
                <span className="hidden sm:inline">{commaPart}</span>
                <span className="block">{t('hero.title.line2')}</span>
              </h1>
              <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 animate-slide-in-fade" style={{ animationDelay: '500ms' }}>
                {t('hero.subtitle')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-fade" style={{ animationDelay: '700ms' }}>
                  <CTAButton href="#pricing" variant="primary" fullWidth className="sm:w-auto">
                    {t('hero.cta.primary')}
                  </CTAButton>
                  <CTAButton
                    href="https://calendly.com/photoflow/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    fullWidth
                    className="sm:w-auto"
                  >
                    {t('hero.cta.secondary')}
                  </CTAButton>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-base font-medium text-slate-200 animate-slide-in-fade" style={{ animationDelay: '800ms' }}>
                <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-brand-teal-400 flex-shrink-0" />
                    <p>{t('hero.cta.subtext.line1')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-brand-teal-400 flex-shrink-0" />
                    <p>{t('hero.cta.subtext.line2')}</p>
                </div>
              </div>
            </div>
        </div>
        
        <div className="mt-20 animate-slide-in-fade" style={{ animationDelay: '900ms' }}>
          <ProjectDashboardMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
