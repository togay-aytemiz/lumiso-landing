
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { XCircleIcon } from './icons/XCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArrowLongRightIcon } from './icons/ArrowLongRightIcon';
import CTAButton from './ui/CTAButton';
import SectionHeader from './ui/SectionHeader';

const WhyPhotoFlow: React.FC = () => {
  const { t } = useAppContext();
  const headerRef = useRef<HTMLDivElement>(null);
  const beforeCardRef = useRef<HTMLDivElement>(null);
  const afterCardRef = useRef<HTMLDivElement>(null);

  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.1 });
  const isBeforeCardVisible = useIntersectionObserver(beforeCardRef, { threshold: 0.2 });
  const isAfterCardVisible = useIntersectionObserver(afterCardRef, { threshold: 0.2 });

  const beforePoints = t('whyPhotoFlow.before.points') as unknown as { title: string, description: string }[];
  const afterPoints = t('whyPhotoFlow.after.points') as unknown as { title: string, description: string }[];

  const animationClasses = (isVisible: boolean, delay: string = 'delay-0') => `
    transition-all duration-700 ease-out ${delay}
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
  `;

  return (
    <section id="why-photoflow" className="py-20 sm:py-32 bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`max-w-3xl mx-auto ${animationClasses(isHeaderVisible)}`}>
          <SectionHeader
            align="center"
            badgeText={t('whyPhotoFlow.tag')}
            title={t('whyPhotoFlow.title')}
            subtitle={t('whyPhotoFlow.subtitle')}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-8 lg:gap-12 items-center">
          {/* Before Card */}
          <div ref={beforeCardRef} className={`bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/50 h-full ${animationClasses(isBeforeCardVisible, 'delay-100')}`}>
            <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">{t('whyPhotoFlow.before.title')}</h3>
            <ul className="mt-8 space-y-6">
              {beforePoints.map((point, index) => (
                <li key={index} className="flex">
                  <XCircleIcon className="w-6 h-6 text-rose-500/80 dark:text-rose-400/80 flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200">{point.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <ArrowLongRightIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </div>

          {/* After Card */}
          <div ref={afterCardRef} className={`bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-2xl border-2 border-brand-teal-500/50 dark:border-brand-teal-400/50 h-full ${animationClasses(isAfterCardVisible, 'delay-300')}`}>
            <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white">{t('whyPhotoFlow.after.title')}</h3>
            <ul className="mt-8 space-y-6">
              {afterPoints.map((point, index) => (
                <li key={index} className="flex">
                  <CheckCircleIcon className="w-6 h-6 text-brand-teal-500 dark:text-brand-teal-400 flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200">{point.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
                <CTAButton href="#" variant="gradient">
                    {t('cta.button')}
                </CTAButton>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {t('whyPhotoFlow.cta.subtext')}
            </p>
        </div>

      </div>
    </section>
  );
};

export default WhyPhotoFlow;
