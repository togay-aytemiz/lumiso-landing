/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_URL?: string;
  readonly VITE_STRAPI_TOKEN?: string;
  readonly VITE_STRAPI_BLOG_COLLECTION?: string;
  readonly VITE_STRAPI_PUBLICATION_STATE?: 'live' | 'preview';
  readonly VITE_HERO_VIDEO_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
