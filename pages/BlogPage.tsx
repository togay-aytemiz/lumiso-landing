import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import PrismBackground from '../components/ui/PrismBackground';
import { useAppContext } from '../contexts/AppContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import type { BlogPost as RemoteBlogPost } from '../lib/strapi';
import { SIGN_UP_URL } from '../lib/urls';

interface DisplayPost {
  id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  readTime?: string;
  category?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorName?: string;
  authorTitle?: string;
  url?: string;
}

interface TranslationPostAuthor {
  name: string;
  title: string;
}

interface TranslationPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: TranslationPostAuthor;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return undefined;
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const estimateReadTime = (post: RemoteBlogPost) => {
  if (post.readTime) return post.readTime;
  if (post.content) {
    const words = post.content.trim().split(/\s+/).length;
    if (Number.isFinite(words) && words > 0) {
      const minutes = Math.max(1, Math.round(words / 200));
      return `${minutes} min read`;
    }
  }
  return undefined;
};

const BlogPage: React.FC = () => {
  const { t } = useAppContext();
  const { posts: remotePosts, loading, error, hasRemoteSource } = useBlogPosts();
  const rawPosts = t('blog.posts') as unknown;
  const fallbackPosts = Array.isArray(rawPosts) ? (rawPosts as TranslationPost[]) : [];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const remoteDisplayPosts = useMemo<DisplayPost[]>(() => {
    if (!remotePosts.length) return [];
    return remotePosts.map((post) => ({
      id: post.slug,
      title: post.title,
      excerpt: post.excerpt || post.content?.slice(0, 220),
      publishedAt: formatDate(post.publishedAt),
      readTime: estimateReadTime(post),
      category: post.category || 'Editorial',
      coverImageUrl: post.coverImageUrl,
      coverImageAlt: post.coverImageAlt || post.title,
      authorName: post.authorName || 'Lumiso Team',
      authorTitle: post.authorTitle || 'Editorial Team',
      url: post.url,
    }));
  }, [remotePosts]);

  const sampleDisplayPosts = useMemo<DisplayPost[]>(() => {
    if (!fallbackPosts.length) return [];
    return fallbackPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.description,
      publishedAt: post.date,
      readTime: post.readTime,
      category: post.category,
      coverImageUrl: undefined,
      authorName: post.author.name,
      authorTitle: post.author.title,
    }));
  }, [fallbackPosts]);

  const displayPosts = remoteDisplayPosts.length ? remoteDisplayPosts : sampleDisplayPosts;

  const categories = useMemo(() => {
    const unique = new Set<string>();
    displayPosts.forEach((post) => {
      if (post.category) unique.add(post.category);
    });
    return Array.from(unique);
  }, [displayPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return displayPosts;
    return displayPosts.filter((post) => post.category === selectedCategory);
  }, [displayPosts, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const connectionStatus = () => {
    if (!hasRemoteSource) {
      return 'Add your Strapi API URL in .env to load live articles.';
    }
    if (error && !remoteDisplayPosts.length) {
      return 'Unable to reach Strapi right now — showing sample articles.';
    }
    if (remoteDisplayPosts.length) {
      return 'Live content from your Strapi Cloud workspace.';
    }
    return undefined;
  };
  const statusMessage = connectionStatus();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header mode="blog" />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-80">
            <PrismBackground animationType="3drotate" scale={4} baseWidth={6} height={4} hueShift={0.4} />
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-brand-teal-200">
                {t('blog.tag')}
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {t('blog.title')}
              </h1>
              <p className="mt-6 text-lg text-white/80">
                {t('blog.subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={SIGN_UP_URL}
                  className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-3 font-semibold shadow-lg shadow-brand-teal-500/30 hover:shadow-brand-teal-500/40"
                >
                  {t('cta.button')}
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white/90 hover:bg-white/10"
                >
                  Back to product site
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-2xl shadow-slate-900/10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal-500">
                    Editorial calendar
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    Latest stories & playbooks
                  </h2>
                  {statusMessage && (
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      {statusMessage}
                    </p>
                  )}
                </div>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-brand-teal-500 text-white shadow-lg shadow-brand-teal-500/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                      }`}
                    >
                      All topics
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          selectedCategory === category
                            ? 'bg-brand-teal-500 text-white shadow-lg shadow-brand-teal-500/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {featuredPost && (
                <article className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-900/80">
                    {featuredPost.coverImageUrl ? (
                      <img
                        src={featuredPost.coverImageUrl}
                        alt={featuredPost.coverImageAlt || featuredPost.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full min-h-[280px] bg-gradient-to-br from-brand-teal-500/40 via-brand-teal-400/20 to-transparent" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        {featuredPost.category}
                      </span>
                      <h3 className="mt-4 text-2xl font-semibold text-white">
                        {featuredPost.title}
                      </h3>
                      <p className="mt-3 text-sm text-white/80">
                        {featuredPost.excerpt}
                      </p>
                      <div className="mt-4 text-sm text-white/80 flex flex-wrap gap-3">
                        {featuredPost.publishedAt && <span>{featuredPost.publishedAt}</span>}
                        {featuredPost.readTime && (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-white/70" />
                            {featuredPost.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal-500">
                      Featured story
                    </p>
                    <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      {featuredPost.publishedAt && <span>{featuredPost.publishedAt}</span>}
                      {featuredPost.readTime && (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-slate-400" />
                          {featuredPost.readTime}
                        </span>
                      )}
                      {featuredPost.authorName && (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-slate-400" />
                          {featuredPost.authorName}
                          {featuredPost.authorTitle && (
                            <span className="text-slate-400">· {featuredPost.authorTitle}</span>
                          )}
                        </span>
                      )}
                    </div>
                    {featuredPost.url && (
                      <div className="mt-8">
                        <a
                          href={featuredPost.url}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-6 py-3 font-semibold shadow-lg hover:bg-slate-800"
                        >
                          Read the article
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              )}

              {loading && (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {!loading && remainingPosts.length > 0 && (
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <article
                      key={post.id}
                      className="flex flex-col rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg"
                    >
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.coverImageAlt || post.title}
                          className="h-48 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-48 w-full bg-gradient-to-br from-brand-teal-200 via-brand-teal-50 to-white dark:from-brand-teal-900/70 dark:via-slate-900 dark:to-slate-900" />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal-500">
                          {post.category || 'Editorial'}
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-3">
                          {post.publishedAt && <span>{post.publishedAt}</span>}
                          {post.readTime && (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-slate-400" />
                              {post.readTime}
                            </span>
                          )}
                        </div>
                        {post.authorName && (
                          <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                            {post.authorName}
                            {post.authorTitle && <span className="text-slate-500 dark:text-slate-400"> · {post.authorTitle}</span>}
                          </p>
                        )}
                        {post.url && (
                          <a
                            href={post.url}
                            className="mt-6 inline-flex items-center gap-2 text-brand-teal-600 dark:text-brand-teal-400 font-semibold"
                          >
                            {t('blog.readMore')}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H7" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {!loading && filteredPosts.length === 0 && (
                <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  No posts found for this category yet.
                </p>
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

export default BlogPage;
