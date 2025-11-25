import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionHeader from './ui/SectionHeader';

const Features: React.FC = () => {
  const { t } = useAppContext();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReportsLightboxOpen, setIsReportsLightboxOpen] = useState(false);
  const [isAlertsLightboxOpen, setIsAlertsLightboxOpen] = useState(false);
  const reportsScreenshotSources = {
    desktop: { webp: '/gunluk-kontrol/gk-desktop.webp', fallback: '/gunluk-kontrol/gk-desktop.png' },
    mobile: { webp: '/gunluk-kontrol/gk-mobile.webp', fallback: '/gunluk-kontrol/gk-mobile.png' },
  };
  const alertsScreenshotSources = {
    desktop: { webp: '/planlama%20kolaylığı/pk-desktop.webp', fallback: '/planlama%20kolaylığı/pk-desktop.webp' },
    mobile: { webp: '/planlama%20kolaylığı/pk-mobile.webp', fallback: '/planlama%20kolaylığı/pk-mobile.webp' },
  };

  // Refs for animation
  const reportsTextRef = useRef<HTMLDivElement>(null);
  const reportsImageRef = useRef<HTMLDivElement>(null);
  const reportsDetailsRef = useRef<HTMLDivElement>(null);
  const alertsTextRef = useRef<HTMLDivElement>(null);
  const alertsImageRef = useRef<HTMLDivElement>(null);
  const alertsDetailsRef = useRef<HTMLDivElement>(null);

  // Observers
  const isReportsTextVisible = useIntersectionObserver(reportsTextRef, { threshold: 0.2 });
  const isReportsImageVisible = useIntersectionObserver(reportsImageRef, { threshold: 0.2 });
  const isReportsDetailsVisible = useIntersectionObserver(reportsDetailsRef, { threshold: 0.2 });
  const isAlertsTextVisible = useIntersectionObserver(alertsTextRef, { threshold: 0.2 });
  const isAlertsImageVisible = useIntersectionObserver(alertsImageRef, { threshold: 0.2 });
  const isAlertsDetailsVisible = useIntersectionObserver(alertsDetailsRef, { threshold: 0.2 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleDesktopChange = () => setIsDesktop(desktopQuery.matches);
    handleDesktopChange();
    desktopQuery.addEventListener('change', handleDesktopChange);
    return () => desktopQuery.removeEventListener('change', handleDesktopChange);
  }, []);

  // Animation classes helper
  const animationClasses = (isVisible: boolean, delay: string = 'delay-0') => `
    transition-all duration-700 ease-out ${delay}
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
  `;

  return (
    <div id="features">
      {/* Section 1: Reports - Text Left, Image Right */}
      <section className="py-20 sm:py-32 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12 lg:gap-y-10 items-center">
            
            {/* Intro Text */}
            <div ref={reportsTextRef} className={`lg:col-start-1 ${animationClasses(isReportsTextVisible)}`}>
              <SectionHeader
                badgeText={t('features.reports.tag')}
                title={t('features.reports.title')}
                subtitle={t('features.reports.subtitle')}
                align="left"
                className="text-center lg:text-left"
                subtitleClassName="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0"
              />
            </div>

            {/* Image */}
            <div
              ref={reportsImageRef}
              className={`relative lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:justify-self-end lg:max-w-[1200px] xl:max-w-[1360px] ${animationClasses(
                isReportsImageVisible,
                'delay-200'
              )}`}
            >
              <button
                type="button"
                className={`block w-full text-left ${isDesktop ? 'cursor-zoom-in' : 'cursor-default'}`}
                onClick={isDesktop ? () => setIsReportsLightboxOpen(true) : undefined}
                aria-label={isDesktop ? t('features.reports.imageAlt') : undefined}
              >
                <picture className="block w-full">
                  <source srcSet={reportsScreenshotSources.mobile.webp} media="(max-width: 1023px)" type="image/webp" />
                  <source srcSet={reportsScreenshotSources.desktop.webp} media="(min-width: 1024px)" type="image/webp" />
                  <source srcSet={reportsScreenshotSources.mobile.fallback} media="(max-width: 1023px)" />
                  <img
                    src={reportsScreenshotSources.desktop.fallback}
                    alt={t('features.reports.imageAlt')}
                    className="w-full h-auto"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 80vw, (max-width: 1535px) 68vw, 1100px"
                  />
                </picture>
              </button>
            </div>

            {/* Detailed Text */}
            <div ref={reportsDetailsRef} className={`text-center lg:text-left lg:col-start-1 ${animationClasses(isReportsDetailsVisible, 'delay-100')}`}>
                <div className="space-y-8 border-l-4 border-brand-teal-500/30 pl-8 max-w-xl mx-auto lg:mx-0">
                    <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('features.reports.feature1.title')}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{t('features.reports.feature1.description')}</p>
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('features.reports.feature2.title')}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{t('features.reports.feature2.description')}</p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: Alerts / Workflow - Image Left, Text Right */}
      <section className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12 lg:gap-y-10 items-center">
            
            {/* Intro Text */}
            <div ref={alertsTextRef} className={`lg:col-start-2 ${animationClasses(isAlertsTextVisible)}`}>
              <SectionHeader
                badgeText={t('features.alerts.tag')}
                title={t('features.alerts.title')}
                subtitle={t('features.alerts.subtitle')}
                align="left"
                className="text-center lg:text-left"
                subtitleClassName="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0"
              />
            </div>
            
            {/* Image */}
            <div
              ref={alertsImageRef}
              className={`relative lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:max-w-[1200px] xl:max-w-[1360px] ${animationClasses(
                isAlertsImageVisible,
                'delay-200'
              )}`}
            >
              <button
                type="button"
                className={`block w-full text-left ${isDesktop ? 'cursor-zoom-in' : 'cursor-default'}`}
                onClick={isDesktop ? () => setIsAlertsLightboxOpen(true) : undefined}
                aria-label={isDesktop ? t('features.alerts.imageAlt') : undefined}
              >
                <picture className="block w-full">
                  <source srcSet={alertsScreenshotSources.mobile.webp} media="(max-width: 1023px)" type="image/webp" />
                  <source srcSet={alertsScreenshotSources.desktop.webp} media="(min-width: 1024px)" type="image/webp" />
                  <source srcSet={alertsScreenshotSources.mobile.fallback} media="(max-width: 1023px)" />
                  <img
                    src={alertsScreenshotSources.desktop.fallback}
                    alt={t('features.alerts.imageAlt')}
                    className="w-full h-auto"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 80vw, (max-width: 1535px) 68vw, 1100px"
                  />
                </picture>
              </button>
            </div>

            {/* Detailed Text */}
            <div ref={alertsDetailsRef} className={`text-center lg:text-left lg:col-start-2 ${animationClasses(isAlertsDetailsVisible, 'delay-100')}`}>
                <div className="space-y-8 border-l-4 border-brand-teal-500/30 pl-8 max-w-xl mx-auto lg:mx-0">
                    <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('features.alerts.feature1.title')}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{t('features.alerts.feature1.description')}</p>
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('features.alerts.feature2.title')}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{t('features.alerts.feature2.description')}</p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {isDesktop && (
        <div
          className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
            isReportsLightboxOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          role="dialog"
          aria-label={t('features.reports.imageAlt')}
          aria-hidden={!isReportsLightboxOpen}
          onClick={() => setIsReportsLightboxOpen(false)}
        >
          <div
            className={`relative w-full max-w-[95vw] lg:max-w-6xl xl:max-w-7xl transition-all duration-200 ${
              isReportsLightboxOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full shadow-md px-3 py-1 text-sm font-semibold hover:bg-slate-100"
              onClick={() => setIsReportsLightboxOpen(false)}
            >
              {t('common.close')}
            </button>
            <div className="shadow-2xl shadow-black/20 bg-transparent">
              <picture className="block w-full">
                <source srcSet={reportsScreenshotSources.desktop.webp} type="image/webp" />
                <img
                  src={reportsScreenshotSources.desktop.fallback}
                  alt={t('features.reports.imageAlt')}
                  className="w-full h-auto"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      )}
      {isDesktop && (
        <div
          className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
            isAlertsLightboxOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          role="dialog"
          aria-label={t('features.alerts.imageAlt')}
          aria-hidden={!isAlertsLightboxOpen}
          onClick={() => setIsAlertsLightboxOpen(false)}
        >
          <div
            className={`relative w-full max-w-[95vw] lg:max-w-6xl xl:max-w-7xl transition-all duration-200 ${
              isAlertsLightboxOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full shadow-md px-3 py-1 text-sm font-semibold hover:bg-slate-100"
              onClick={() => setIsAlertsLightboxOpen(false)}
            >
              {t('common.close')}
            </button>
            <div className="shadow-2xl shadow-black/20 bg-transparent">
              <picture className="block w-full">
                <source srcSet={alertsScreenshotSources.desktop.webp} type="image/webp" />
                <img
                  src={alertsScreenshotSources.desktop.fallback}
                  alt={t('features.alerts.imageAlt')}
                  className="w-full h-auto"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
