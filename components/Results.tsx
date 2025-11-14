
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useCountUp from '../hooks/useCountUp';

const Results: React.FC = () => {
  const { t } = useAppContext();
  
  // Refs for observing elements
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // Intersection observer hooks
  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.1 });
  const isCard1Visible = useIntersectionObserver(card1Ref, { threshold: 0.2 });
  const isCard2Visible = useIntersectionObserver(card2Ref, { threshold: 0.2 });
  const isCard3Visible = useIntersectionObserver(card3Ref, { threshold: 0.2 });
  const isCard4Visible = useIntersectionObserver(card4Ref, { threshold: 0.2 });

  // CountUp hooks
  const timeSavings = useCountUp(50, isCard1Visible);
  const bookingIncrease = useCountUp(30, isCard2Visible);
  const bookingRate = useCountUp(85, isCard3Visible);
  const satisfaction = useCountUp(95, isCard3Visible);
  const repeatBusiness = useCountUp(40, isCard3Visible);

  const insightStats = [
    { label: t('results.insights.bookingRate'), value: bookingRate, target: 85, color: 'bg-green-500' },
    { label: t('results.insights.satisfaction'), value: satisfaction, target: 95, color: 'bg-sky-500' },
    { label: t('results.insights.repeatBusiness'), value: repeatBusiness, target: 40, color: 'bg-indigo-500' },
  ];

  const projectCards = [
    { name: t('results.clientExp.project1.name'), status: t('results.clientExp.project1.status'), avatar: 'https://i.pravatar.cc/150?u=jessicamiller', statusIcon: (
      <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
    )},
    { name: t('results.clientExp.project2.name'), status: t('results.clientExp.project2.status'), avatar: 'https://i.pravatar.cc/150?u=markchen', statusIcon: (
      <svg className="w-4 h-4 mr-1.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
    )},
  ];
  
  // Animation classes helper
  const animationClasses = (isVisible: boolean, delay: string = 'delay-0') => `
    transition-all duration-700 ease-out ${delay}
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
  `;

  return (
    <section id="results" className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`max-w-4xl mx-auto text-center ${animationClasses(isHeaderVisible)}`}>
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
              {t('results.tag')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {t('results.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('results.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: More Time for Your Craft */}
          <div ref={card1Ref} className={`bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/50 ${animationClasses(isCard1Visible, 'delay-100')}`}>
            <p className="text-7xl font-bold text-slate-900 dark:text-white">
              {timeSavings}%
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-400">{t('results.timeSavings.label')}</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">{t('results.timeSavings.title')}</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{t('results.timeSavings.description')}</p>
          </div>

          {/* Card 2: Boost Your Bookings */}
          <div ref={card2Ref} className={`bg-sky-100 dark:bg-sky-950/40 p-8 rounded-2xl shadow-xl border border-sky-200 dark:border-sky-800/50 ${animationClasses(isCard2Visible, 'delay-200')}`}>
            <p className="text-7xl font-bold text-sky-800 dark:text-sky-300">
              +{bookingIncrease}%
            </p>
            <p className="mt-2 text-lg font-medium text-sky-700 dark:text-sky-400">{t('results.bookingIncrease.label')}</p>
            <h3 className="mt-4 text-xl font-semibold text-sky-900 dark:text-sky-200">{t('results.bookingIncrease.title')}</h3>
            <p className="mt-2 text-sky-800/80 dark:text-sky-300/80">{t('results.bookingIncrease.description')}</p>
          </div>

          {/* Card 3: Smarter Business Decisions */}
          <div ref={card3Ref} className={`bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/50 ${animationClasses(isCard3Visible, 'delay-100')}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {insightStats.map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}%
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${stat.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: isCard3Visible ? `${stat.target}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">{t('results.insights.title')}</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{t('results.insights.description')}</p>
          </div>

          {/* Card 4: Unforgettable Client Experience */}
          <div ref={card4Ref} className={`bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/50 ${animationClasses(isCard4Visible, 'delay-200')}`}>
            <div className="space-y-4 mb-6">
              {projectCards.map(card => (
                <div key={card.name} className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <img src={card.avatar} alt={card.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{card.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                        {card.statusIcon}
                        {card.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">{t('results.clientExp.title')}</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{t('results.clientExp.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
