
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { PlusIcon } from './icons/PlusIcon';
import { MoreHorizontalIcon } from './icons/MoreHorizontalIcon';

const Workflow: React.FC = () => {
    const { t } = useAppContext();
    
    const headerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.2 });
    const isBoardVisible = useIntersectionObserver(boardRef, { threshold: 0.1 });

    const headerAnimationClasses = `transition-all duration-700 ease-out ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    const boardAnimationClasses = `transition-all duration-700 ease-out ${isBoardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
    
    const columns = [
        { titleKey: 'workflow.column.newLeads', cards: [
            { id: 1, titleKey: 'workflow.project.chenPortraits', typeKey: 'workflow.cardType.portraits', user: { nameKey: 'workflow.client.markChen', avatar: 'https://i.pravatar.cc/150?u=markchen' } },
            { id: 2, titleKey: 'workflow.project.springMinis', typeKey: 'workflow.cardType.event', user: { nameKey: 'workflow.client.multipleClients', avatar: 'https://i.pravatar.cc/150?u=clients' } }
        ], color: 'bg-sky-500' },
        { titleKey: 'workflow.column.booked', cards: [
            { id: 3, titleKey: 'workflow.project.thompsonWedding', typeKey: 'workflow.cardType.wedding', user: { nameKey: 'workflow.client.alexThompson', avatar: 'https://i.pravatar.cc/150?u=alexthompson' } },
            { id: 4, titleKey: 'workflow.project.garciaProduct', typeKey: 'workflow.cardType.commercial', user: { nameKey: 'workflow.client.chloeGarcia', avatar: 'https://i.pravatar.cc/150?u=chloegarcia' } },
            { id: 5, titleKey: 'workflow.project.williamsBaby', typeKey: 'workflow.cardType.newborn', user: { nameKey: 'workflow.client.benWilliams', avatar: 'https://i.pravatar.cc/150?u=benwilliams' } }
        ], color: 'bg-violet-500' },
        { titleKey: 'workflow.column.inProgress', cards: [
            { id: 6, titleKey: 'workflow.project.millerEdits', typeKey: 'workflow.cardType.wedding', user: { nameKey: 'workflow.client.jessicaMiller', avatar: 'https://i.pravatar.cc/150?u=jessicamiller' } }
        ], color: 'bg-amber-500' },
        { titleKey: 'workflow.column.review', cards: [
             { id: 7, titleKey: 'workflow.project.jonesHeadshots', typeKey: 'workflow.cardType.corporate', user: { nameKey: 'workflow.client.sarahJones', avatar: 'https://i.pravatar.cc/150?u=sarahjones' } }
        ], color: 'bg-rose-500' },
        { titleKey: 'workflow.column.completed', cards: [
            { id: 8, titleKey: 'workflow.project.leeRealEstate', typeKey: 'workflow.cardType.realEstate', user: { nameKey: 'workflow.client.davidLee', avatar: 'https://i.pravatar.cc/150?u=davidlee' } },
            { id: 9, titleKey: 'workflow.project.carterMaternity', typeKey: 'workflow.cardType.maternity', user: { nameKey: 'workflow.client.emilyCarter', avatar: 'https://i.pravatar.cc/150?u=emilycarter' } }
        ], color: 'bg-green-500' }
    ];

    const cardAnimationClasses = (isVisible: boolean, delay: string) => `
      transition-all duration-500 ease-out ${delay}
      ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
    `;

    return (
        <section id="workflow" className="py-20 sm:py-32 bg-white dark:bg-slate-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className={`max-w-3xl mx-auto text-center ${headerAnimationClasses}`}>
                    <div className="inline-block mb-4">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
                            {t('workflow.tag')}
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                        {t('workflow.title')}
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                        {t('workflow.subtitle')}
                    </p>
                </div>

                <div ref={boardRef} className={`mt-16 ${boardAnimationClasses}`}>
                    <div className="overflow-x-auto -mx-4 px-4 hide-scrollbar">
                        <div className="flex justify-start">
                            <div className="flex gap-6 pb-4">
                                {columns.map((column, colIndex) => (
                                    <div key={colIndex} className="w-72 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl flex-shrink-0">
                                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-2 ${column.color}`}></span>
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t(column.titleKey)}</h3>
                                                <span className="ml-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full w-6 h-6 flex items-center justify-center">{column.cards.length}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><PlusIcon /></button>
                                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><MoreHorizontalIcon /></button>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {column.cards.map((card, cardIndex) => (
                                                <div key={card.id} className={`bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-200 ${cardAnimationClasses(isBoardVisible, `delay-${100 + colIndex * 100 + cardIndex * 50}`)}`}>
                                                    <span className="text-xs font-semibold bg-brand-teal-100 dark:bg-brand-teal-900/50 text-brand-teal-800 dark:text-brand-teal-300 px-2 py-1 rounded-full">{t(card.typeKey)}</span>
                                                    <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">{t(card.titleKey)}</p>
                                                    <div className="mt-3 flex items-center">
                                                        <img src={card.user.avatar} alt={t(card.user.nameKey)} className="w-6 h-6 rounded-full" />
                                                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{t(card.user.nameKey)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;