import React, { Suspense, lazy, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyLumiso from './components/WhyLumiso';
import KeyFeatures from './components/KeyFeatures';
import Features from './components/Features';
import PackageFeatures from './components/PackageFeatures';
import Workflow from './components/Workflow';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import { legalDocSlugs } from './lib/legal';

const AIFeatures = lazy(() => import('./components/AIFeatures'));
const Results = lazy(() => import('./components/Results'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CTA = lazy(() => import('./components/CTA'));
const FAQ = lazy(() => import('./components/FAQ'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const LegalIndexPage = lazy(() => import('./pages/LegalIndexPage'));

const SectionFallback: React.FC = () => (
  <div className="py-20 text-center text-slate-400 dark:text-slate-500">
    Loading…
  </div>
);

const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300 flex items-center justify-center">
    Yükleniyor…
  </div>
);

const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  });

  useEffect(() => {
    document.documentElement.classList.remove('preload');
    document.documentElement.classList.add('app-ready');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '') || '/';
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  const isBlogRoute = pathSegments[0] === 'blog';
  const isLegalIndexRoute = normalizedPath === '/legal';
  const isLegalRoute = pathSegments.length === 1 && legalDocSlugs.has(pathSegments[0]);
  const blogSlug = pathSegments.length > 1 ? pathSegments[1] : null;

  if (isLegalIndexRoute) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <LegalIndexPage />
      </Suspense>
    );
  }

  if (isLegalRoute) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <LegalPage slug={pathSegments[0]} />
      </Suspense>
    );
  }

  if (isBlogRoute) {
    return (
      <Suspense fallback={<RouteFallback />}>
        {blogSlug ? <BlogArticlePage slug={blogSlug} /> : <BlogPage />}
      </Suspense>
    );
  }

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
