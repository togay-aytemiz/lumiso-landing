import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
const BrowserMockup: React.FC<{ className?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ className = '', style, children }) => (
  <div
    className={`relative rounded-[28px] border border-white/30 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 shadow-2xl shadow-black/20 overflow-hidden backdrop-blur-xl ${className}`}
    style={style}
  >
    <div className="flex items-center gap-1 px-5 py-4 border-b border-white/40 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60">
      <span className="w-3 h-3 rounded-full bg-red-400"></span>
      <span className="w-3 h-3 rounded-full bg-amber-300"></span>
      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
    </div>
    {children}
  </div>
);

const ScreenshotPlaceholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col gap-6 items-center justify-center w-full h-full text-center px-10 py-12 text-slate-500 dark:text-slate-300">
    <p className="text-xl font-semibold">{label}</p>
    <p className="text-base text-slate-500/80 dark:text-slate-300/80 max-w-md">
      Replace this placeholder with a high-resolution screenshot to show the product in action.
    </p>
    <div className="rounded-xl border border-dashed border-slate-400/60 dark:border-slate-600/60 px-6 py-3 text-sm">
      Suggested size: 1600×1000 PNG
    </div>
  </div>
);
import SectionHeader from './ui/SectionHeader';

const Features: React.FC = () => {
  const { t } = useAppContext();

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-12 lg:gap-y-10 items-center">
            
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
            <div ref={reportsImageRef} className={`relative lg:col-start-2 lg:row-start-1 lg:row-span-2 ${animationClasses(isReportsImageVisible, 'delay-200')}`}>
              <BrowserMockup style={{ minHeight: '420px' }}>
                <ScreenshotPlaceholder label="Screenshot slot: Analytics / Reports" />
              </BrowserMockup>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-12 lg:gap-y-10 items-center">
            
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
            <div ref={alertsImageRef} className={`relative lg:col-start-1 lg:row-start-1 lg:row-span-2 ${animationClasses(isAlertsImageVisible, 'delay-200')}`}>
              <BrowserMockup style={{ minHeight: '400px' }}>
                <ScreenshotPlaceholder label="Screenshot slot: Workflow / Alerts" />
              </BrowserMockup>
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
    </div>
  );
};

export default Features;
