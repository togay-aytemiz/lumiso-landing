
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { XCircleIcon } from './icons/XCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArrowLongRightIcon } from './icons/ArrowLongRightIcon';

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
        <div ref={headerRef} className={`max-w-3xl mx-auto text-center ${animationClasses(isHeaderVisible)}`}>
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
              {t('whyPhotoFlow.tag')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {t('whyPhotoFlow.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('whyPhotoFlow.subtitle')}
          </p>
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
                <a
                    href="#"
                    className="inline-block bg-gradient-to-r from-brand-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-brand-teal-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-teal-500/40"
                >
                    {t('cta.button')}
                </a>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {t('whyPhotoFlow.cta.subtext')}
            </p>
        </div>

      </div>
    </section>
  );
};

export default WhyPhotoFlow;
