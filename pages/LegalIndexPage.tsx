import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { legalDocs, preferredOrder } from '../lib/legal';

const groups: Array<{ title: string; ids: string[] }> = [
  {
    title: 'Kullanım ve Sözleşmeler',
    ids: ['terms', 'dpa'],
  },
  {
    title: 'Kişisel Veriler ve Gizlilik',
    ids: ['privacy', 'kvkk', 'cookie-policy'],
  },
  {
    title: 'İletişim ve Onaylar',
    ids: ['communication-consent'],
  },
];

const LegalIndexPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const docsById = legalDocs.reduce<Record<string, typeof legalDocs[number]>>((acc, doc) => {
    acc[doc.id] = doc;
    return acc;
  }, {});

  const unseen = preferredOrder.filter((id) => !groups.some((g) => g.ids.includes(id)));
  if (unseen.length > 0) {
    groups.push({ title: 'Diğer', ids: unseen });
  }

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 min-h-screen flex flex-col">
      <Header mode="blog" initialContentTone="dark" />
      <main className="flex-1 pt-24 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-slate-500 dark:text-slate-400">Hukuki dokümanlar</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gizlilik ve Kullanım Merkezi
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Kullanım şartları, veri koruma ve ileti onaylarıyla ilgili dokümanların tamamına buradan ulaşabilirsiniz.
          </p>

          <div className="mt-10 space-y-10">
            {groups.map((group) => (
              <section key={group.title}>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{group.title}</h2>
                <div className="mt-3 space-y-2 sm:space-y-3">
                  {group.ids
                    .map((id) => docsById[id])
                    .filter(Boolean)
                    .map((doc) => (
                      <div key={doc.id}>
                        <a
                          href={`/${doc.slug}`}
                          className="inline-flex text-base sm:text-lg font-semibold text-brand-teal-600 dark:text-brand-teal-300 hover:text-brand-teal-500 dark:hover:text-brand-teal-200 transition-colors underline-offset-4 hover:underline"
                        >
                          {doc.title}
                        </a>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default LegalIndexPage;
