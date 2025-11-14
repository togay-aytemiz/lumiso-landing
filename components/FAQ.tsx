
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const FaqItem: React.FC<{ item: { question: string; answer: string }; isOpen: boolean; onClick: () => void; index: number }> = ({ item, isOpen, onClick, index }) => {
  const panelId = `faq-panel-${index}`;
  const headerId = `faq-header-${index}`;

  return (
    <div className="border-b border-slate-200 dark:border-slate-700/50 py-6">
      <h3 className="text-lg font-semibold m-0 text-slate-800 dark:text-slate-100">
        <button
          onClick={onClick}
          className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring focus-visible:ring-brand-teal-500/50 rounded-md"
          id={headerId}
          aria-controls={panelId}
          aria-expanded={isOpen}
        >
          <span className="pr-4">{item.question}</span>
          <span className="transform transition-transform duration-300 flex-shrink-0">
            {isOpen ? 
              <svg className="w-6 h-6 text-brand-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg> : 
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            }
          </span>
        </button>
      </h3>
      <div 
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="grid overflow-hidden transition-all duration-500 ease-in-out text-slate-600 dark:text-slate-300"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="min-h-0">
            <p className="pt-4">
            {item.answer}
            </p>
        </div>
      </div>
    </div>
  );
};


const FAQ: React.FC = () => {
  const { t } = useAppContext();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = t('faq.items') as unknown as { question: string; answer: string }[];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-32 bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-4xl sm:text-5xl">
              <span className="font-light text-slate-500 dark:text-slate-400">{t('faq.title.regular')}</span><br />
              <span className="font-extrabold text-slate-900 dark:text-white">{t('faq.title.bold')}</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {t('faq.subtitle')}
            </p>
              <a href="#contact" className="mt-8 inline-block bg-brand-teal-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-teal-600 transition-transform duration-200 hover:scale-105 shadow-lg shadow-brand-teal-500/30">
                {t('faq.button')}
              </a>
          </div>

          <div className="lg:col-span-3 mt-12 lg:mt-0">
            {faqItems.map((item, index) => (
              <FaqItem
                key={index}
                index={index}
                item={item}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
