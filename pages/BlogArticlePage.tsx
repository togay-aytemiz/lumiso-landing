import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import { useAppContext } from '../contexts/AppContext';
import { BlogPost, fetchBlogPostBySlug } from '../lib/strapi';

interface BlogArticlePageProps {
  slug: string;
}

type ArticleBlock = {
  __component?: string;
  [key: string]: unknown;
};

const formatDate = (dateValue?: string) => {
  if (!dateValue) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateValue));
  } catch {
    return dateValue;
  }
};

const stripMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
};

const renderRichTextBlock = (body: string, keyPrefix: string) => {
  const segments = body.split(/\n{2,}/);
  return segments.map((segment, index) => {
    const trimmed = segment.trim();
    if (!trimmed) return null;

    if (/^###\s+/.test(trimmed)) {
      return (
        <h3 key={`${keyPrefix}-h3-${index}`} className="text-xl font-semibold text-slate-900 dark:text-white mt-10">
          {stripMarkdown(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
    }

    if (/^##\s+/.test(trimmed)) {
      return (
        <h2 key={`${keyPrefix}-h2-${index}`} className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-12">
          {stripMarkdown(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
    }

    if (/^#\s+/.test(trimmed)) {
      return (
        <h1 key={`${keyPrefix}-h1-${index}`} className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-14">
          {stripMarkdown(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
    }

    const lines = trimmed.split('\n').map((line) => line.trim());
    const isList = lines.every((line) => /^[-\*]\s+/.test(line));

    if (isList) {
      return (
        <ul key={`${keyPrefix}-list-${index}`} className="mt-6 list-disc space-y-3 pl-6 text-slate-700 dark:text-slate-300">
          {lines.map((line, lineIndex) => (
            <li key={`${keyPrefix}-list-item-${index}-${lineIndex}`}>
              {stripMarkdown(line.replace(/^[-\*]\s+/, ''))}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`${keyPrefix}-p-${index}`} className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        {stripMarkdown(trimmed)}
      </p>
    );
  });
};

const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug }) => {
  const { t } = useAppContext();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchBlogPostBySlug(slug, { populate: '*' })
      .then((article) => {
        if (!isMounted) return;
        setPost(article);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setError(err.message || 'Unable to load article');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const formattedDate = useMemo(() => formatDate(post?.publishedAt), [post?.publishedAt]);

  const renderQuoteBlock = (block: ArticleBlock, index: number) => {
    const body = typeof block.body === 'string' ? block.body : undefined;
    if (!body) return null;
    return (
      <figure
        key={`quote-${index}`}
        className="my-10 rounded-3xl bg-slate-100 dark:bg-slate-800 p-8 text-center text-lg italic text-slate-700 dark:text-slate-200"
      >
        <blockquote>“{body.trim()}”</blockquote>
        {typeof block.title === 'string' && (
          <figcaption className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-teal-500">
            {block.title}
          </figcaption>
        )}
      </figure>
    );
  };

  const contentBlocks = useMemo(() => {
    if (!post?.blocks || !post.blocks.length) {
      if (!post?.content) return null;
      return (
        <div className="space-y-6">
          {renderRichTextBlock(post.content, 'fallback')}
        </div>
      );
    }

    return post.blocks
      .map((block, index) => {
        if (!block || typeof block !== 'object') return null;
        if (block.__component === 'shared.rich-text' && typeof block.body === 'string') {
          return (
            <div key={`rich-text-${index}`} className="space-y-6">
              {renderRichTextBlock(block.body, `block-${index}`)}
            </div>
          );
        }
        if (block.__component === 'shared.quote') {
          return renderQuoteBlock(block, index);
        }
        return null;
      })
      .filter(Boolean);
  }, [post?.blocks, post?.content]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header mode="blog" />
      <main>
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0">
            {post?.coverImageUrl && (
              <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="h-full w-full object-cover opacity-40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal-300">
                {post?.category || 'Editorial'}
              </p>
              <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
                {post?.title || 'Untitled article'}
              </h1>
              {post?.description && (
                <p className="mt-4 text-lg text-white/80">{post.description}</p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70">
                {formattedDate && <span>{formattedDate}</span>}
                {post?.readTime && (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-white/70" />
                    {post.readTime}
                  </span>
                )}
                {post?.authorName && (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-white/70" />
                    {post.authorName}
                    {post.authorTitle && <span className="text-white/60">· {post.authorTitle}</span>}
                  </span>
                )}
              </div>
              <div className="mt-8 inline-flex flex-wrap gap-3">
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-white/25"
                >
                  ← {t('blog.viewAll')}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-12 shadow-xl shadow-slate-900/10">
              {loading && (
                <div className="space-y-4">
                  <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-64 w-full rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              )}

              {!loading && error && (
                <p className="text-center text-sm text-rose-500">{error}</p>
              )}

              {!loading && !post && !error && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Article not found</h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                    This link may be broken or the article is still being drafted.
                  </p>
                  <a
                    href="/blog"
                    className="mt-6 inline-flex items-center rounded-full bg-brand-teal-500 px-6 py-3 font-semibold text-white"
                  >
                    Back to all articles
                  </a>
                </div>
              )}

              {post && !loading && (
                <article className="space-y-6">
                  {contentBlocks}
                  {!contentBlocks && (
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                      {post.excerpt || 'This article will be updated soon.'}
                    </p>
                  )}
                </article>
              )}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticlePage;
