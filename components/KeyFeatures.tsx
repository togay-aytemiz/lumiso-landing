
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionHeader from './ui/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';

const KeyFeatures: React.FC = () => {
  const { t } = useAppContext();

  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card1Ref, card2Ref, card3Ref];

  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.2 });
  const cardVisibility = [
    useIntersectionObserver(card1Ref, { threshold: 0.2 }),
    useIntersectionObserver(card2Ref, { threshold: 0.2 }),
    useIntersectionObserver(card3Ref, { threshold: 0.2 })
  ];
  
  const cardDelays = ['delay-0', 'delay-150', 'delay-300'];

  const features = [
    {
      titleKey: 'keyFeatures.card1.title',
      descriptionKey: 'keyFeatures.card1.description',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800/30',
      spotlightColor: 'rgba(245, 158, 11, 0.25)',
      illustration: (
        <div className="mt-8 bg-white/50 dark:bg-black/20 p-4 rounded-lg shadow-inner space-y-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
            <div className="ml-3 w-full">
              <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-2 w-32 mt-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-2 w-4/5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      )
    },
    {
      titleKey: 'keyFeatures.card2.title',
      descriptionKey: 'keyFeatures.card2.description',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      borderColor: 'border-sky-200 dark:border-sky-800/30',
      spotlightColor: 'rgba(14, 165, 233, 0.25)',
      illustration: (
         <div className="mt-8 bg-white/50 dark:bg-black/20 p-4 rounded-lg shadow-inner flex items-center justify-around">
            <div className="w-16 h-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
             <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            <div className="w-16 h-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
        </div>
      )
    },
    {
      titleKey: 'keyFeatures.card3.title',
      descriptionKey: 'keyFeatures.card3.description',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      borderColor: 'border-violet-200 dark:border-violet-800/30',
      spotlightColor: 'rgba(167, 139, 250, 0.25)',
      illustration: (
        <div className="mt-8 bg-white/50 dark:bg-black/20 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="aspect-square rounded bg-slate-200 dark:bg-slate-700 ring-2 ring-brand-teal-500"></div>
                <div className="aspect-square rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="aspect-square rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="aspect-square rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="aspect-square rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
        </div>
      )
    }
  ];

  const headerAnimationClasses = `transition-all duration-700 ease-out ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
  
  const cardAnimationClasses = (isVisible: boolean, delay: string) => `
    transition-all duration-700 ease-out ${delay}
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
  `;

  return (
    <section id="key-features" className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`max-w-3xl mx-auto ${headerAnimationClasses}`}>
          <SectionHeader
            align="center"
            badgeText={t('keyFeatures.tag')}
            title={t('keyFeatures.title')}
            subtitle={t('keyFeatures.subtitle')}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <SpotlightCard
              key={index}
              ref={cardRefs[index]}
              spotlightColor={feature.spotlightColor}
              className={`p-8 shadow-lg border ${feature.bgColor} ${feature.borderColor} ${cardAnimationClasses(cardVisibility[index], cardDelays[index])}`}
            >
              <div className="text-3xl font-bold text-slate-300 dark:text-slate-600">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t(feature.titleKey)}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{t(feature.descriptionKey)}</p>
              {feature.illustration}
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
