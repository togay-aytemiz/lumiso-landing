

import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyPhotoFlow from './components/WhyPhotoFlow';
import KeyFeatures from './components/KeyFeatures';
import Features from './components/Features';
import PackageFeatures from './components/PackageFeatures';
import Workflow from './components/Workflow';
import AIFeatures from './components/AIFeatures';
import Results from './components/Results';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 font-sans antialiased transition-colors duration-300">
      <Header />
      <main className="-mt-16">
        <Hero />
        <WhyPhotoFlow />
        <KeyFeatures />
        <Features />
        <PackageFeatures />
        <Workflow />
        <AIFeatures />
        <Results />
        <Pricing />
        <Testimonials />
        <CTA />
        <FAQ />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;