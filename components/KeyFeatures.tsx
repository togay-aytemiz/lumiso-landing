
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionHeader from './ui/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';

const FeatureIllustrationPlaceholder: React.FC<{ label: string; note?: string }> = ({ label, note }) => (
  <div className="border border-dashed border-slate-300/80 dark:border-slate-600/80 rounded-2xl bg-white/60 dark:bg-black/30 px-6 py-8 text-center text-slate-500 dark:text-slate-300">
    <p className="text-lg font-semibold">{label}</p>
    {note && <p className="mt-2 text-sm text-slate-500/80 dark:text-slate-300/80">{note}</p>}
    <div className="mt-6 text-xs uppercase tracking-wide text-slate-400">Drop UI screenshot here</div>
  </div>
);

const FeatureIllustrationImage: React.FC<{ alt: string; onEnlarge?: () => void; isDesktop: boolean }> = ({
  alt,
  onEnlarge,
  isDesktop,
}) => (
  <button
    type="button"
    className={`block w-full text-left ${isDesktop ? 'cursor-zoom-in' : 'cursor-default'}`}
    onClick={isDesktop ? onEnlarge : undefined}
    aria-label={isDesktop ? 'Enlarge screenshot' : undefined}
  >
    <picture className="block">
      <source srcSet="/temel/kisiler-mobile.webp" media="(max-width: 639px)" type="image/webp" />
      <source srcSet="/temel/kisiler-desktop-2.webp" media="(min-width: 640px)" type="image/webp" />
      <source srcSet="/temel/kisiler-mobile.png" media="(max-width: 639px)" />
      <img
        src="/temel/kisiler-desktop-2.png"
        alt={alt}
        className="w-full h-auto"
        loading="lazy"
        decoding="async"
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 480px"
      />
    </picture>
  </button>
);

const KeyFeatures: React.FC = () => {
  const { t } = useAppContext();
  const [isDesktop, setIsDesktop] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card1Ref, card2Ref, card3Ref];
  const [lightboxAlt, setLightboxAlt] = useState("");

  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.2 });
  const cardVisibility = [
    useIntersectionObserver(card1Ref, { threshold: 0.2 }),
    useIntersectionObserver(card2Ref, { threshold: 0.2 }),
    useIntersectionObserver(card3Ref, { threshold: 0.2 })
  ];
  
  const cardDelays = ['delay-0', 'delay-150', 'delay-300'];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleDesktopChange = () => setIsDesktop(desktopQuery.matches);
    handleDesktopChange();
    desktopQuery.addEventListener('change', handleDesktopChange);
    return () => desktopQuery.removeEventListener('change', handleDesktopChange);
  }, []);

  const openLightbox = () => {
    if (!isDesktop) return;
    setLightboxAlt(t('keyFeatures.card1.imageAlt'));
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const features = [
    {
      titleKey: 'keyFeatures.card1.title',
      descriptionKey: 'keyFeatures.card1.description',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800/30',
      spotlightColor: 'rgba(245, 158, 11, 0.25)',
      illustration: <FeatureIllustrationImage alt={t('keyFeatures.card1.imageAlt')} onEnlarge={openLightbox} isDesktop={isDesktop} />
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
              className={`flex flex-col p-8 shadow-lg border ${feature.bgColor} ${feature.borderColor} ${cardAnimationClasses(cardVisibility[index], cardDelays[index])}`}
            >
              <div className="text-3xl font-bold text-slate-300 dark:text-slate-600">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t(feature.titleKey)}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{t(feature.descriptionKey)}</p>
              <div className="mt-auto w-full">
                <div className="mt-8">{feature.illustration}</div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
          isDesktop && lightboxOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Screenshot full view"
        aria-hidden={!(isDesktop && lightboxOpen)}
        onClick={closeLightbox}
      >
        <div
          className={`relative w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl transition-all duration-200 ${
            lightboxOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full shadow-md px-3 py-1 text-sm font-semibold hover:bg-slate-100"
            onClick={closeLightbox}
          >
            {t('common.close')}
          </button>
          <div className="rounded-[22px] overflow-hidden bg-white shadow-2xl">
            <picture className="block">
              <source srcSet="/temel/kisiler-desktop-2.webp" type="image/webp" />
              <img
                src="/temel/kisiler-desktop-2.png"
                alt={lightboxAlt}
                className="w-full h-auto"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
