import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionHeader from './ui/SectionHeader';

const AIFeatures: React.FC = () => {
    const { t } = useAppContext();
    
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);
    const card3Ref = useRef<HTMLDivElement>(null);
    const cardRefs = [card1Ref, card2Ref, card3Ref];

    const isSectionVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
    const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.2 });
    const cardVisibility = [
        useIntersectionObserver(card1Ref, { threshold: 0.2 }),
        useIntersectionObserver(card2Ref, { threshold: 0.2 }),
        useIntersectionObserver(card3Ref, { threshold: 0.2 })
    ];
    
    const cardDelays = ['delay-0', 'delay-200', 'delay-400'];

    const features = [
        {
            titleKey: 'aiFeatures.card1.title',
            descriptionKey: 'aiFeatures.card1.description',
            icon: (
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal-500/20 via-sky-500/20 to-indigo-500/30 text-brand-teal-500 dark:text-brand-teal-300">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                        <path d="M4 10h24M8 16h16M12 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/90 blur-[1px]" />
                </div>
            ),
        },
        {
            titleKey: 'aiFeatures.card2.title',
            descriptionKey: 'aiFeatures.card2.description',
            icon: (
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal-400/20 via-cyan-400/20 to-purple-400/30 text-cyan-500 dark:text-cyan-300">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                        <path d="M6 12c6-8 14-8 20 0M6 20c6 8 14 8 20 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="absolute -top-0.5 left-0 w-1.5 h-1.5 rounded-full bg-fuchsia-200 animate-pulse" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white/70 blur-[1px]" />
                </div>
            ),
        },
        {
            titleKey: 'aiFeatures.card3.title',
            descriptionKey: 'aiFeatures.card3.description',
            icon: (
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-pink-500/30 text-indigo-400 dark:text-indigo-200">
                    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                        <path d="M10 8h12v16H10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 14h12M16 14v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-white/80 animate-ping" />
                </div>
            ),
        },
    ];

    const headerAnimationClasses = `transition-all duration-700 ease-out ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    const cardAnimationClasses = (isVisible: boolean, delay: string) => `
        transition-all duration-700 ease-out ${delay}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `;

    return (
        <section ref={sectionRef} id="ai-features" className={`py-20 sm:py-32 overflow-hidden ai-features-bg ${isSectionVisible ? 'visible' : ''}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={headerRef} className={`max-w-3xl mx-auto ${headerAnimationClasses}`}>
                    <SectionHeader
                        align="center"
                        badgeText={t('aiFeatures.tag')}
                        title={t('aiFeatures.title')}
                        subtitle={t('aiFeatures.subtitle')}
                    />
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            ref={cardRefs[index]}
                            className={`group relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/5 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.25)] p-6 ${cardAnimationClasses(cardVisibility[index], cardDelays[index])}`}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute -inset-12 bg-gradient-to-br from-brand-teal-500/10 via-transparent to-indigo-500/20 blur-3xl" />
                            </div>
                            <div className="relative flex items-start justify-between gap-4">
                                {feature.icon}
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white/80">
                                    {t('aiFeatures.comingSoon')}
                                </span>
                            </div>
                            <h3 className="relative mt-6 text-xl font-semibold text-slate-900 dark:text-white">{t(feature.titleKey)}</h3>
                            <p className="relative mt-2 text-slate-600 dark:text-slate-300">{t(feature.descriptionKey)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AIFeatures;
