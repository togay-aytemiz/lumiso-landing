
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionHeader from './ui/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';

const FeatureIllustrationPlaceholder: React.FC<{ label: string; note?: string }> = ({ label, note }) => (
  <div className="mt-8 border border-dashed border-slate-300/80 dark:border-slate-600/80 rounded-2xl bg-white/60 dark:bg-black/30 px-6 py-8 text-center text-slate-500 dark:text-slate-300">
    <p className="text-lg font-semibold">{label}</p>
    {note && <p className="mt-2 text-sm text-slate-500/80 dark:text-slate-300/80">{note}</p>}
    <div className="mt-6 text-xs uppercase tracking-wide text-slate-400">Drop UI screenshot here</div>
  </div>
);

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
      illustration: <FeatureIllustrationPlaceholder label="Screenshot slot: Contact timeline" note="Show the full client card with notes, invoices, reminders." />
    },
    {
      titleKey: 'keyFeatures.card2.title',
      descriptionKey: 'keyFeatures.card2.description',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      borderColor: 'border-sky-200 dark:border-sky-800/30',
      spotlightColor: 'rgba(14, 165, 233, 0.25)',
      illustration: <FeatureIllustrationPlaceholder label="Screenshot slot: Calendar + reminders" note="Highlight the daily digest or calendar UI here." />
    },
    {
      titleKey: 'keyFeatures.card3.title',
      descriptionKey: 'keyFeatures.card3.description',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      borderColor: 'border-violet-200 dark:border-violet-800/30',
      spotlightColor: 'rgba(167, 139, 250, 0.25)',
      illustration: <FeatureIllustrationPlaceholder label="Screenshot slot: Gallery / session grid" note="Use a grid of sessions or albums to illustrate the experience." />
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
