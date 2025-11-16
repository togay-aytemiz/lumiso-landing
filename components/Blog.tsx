import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import SectionHeader from './ui/SectionHeader';
import { useBlogPosts } from '../hooks/useBlogPosts';
import type { BlogPost as RemoteBlogPost } from '../lib/strapi';

type LocalBlogPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    title: string;
  };
};

const gradientPalette = [
  'from-brand-teal-500/30 via-brand-teal-400/10 to-transparent',
  'from-rose-500/30 via-rose-500/10 to-transparent',
  'from-indigo-500/30 via-indigo-400/10 to-transparent',
];

const Blog: React.FC = () => {
  const { t } = useAppContext();
  const { posts: remotePosts } = useBlogPosts({ limit: 3 });

  const rawPosts = t('blog.posts') as unknown;
  const fallbackPosts = Array.isArray(rawPosts) ? (rawPosts as LocalBlogPost[]) : [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
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

  const buildRemoteReadTime = (post: RemoteBlogPost) => {
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

  const normalizedRemotePosts = useMemo<LocalBlogPost[]>(() => {
    if (!remotePosts.length) return [];
    return remotePosts.map((post) => ({
      id: post.slug,
      title: post.title,
      description: post.excerpt || post.content?.slice(0, 140) || '',
      date: formatDate(post.publishedAt),
      readTime: buildRemoteReadTime(post) || '',
      category: post.category || 'Editorial',
      author: {
        name: post.authorName || 'Lumiso Team',
        title: post.authorTitle || 'Editorial Team',
      },
    }));
  }, [remotePosts]);

  const posts = normalizedRemotePosts.length ? normalizedRemotePosts : fallbackPosts;

  return (
    <section id="blog" className="py-20 sm:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            badgeText={t('blog.tag')}
            title={t('blog.title')}
            subtitle={t('blog.subtitle')}
            align="center"
            titleClassName="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white"
            subtitleClassName="mt-4 text-lg text-slate-600 dark:text-slate-300"
          />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br ${gradientPalette[index % gradientPalette.length]} border-b border-slate-200/70 dark:border-slate-800`}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent)]" />
                <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200">
                  {post.category}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white group-hover:text-brand-teal-500 dark:group-hover:text-brand-teal-400 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-3 text-base text-slate-600 dark:text-slate-300 flex-1">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.author.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{post.author.title}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-teal-600 dark:text-brand-teal-400 group-hover:translate-x-1 transition-transform">
                    {t('blog.readMore')}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-brand-teal-200/60 dark:border-brand-teal-400/40 bg-brand-teal-50/80 dark:bg-brand-teal-500/10 px-6 py-3 text-base font-semibold text-brand-teal-600 dark:text-brand-teal-300 hover:bg-brand-teal-100/80 dark:hover:bg-brand-teal-500/20 transition-colors"
          >
            {t('blog.viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
