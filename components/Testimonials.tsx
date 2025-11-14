
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import SectionHeader from './ui/SectionHeader';

const Testimonials: React.FC = () => {
    const { t } = useAppContext();
    const testimonials = Array.from({ length: 10 }, (_, i) => ({
      quote: t(`testimonials.person${i + 1}.quote`),
      name: t(`testimonials.person${i + 1}.name`),
      title: t(`testimonials.person${i + 1}.title`),
      avatar: `https://picsum.photos/seed/person${i + 1}/100/100`
    }));

  // Fix: Explicitly type TestimonialCard as React.FC to correctly handle the 'key' prop.
  const TestimonialCard: React.FC<typeof testimonials[0]> = ({ quote, name, title, avatar }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col shadow-lg mx-4 flex-shrink-0 w-80 md:w-96">
      <p className="text-slate-600 dark:text-slate-300 flex-grow">"{quote}"</p>
      <div className="mt-6 flex items-center">
        <img
          className="h-12 w-12 rounded-full"
          src={avatar}
          alt={name}
          loading="lazy"
          decoding="async"
        />
        <div className="ml-4">
          <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
          <p className="text-sm text-brand-teal-600 dark:text-brand-teal-400">{title}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-slate-100 dark:bg-slate-900/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            align="center"
            badgeText={t('testimonials.tag')}
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
          />
        </div>
      </div>
      <div className="mt-16 marquee-container py-8">
        <div className="marquee">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
          {/* Duplicate for seamless looping */}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={`duplicate-${index}`} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
