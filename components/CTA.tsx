
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const CTA: React.FC = () => {
  const { t } = useAppContext();

  return (
    <section id="contact" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-12 lg:p-20 rounded-3xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-teal-400/20 dark:bg-brand-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-1 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                {t('cta.title')}
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto lg:mx-0">
                {t('cta.subtitle')}
              </p>

              <div className="mt-12">
                  <a
                    href="#"
                    className="inline-block bg-gradient-to-r from-brand-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-brand-teal-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-teal-500/40"
                  >
                    {t('cta.button')}
                  </a>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-1 relative mt-12 lg:mt-0">
                <img
                    src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2070&auto=format&fit=crop"
                    alt={t('cta.imageAlt')}
                    className="relative w-full rounded-2xl shadow-2xl shadow-slate-400/20 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700/80"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
