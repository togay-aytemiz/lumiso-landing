import React, { useRef, useId } from 'react';
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
    const captionIconId = useId();
    const poseIconId = useId();
    const conceptIconId = useId();

    const features = [
        {
            titleKey: 'aiFeatures.card1.title',
            descriptionKey: 'aiFeatures.card1.description',
            icon: (
                <div className="relative flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-brand-teal-500/20 via-sky-500/20 to-indigo-500/30">
                    <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
                        <defs>
                            <linearGradient id={`${captionIconId}-bubble`} x1="6" y1="8" x2="25" y2="23" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#7CF4E9" />
                                <stop offset="1" stopColor="#5D76FF" />
                            </linearGradient>
                            <linearGradient id={`${captionIconId}-tail`} x1="14" y1="21" x2="18" y2="27" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9AD3FF" />
                                <stop offset="1" stopColor="#587FFF" />
                            </linearGradient>
                        </defs>
                        <rect x="5.5" y="6.5" width="21" height="13.5" rx="6.75" fill={`url(#${captionIconId}-bubble)`} />
                        <path d="M13.6 20.7h4.7l1.3 3.7c.2.7-.5 1.3-1.1.9L16 24l-2.5 1.3c-.6.4-1.3-.2-1.1-.9l1.2-3.7Z" fill={`url(#${captionIconId}-tail)`} />
                        <path d="M11 12.5h10" stroke="#F1FBFF" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M11 16h8" stroke="#E5F3FF" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="10" cy="10.5" r="1.2" fill="#C8FDFF" />
                    </svg>
                    <span className="absolute inset-0 rounded-3xl bg-white/10 blur-xl opacity-60" />
                </div>
            ),
        },
        {
            titleKey: 'aiFeatures.card2.title',
            descriptionKey: 'aiFeatures.card2.description',
            icon: (
                <div className="relative flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-brand-teal-400/20 via-cyan-400/20 to-purple-400/30">
                    <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
                        <defs>
                            <radialGradient id={`${poseIconId}-fill`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) rotate(90) scale(9)">
                                <stop stopColor="#7EE8FF" />
                                <stop offset="1" stopColor="#4B7DFF" />
                            </radialGradient>
                            <linearGradient id={`${poseIconId}-ring`} x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#99F1FF" />
                                <stop offset="1" stopColor="#7A70FF" />
                            </linearGradient>
                        </defs>
                        <circle cx="16" cy="16" r="8.5" fill={`url(#${poseIconId}-fill)`} opacity="0.9" />
                        <circle cx="16" cy="16" r="9.75" stroke={`url(#${poseIconId}-ring)`} strokeWidth="1.5" />
                        <circle cx="16" cy="16" r="4.5" stroke="#E3F2FF" strokeWidth="1.5" />
                        <path d="M12.5 16h7M16 12.5v7" stroke="#F8FFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
                        <path d="M9 12V8h4M23 12V8h-4M9 20v4h4M23 20v4h-4" stroke="#BDF2FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="16" cy="16" r="2" fill="#F5FDFF" opacity="0.6" />
                    </svg>
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white/70 blur-[1px]" />
                </div>
            ),
        },
        {
            titleKey: 'aiFeatures.card3.title',
            descriptionKey: 'aiFeatures.card3.description',
            icon: (
                <div className="relative flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-pink-500/30">
                    <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
                        <defs>
                            <linearGradient id={`${conceptIconId}-base`} x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F0B3FF" />
                                <stop offset="1" stopColor="#9B7CFF" />
                            </linearGradient>
                            <linearGradient id={`${conceptIconId}-card`} x1="10" y1="10" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FFFFFF" stopOpacity="0.9" />
                                <stop offset="1" stopColor="#E0D4FF" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                        <rect x="7" y="7" width="18" height="18" rx="6" fill={`url(#${conceptIconId}-base)`} opacity="0.7" />
                        <rect x="9.5" y="9.5" width="13" height="13" rx="4.5" fill={`url(#${conceptIconId}-card)`} />
                        <path d="M12 13.5h9" stroke="#F7F2FF" strokeWidth="1.3" strokeLinecap="round" />
                        <rect x="12" y="16.5" width="3.8" height="4.5" rx="1.2" fill="#FDF5FF" />
                        <rect x="17.2" y="16.5" width="4.8" height="4.5" rx="1.2" fill="#F9E1FF" />
                        <circle cx="20.8" cy="12" r="1.3" fill="#FFE0FF" />
                        <circle cx="13.2" cy="11.8" r="0.9" fill="#D4C8FF" />
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
