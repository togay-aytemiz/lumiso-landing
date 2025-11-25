export const SITE_URL = 'https://www.lumiso.app';

export type SupportedLanguage = 'en' | 'tr';

export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
}

export const seoContent: Record<SupportedLanguage, SeoContent> = {
  en: {
    title: 'Lumiso CRM | Client & Workflow OS for Photographers',
    description:
      'Lumiso brings every client, booking, invoice, and gallery into one CRM built for photographers. Automate workflows, get paid faster, and wow clients.',
    keywords:
      'photographer crm, studio management software, client galleries, photography workflow, invoicing for photographers',
    ogTitle: 'Lumiso CRM — All-in-one studio & client management for photographers',
    ogDescription:
      'Stop juggling tools. Capture leads, automate workflows, deliver galleries, and get paid from a single beautiful dashboard.',
    ogLocale: 'en_US',
  },
  tr: {
    title: 'Lumiso CRM | Fotoğrafçılar için CRM ve İş Akışı Platformu',
    description:
      'Lumiso; müşteriler, rezervasyonlar, faturalar ve galerileri tek bir CRM altında toplar. İş akışlarını otomatikleştirir, ödemeleri hızlandırır ve müşteri deneyimini yükseltir.',
    keywords:
      'fotoğrafçı crm, stüdyo yönetimi, müşteri yönetimi, fotoğraf galerisi yazılımı, fotoğrafçılar için faturalandırma',
    ogTitle: 'Lumiso CRM — Fotoğrafçılar için hepsi bir arada stüdyo yönetimi',
    ogDescription:
      'Araç karmaşasına son verin. Talepleri yakalayın, iş akışlarını otomatikleştirin, galerileri teslim edin ve tek bir panodan ödeme alın.',
    ogLocale: 'tr_TR',
  },
};
