
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Accordion, { AccordionEntry } from './ui/Accordion';
import SectionHeader from './ui/SectionHeader';
import CTAButton from './ui/CTAButton';

const FAQ: React.FC = () => {
  const { t } = useAppContext();

  const faqItems = t('faq.items') as unknown as { question: string; answer: string }[];

  const accordionItems: AccordionEntry[] = faqItems.map(item => ({
    title: item.question,
    content: <p>{item.answer}</p>,
  }));

  return (
    <section id="faq" className="py-20 sm:py-32 bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionHeader
              title={
                <>
                  <span className="font-light text-slate-500 dark:text-slate-400">
                    {t('faq.title.regular')}
                  </span>
                  <br />
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {t('faq.title.bold')}
                  </span>
                </>
              }
              subtitle={t('faq.subtitle')}
              titleClassName="text-4xl sm:text-5xl"
            />
            <CTAButton href="mailto:support@lumiso.app" className="mt-8">
              {t('faq.button')}
            </CTAButton>
          </div>

          <div className="lg:col-span-3 mt-12 lg:mt-0">
            <Accordion items={accordionItems} defaultOpenIndices={[0]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
