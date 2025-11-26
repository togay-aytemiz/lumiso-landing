import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { getLegalDoc } from '../lib/legal';

type Props = {
  slug: string;
};

const LegalPage: React.FC<Props> = ({ slug }) => {
  const doc = getLegalDoc(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!doc) {
    return (
      <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-28 pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold">Belge bulunamadı</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Aradığınız hukuki doküman şu anda mevcut değil. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-screen flex flex-col">
      <Header mode="blog" initialContentTone="dark" />
      <main className="flex-1 pt-24 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Son güncelleme: {doc.lastUpdated} • Versiyon: {doc.version}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{doc.title}</h1>
          <article
            className="legal-content mt-8"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default LegalPage;
