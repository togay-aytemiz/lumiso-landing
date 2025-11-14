import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { GoogleCalendarIcon } from './icons/GoogleCalendarIcon';
import { StripeIcon } from './icons/StripeIcon';
import { DropboxIcon } from './icons/DropboxIcon';
import { QuickBooksIcon } from './icons/QuickBooksIcon';
import { GmailIcon } from './icons/GmailIcon';
import { ICalIcon } from './icons/ICalIcon';
import { PayPalIcon } from './icons/PayPalIcon';
import { InstagramIcon } from './icons/InstagramIcon';

const Integrations: React.FC = () => {
    const { t } = useAppContext();
    
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.2 });
    const isGridVisible = useIntersectionObserver(gridRef, { threshold: 0.1 });

    const headerAnimationClasses = `transition-all duration-700 ease-out ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    const gridAnimationClasses = `transition-all duration-700 ease-out ${isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
    
    const integrations = [
        { nameKey: 'integrations.google_calendar', icon: <GoogleCalendarIcon /> },
        { nameKey: 'integrations.stripe', icon: <StripeIcon /> },
        { nameKey: 'integrations.dropbox', icon: <DropboxIcon /> },
        { nameKey: 'integrations.quickbooks', icon: <QuickBooksIcon /> },
        { nameKey: 'integrations.gmail', icon: <GmailIcon /> },
        { nameKey: 'integrations.ical', icon: <ICalIcon /> },
        { nameKey: 'integrations.paypal', icon: <PayPalIcon /> },
        { nameKey: 'integrations.instagram', icon: <InstagramIcon /> },
    ];

    const cardAnimationClasses = (isVisible: boolean, delay: string) => `
        transition-all duration-500 ease-out ${delay}
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
    `;

    return (
        <section id="integrations" className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className={`max-w-3xl mx-auto text-center ${headerAnimationClasses}`}>
                    <div className="inline-block mb-4">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
                            {t('integrations.tag')}
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                        {t('integrations.title')}
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                        {t('integrations.subtitle')}
                    </p>
                </div>

                <div ref={gridRef} className={`mt-16 ${gridAnimationClasses}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                        {integrations.map((integration, index) => (
                            <div 
                                key={integration.nameKey} 
                                className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${cardAnimationClasses(isGridVisible, `delay-${100 + index * 50}`)}`}
                            >
                                <div className="w-16 h-16">{integration.icon}</div>
                                <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200 text-center">{t(integration.nameKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;