import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyLumiso from './components/WhyLumiso';
import KeyFeatures from './components/KeyFeatures';
import Features from './components/Features';
import PackageFeatures from './components/PackageFeatures';
import Workflow from './components/Workflow';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

const AIFeatures = lazy(() => import('./components/AIFeatures'));
const Results = lazy(() => import('./components/Results'));
const Pricing = lazy(() => import('./components/Pricing'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CTA = lazy(() => import('./components/CTA'));
const FAQ = lazy(() => import('./components/FAQ'));

const SectionFallback: React.FC = () => (
  <div className="py-20 text-center text-slate-400 dark:text-slate-500">
    Loading…
  </div>
);

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 font-sans antialiased transition-colors duration-300">
      <Header />
      <main className="-mt-16">
        <Hero />
        <WhyLumiso />
        <KeyFeatures />
        <Features />
        <PackageFeatures />
        <Workflow />
        <Suspense fallback={<SectionFallback />}>
          <AIFeatures />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Results />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Pricing />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTA />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQ />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;
