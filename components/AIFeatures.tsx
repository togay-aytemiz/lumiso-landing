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
          titleKey: 'aiFeatures.card3.title',
          descriptionKey: 'aiFeatures.card3.description',
          stage: '01 Inspiration',
          visual: (
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg p-2 grid grid-cols-2 gap-2">
                <div className="bg-cover bg-center rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1572417939230-798882895f08?w=200')"}}></div>
                <div className="bg-cover bg-center rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=200')"}}></div>
                <div className="bg-cover bg-center rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542641197-cdc5b3b01523?w=200')"}}></div>
                <div className="bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center animate-pulse-glow">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
            </div>
          )
        },
        {
          titleKey: 'aiFeatures.card2.title',
          descriptionKey: 'aiFeatures.card2.description',
          stage: '02 Execution',
          visual: (
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg p-2 flex items-center justify-center space-x-4">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-50">
                    <circle cx="32" cy="14" r="5" stroke="#94a3b8" strokeWidth="2"/>
                    <path d="M32 19V34" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M24 30L32 34L40 28" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M32 34L28 48" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M32 34L38 48" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                 <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-brand-teal-500">
                    <circle cx="32" cy="14" r="5" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M32 19V34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M24 28L32 34L40 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M32 34L28 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M32 34L36 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 28C18 30 18 32 20 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-fade-in-out"/>
                    <path d="M44 28C46 30 46 32 44 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-fade-in-out" style={{animationDelay: '0.5s'}}/>
                </svg>
            </div>
          )
        },
        {
          titleKey: 'aiFeatures.card1.title',
          descriptionKey: 'aiFeatures.card1.description',
          stage: '03 Promotion',
           visual: (
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg p-2 flex space-x-2">
                <div className="w-2/3 bg-cover bg-center rounded" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723a9ce6890?w=400')"}}></div>
                <div className="w-1/3 flex flex-col space-y-2">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-blink-cursor-border"></div>
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

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            ref={cardRefs[index]}
                            className={`relative ai-pipeline-stage ${cardAnimationClasses(cardVisibility[index], cardDelays[index])} ${cardVisibility[index] ? 'visible' : ''}`}
                        >
                            <div className="text-sm font-bold text-brand-teal-500 dark:text-brand-teal-400">{feature.stage}</div>
                            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{t(feature.titleKey)}</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">{t(feature.descriptionKey)}</p>
                            
                            <div className="mt-6 p-1 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-lg">
                                {feature.visual}
                            </div>
                           
                            <div className="mt-4 text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-teal-100 dark:bg-brand-teal-900/50 text-brand-teal-700 dark:text-brand-teal-300">
                                    {t('aiFeatures.comingSoon')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AIFeatures;
