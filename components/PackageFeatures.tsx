import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { PackageIcon } from './icons/PackageIcon';
import { ServiceIcon } from './icons/ServiceIcon';
import { SessionIcon } from './icons/SessionIcon';
import { ProposalIcon } from './icons/ProposalIcon';

const PackageFeatures: React.FC = () => {
    const { t } = useAppContext();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
    
    const sectionRef = useRef<HTMLDivElement>(null);
    const isSectionVisible = useIntersectionObserver(sectionRef, { threshold: 0.2, freezeOnceVisible: false });
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const intervalRef = useRef<number | null>(null);
    const interactionTimeoutRef = useRef<number | null>(null);

    const featureVisuals = [
        {
            desktop: '/modern-studyo-askisi/msa1%20-%20desktop.webp',
            mobile: '/modern-studyo-askisi/msa1%20-%20mobile.webp',
            altKey: 'packageFeatures.tab1.imageAlt',
        },
        {
            desktop: '/modern-studyo-askisi/msa2%20-%20desktop.webp',
            mobile: '/modern-studyo-askisi/msa2%20-%20mobile.webp',
            altKey: 'packageFeatures.tab2.imageAlt',
        },
        {
            desktop: '/modern-studyo-askisi/msa3%20-%20desktop.webp',
            mobile: '/modern-studyo-askisi/msa3%20-%20mobile.webp',
            altKey: 'packageFeatures.tab3.imageAlt',
        },
        {
            desktop: '/modern-studyo-askisi/msa4-desktop.webp',
            mobile: '/modern-studyo-askisi/msa4-mobile.webp',
            altKey: 'packageFeatures.tab4.imageAlt',
        },
    ];

    const FeatureVisual: React.FC<{
        sources: { desktop: string; mobile: string; altKey: string };
        onEnlarge?: () => void;
        isDesktop: boolean;
    }> = ({ sources, onEnlarge, isDesktop }) => (
        <button
            type="button"
            className={`block w-full text-left ${isDesktop ? 'cursor-zoom-in' : 'cursor-default'}`}
            onClick={isDesktop ? onEnlarge : undefined}
            aria-label={isDesktop ? t(sources.altKey) : undefined}
        >
            <picture className="block w-full">
                <source srcSet={sources.mobile} media="(max-width: 1023px)" type="image/webp" />
                <source srcSet={sources.desktop} media="(min-width: 1024px)" type="image/webp" />
                <img
                    src={sources.desktop}
                    alt={t(sources.altKey)}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1535px) 70vw, 960px"
                />
            </picture>
        </button>
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const handleDesktopChange = () => setIsDesktop(desktopQuery.matches);
        handleDesktopChange();
        desktopQuery.addEventListener('change', handleDesktopChange);
        return () => desktopQuery.removeEventListener('change', handleDesktopChange);
    }, []);

    const openLightbox = (sources: { desktop: string; altKey: string }) => {
        if (!isDesktop) return;
        setLightboxImage({ src: sources.desktop, alt: t(sources.altKey) });
    };

    const closeLightbox = () => setLightboxImage(null);

    const features = [
        { 
            titleKey: 'packageFeatures.tab1.title', 
            descriptionKey: 'packageFeatures.tab1.description', 
            icon: <PackageIcon />,
            visual: <FeatureVisual sources={featureVisuals[0]} onEnlarge={() => openLightbox(featureVisuals[0])} isDesktop={isDesktop} />
        },
        { 
            titleKey: 'packageFeatures.tab2.title', 
            descriptionKey: 'packageFeatures.tab2.description', 
            icon: <ServiceIcon />,
            visual: <FeatureVisual sources={featureVisuals[1]} onEnlarge={() => openLightbox(featureVisuals[1])} isDesktop={isDesktop} />
        },
        { 
            titleKey: 'packageFeatures.tab3.title', 
            descriptionKey: 'packageFeatures.tab3.description', 
            icon: <SessionIcon />,
            visual: <FeatureVisual sources={featureVisuals[2]} onEnlarge={() => openLightbox(featureVisuals[2])} isDesktop={isDesktop} />
        },
        { 
            titleKey: 'packageFeatures.tab4.title', 
            descriptionKey: 'packageFeatures.tab4.description', 
            icon: <ProposalIcon />,
            visual: <FeatureVisual sources={featureVisuals[3]} onEnlarge={() => openLightbox(featureVisuals[3])} isDesktop={isDesktop} />
        },
    ];

    useEffect(() => {
        const startInterval = () => {
            stopInterval(); // Ensure no duplicates
            intervalRef.current = window.setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
            }, 7500);
        };

        const stopInterval = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
        
        if (!isInteracting && isSectionVisible) {
            startInterval();
        } else {
            stopInterval();
        }

        return () => stopInterval();

    }, [isInteracting, isSectionVisible, features.length]);
    
    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
        };
    }, []);
    
    const handleTabClick = (index: number) => {
        setActiveIndex(index);
        setIsInteracting(true);

        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }

        // Resume autoplay after a delay of user inactivity
        interactionTimeoutRef.current = window.setTimeout(() => {
            setIsInteracting(false);
        }, 8000);
    };

    const handleDesktopMouseEnter = () => {
        setIsInteracting(true);
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
    };

    const handleDesktopMouseLeave = () => {
        setIsInteracting(false);
    };

    const animationClasses = (isVisible: boolean, delay: string = 'delay-0') => `
        transition-all duration-700 ease-out ${delay}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `;

    const ProgressBar = () => (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-200 dark:bg-slate-700/50" aria-hidden="true">
            <div 
                key={`${activeIndex}-${isInteracting}`}
                className={`h-full bg-brand-teal-500 dark:bg-brand-teal-400 ${!isInteracting ? 'progress-bar-animate' : ''}`}
            />
        </div>
    );
    
    return (
        <section ref={sectionRef} id="package-features" className="py-20 sm:py-32 bg-slate-100 dark:bg-slate-900/70 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`max-w-3xl mx-auto text-center ${animationClasses(isSectionVisible)}`}>
                    <div className="inline-block mb-4">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
                            {t('packageFeatures.tag')}
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                        {t('packageFeatures.title')}
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                        {t('packageFeatures.subtitle')}
                    </p>
                </div>
                
                {/* Desktop View */}
                <div className={`mt-20 hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch ${animationClasses(isSectionVisible, 'delay-200')}`}
                    onMouseEnter={handleDesktopMouseEnter}
                    onMouseLeave={handleDesktopMouseLeave}
                >
                    <div className="lg:col-span-1 flex flex-col gap-2">
                        {features.map((feature, index) => (
                            <button
                                key={index}
                                onClick={() => handleTabClick(index)}
                                className={`flex-1 flex flex-col p-6 rounded-xl text-left transition-all duration-300 border relative overflow-hidden ${activeIndex === index ? 'bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700' : 'bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                            >
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${activeIndex === index ? 'bg-brand-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className={`ml-4 text-lg font-bold transition-colors duration-300 ${activeIndex === index ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {t(feature.titleKey)}
                                    </h3>
                                </div>
                                <p className={`mt-2 text-slate-600 dark:text-slate-400`}>
                                    {t(feature.descriptionKey)}
                                </p>
                                {activeIndex === index && <ProgressBar />}
                            </button>
                        ))}
                    </div>
                    
                    <div className="lg:col-span-2 relative aspect-square lg:aspect-[4/3] -mt-4 lg:mt-0">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                                    activeIndex === index
                                        ? 'opacity-100 scale-100 pointer-events-auto'
                                        : 'opacity-0 scale-95 pointer-events-none'
                                }`}
                            >
                                <div className="w-full h-full bg-white dark:bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
                                    {feature.visual}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Accordion View */}
                <div className={`mt-12 block lg:hidden ${animationClasses(isSectionVisible, 'delay-200')}`}>
                    <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                            >
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        ref={(el) => {
                                            itemRefs.current[index] = el;
                                        }}
                                        className="min-w-full flex flex-col"
                                    >
                                        <div className="p-6 pb-4 flex items-center">
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                                    activeIndex === index
                                                        ? 'bg-brand-teal-500 text-white'
                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {feature.icon}
                                            </div>
                                            <h3 className="ml-4 text-lg font-bold text-slate-900 dark:text-white">
                                                {t(feature.titleKey)}
                                            </h3>
                                        </div>
                                        <div className="px-6 pb-2 text-slate-600 dark:text-slate-300 min-h-[96px]">
                                            {t(feature.descriptionKey)}
                                        </div>
                                        <div className="px-4 pb-6">
                                            <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 aspect-[2/3]">
                                                {feature.visual}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pb-3 pt-2 px-3 flex items-center justify-between gap-4">
                            <button
                                aria-label="Previous feature"
                                className="h-11 w-11 flex-shrink-0 rounded-full bg-white/90 dark:bg-slate-900/80 shadow-md border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 backdrop-blur transition hover:scale-[1.02] active:scale-95"
                                onClick={() => handleTabClick((activeIndex - 1 + features.length) % features.length)}
                            >
                                <span className="sr-only">Previous</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center justify-center gap-2">
                                {features.map((_, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                        <div key={index} className="w-5 flex justify-center">
                                            <button
                                                onClick={() => handleTabClick(index)}
                                                className={`relative h-2 overflow-hidden transition-[width,background-color] duration-400 ease-out ${
                                                    isActive ? 'w-6 bg-brand-teal-100/60 dark:bg-brand-teal-900/40' : 'w-2 bg-slate-300 dark:bg-slate-700'
                                                } rounded-full`}
                                                aria-label={`Go to ${t(features[index].titleKey)}`}
                                                aria-pressed={isActive}
                                            >
                                                {isActive && !isInteracting && (
                                                    <span
                                                        key={`${activeIndex}-${isInteracting}`}
                                                        className="block h-full w-0 bg-brand-teal-500 dark:bg-brand-teal-400 progress-bar-animate"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                aria-label="Next feature"
                                className="h-11 w-11 flex-shrink-0 rounded-full bg-white/90 dark:bg-slate-900/80 shadow-md border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 backdrop-blur transition hover:scale-[1.02] active:scale-95"
                                onClick={() => handleTabClick((activeIndex + 1) % features.length)}
                            >
                                <span className="sr-only">Next</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {isDesktop && lightboxImage && (
            <div
                className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
                role="dialog"
                aria-modal="true"
                aria-label={lightboxImage.alt}
                onClick={closeLightbox}
            >
                <div
                    className="relative w-full max-w-[95vw] lg:max-w-6xl xl:max-w-7xl transition-all duration-200 opacity-100 scale-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full shadow-md px-3 py-1 text-sm font-semibold hover:bg-slate-100"
                        onClick={closeLightbox}
                    >
                        {t('common.close')}
                    </button>
                    <div className="rounded-[22px] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
                        <img
                            src={lightboxImage.src}
                            alt={lightboxImage.alt}
                            className="w-full h-auto"
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                </div>
            </div>
        )}
        </section>
    );
};

// Simple plus icon for mockups
const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);


export default PackageFeatures;
