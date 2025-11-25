
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionHeader from './ui/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';

type IllustrationSources = {
  desktop: { webp: string; fallback: string };
  mobile: { webp: string; fallback: string };
};

const FeatureIllustrationImage: React.FC<{
  alt: string;
  sources: IllustrationSources;
  onEnlarge?: () => void;
  isDesktop: boolean;
}> = ({ alt, sources, onEnlarge, isDesktop }) => (
  <button
    type="button"
    className={`block w-full text-left ${isDesktop ? 'cursor-zoom-in' : 'cursor-default'}`}
    onClick={isDesktop ? onEnlarge : undefined}
    aria-label={isDesktop ? 'Enlarge screenshot' : undefined}
  >
    <picture className="block -mx-3 sm:-mx-4 lg:-mx-5">
      <source srcSet={sources.mobile.webp} media="(max-width: 639px)" type="image/webp" />
      <source srcSet={sources.desktop.webp} media="(min-width: 640px)" type="image/webp" />
      <source srcSet={sources.mobile.fallback} media="(max-width: 639px)" />
      <img
        src={sources.desktop.fallback}
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
  const [lightboxImage, setLightboxImage] = useState<IllustrationSources | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleDesktopChange = () => setIsDesktop(desktopQuery.matches);
    handleDesktopChange();
    desktopQuery.addEventListener('change', handleDesktopChange);
    return () => desktopQuery.removeEventListener('change', handleDesktopChange);
  }, []);

  const featureImages = [
    {
      alt: t('keyFeatures.card1.imageAlt'),
      sources: {
        desktop: { webp: '/temel/card1-desktop.webp', fallback: '/temel/Card1%20-%20Desktop.png' },
        mobile: { webp: '/temel/card1-mobile.webp', fallback: '/temel/Card1%20-%20Mobile.png' },
      },
    },
    {
      alt: t('keyFeatures.card2.imageAlt'),
      sources: {
        desktop: { webp: '/temel/card2-desktop.webp', fallback: '/temel/Card2%20-%20Desktop.png' },
        mobile: { webp: '/temel/card2-mobile.webp', fallback: '/temel/Card2%20-%20Mobile.png' },
      },
    },
    {
      alt: t('keyFeatures.card3.imageAlt'),
      sources: {
        desktop: { webp: '/temel/card3-desktop.webp', fallback: '/temel/Card3%20-%20Desktop.png' },
        mobile: { webp: '/temel/card3-mobile.webp', fallback: '/temel/Card3%20-%20Mobile.png' },
      },
    },
  ];

  const openLightbox = (image: { alt: string; sources: IllustrationSources }) => {
    if (!isDesktop) return;
    setLightboxAlt(image.alt);
    setLightboxImage(image.sources);
  };

  const closeLightbox = () => setLightboxImage(null);

  const features = [
    {
      titleKey: 'keyFeatures.card1.title',
      descriptionKey: 'keyFeatures.card1.description',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800/30',
      spotlightColor: 'rgba(245, 158, 11, 0.25)',
      illustration: (
        <FeatureIllustrationImage
          alt={featureImages[0].alt}
          sources={featureImages[0].sources}
          onEnlarge={() => openLightbox(featureImages[0])}
          isDesktop={isDesktop}
        />
      ),
    },
    {
      titleKey: 'keyFeatures.card2.title',
      descriptionKey: 'keyFeatures.card2.description',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      borderColor: 'border-sky-200 dark:border-sky-800/30',
      spotlightColor: 'rgba(14, 165, 233, 0.25)',
      illustration: (
        <FeatureIllustrationImage
          alt={featureImages[1].alt}
          sources={featureImages[1].sources}
          onEnlarge={() => openLightbox(featureImages[1])}
          isDesktop={isDesktop}
        />
      ),
    },
    {
      titleKey: 'keyFeatures.card3.title',
      descriptionKey: 'keyFeatures.card3.description',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      borderColor: 'border-violet-200 dark:border-violet-800/30',
      spotlightColor: 'rgba(167, 139, 250, 0.25)',
      illustration: (
        <FeatureIllustrationImage
          alt={featureImages[2].alt}
          sources={featureImages[2].sources}
          onEnlarge={() => openLightbox(featureImages[2])}
          isDesktop={isDesktop}
        />
      ),
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
              className={`flex flex-col p-7 sm:p-8 pb-0 sm:pb-0 shadow-lg border ${feature.bgColor} ${feature.borderColor} ${cardAnimationClasses(cardVisibility[index], cardDelays[index])}`}
            >
              <div className="text-3xl font-bold text-slate-300 dark:text-slate-600">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t(feature.titleKey)}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{t(feature.descriptionKey)}</p>
              <div className="mt-auto w-full">
                <div className="mt-6 md:mt-7">{feature.illustration}</div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
          isDesktop && lightboxImage ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Screenshot full view"
        aria-hidden={!(isDesktop && lightboxImage)}
        onClick={closeLightbox}
      >
        <div
          className={`relative w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl transition-all duration-200 ${
            lightboxImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
            {lightboxImage && (
              <picture className="block">
                <source srcSet={lightboxImage.desktop.webp} type="image/webp" />
                <img
                  src={lightboxImage.desktop.fallback}
                  alt={lightboxAlt}
                  className="w-full h-auto"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
