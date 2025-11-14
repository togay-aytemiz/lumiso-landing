import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import BrowserMockup from './ui/BrowserMockup';
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
              <BrowserMockup className="animate-float">
                  <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop"
                      alt="PhotoFlow Analytics Dashboard"
                      className="w-full h-full object-cover rounded-b-xl"
                      loading="lazy"
                      decoding="async"
                  />
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
              <BrowserMockup className="animate-float" style={{ animationDelay: '-3s' }}>
                  <img
                      src="https://images.unsplash.com/photo-1634733350926-42d7654a5a74?q=80&w=1600&auto=format&fit=crop"
                      alt="PhotoFlow Alerts and Workflow"
                      className="w-full h-full object-cover rounded-b-xl"
                      loading="lazy"
                      decoding="async"
                  />
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
