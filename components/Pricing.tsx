
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import SectionBadge from './ui/SectionBadge';
import CTAButton from './ui/CTAButton';

const Pricing: React.FC = () => {
  const { t } = useAppContext();

  const features = [
    t('pricing.feature1'),
    t('pricing.feature2'),
    t('pricing.feature3'),
    t('pricing.feature4'),
  ];

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-slate-100 dark:bg-slate-900/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block mb-4">
            <SectionBadge>{t('pricing.tag')}</SectionBadge>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {t('pricing.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('pricing.subtitle')}
          </p>
        </div>
        <div className="mt-16 max-w-lg mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('pricing.planName')}</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">{t('pricing.planDescription')}</p>
              <div className="mt-8 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('pricing.price')}</span>
              </div>
                <CTAButton href="#" fullWidth>
                  {t('pricing.cta')}
                </CTAButton>
            </div>
            <div className="p-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{t('pricing.featuresTitle')}</h4>
              <ul className="mt-4 space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                       <svg className="h-6 w-6 text-brand-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="ml-3 text-slate-600 dark:text-slate-300">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
