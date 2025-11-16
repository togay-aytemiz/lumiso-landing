import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CTA from "../components/CTA";
import { useAppContext } from "../contexts/AppContext";
import { useBlogPosts } from "../hooks/useBlogPosts";
import type { BlogPost as RemoteBlogPost } from "../lib/strapi";
import { SITE_URL } from "../seo.config";

const SITE_ORIGIN = SITE_URL.replace(/\/$/, "");

interface DisplayPost {
  id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  readTime?: string;
  category?: string;
  categoryKey?: string;
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

const formatDate = (dateString?: string, locale: string = "en-US") => {
  if (!dateString) return undefined;
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
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

const normalizeLocale = (languageCode?: string) => {
  if (!languageCode) return "en-US";
  const normalized = languageCode.toLowerCase();
  if (normalized.startsWith("tr")) return "tr-TR";
  if (normalized.startsWith("en")) return "en-US";
  return languageCode;
};

const BlogPage: React.FC = () => {
  const { t, language, setSeoOverrides } = useAppContext();
  const {
    posts: remotePosts,
    loading,
    error,
    hasRemoteSource,
  } = useBlogPosts();
  const rawPosts = t("blog.posts") as unknown;
  const fallbackPosts = Array.isArray(rawPosts)
    ? (rawPosts as TranslationPost[])
    : [];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const dateLocale = useMemo(() => normalizeLocale(language), [language]);

  const remoteDisplayPosts = useMemo<DisplayPost[]>(() => {
    if (!remotePosts.length) return [];
    return remotePosts.map((post) => ({
      id: post.slug,
      title: post.title,
      excerpt: post.excerpt || post.content?.slice(0, 220),
      publishedAt: formatDate(post.publishedAt, dateLocale),
      readTime: estimateReadTime(post),
      category: post.category || "Editorial",
      categoryKey: (post.category || "Editorial").trim().toLowerCase(),
      coverImageUrl: post.coverImageUrl,
      coverImageAlt: post.coverImageAlt || post.title,
      authorName: post.authorName || "Lumiso Team",
      authorTitle: post.authorTitle || "Editorial Team",
      url: post.url,
    }));
  }, [remotePosts, dateLocale]);

  const sampleDisplayPosts = useMemo<DisplayPost[]>(() => {
    if (!fallbackPosts.length) return [];
    return fallbackPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.description,
      publishedAt: post.date,
      readTime: post.readTime,
      category: post.category,
      categoryKey: post.category?.trim().toLowerCase(),
      coverImageUrl: undefined,
      authorName: post.author.name,
      authorTitle: post.author.title,
    }));
  }, [fallbackPosts]);

  const shouldUseFallbackPosts =
    !hasRemoteSource ||
    (!loading &&
      !remotePosts.length &&
      Boolean(error) &&
      sampleDisplayPosts.length > 0);

  const displayPosts = shouldUseFallbackPosts
    ? sampleDisplayPosts
    : remoteDisplayPosts;

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    displayPosts.forEach((post) => {
      if (!post.categoryKey || !post.category) return;
      if (!map.has(post.categoryKey)) {
        map.set(post.categoryKey, post.category);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [displayPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return displayPosts;
    return displayPosts.filter((post) => post.categoryKey === selectedCategory);
  }, [displayPosts, selectedCategory]);

  const aggregatedKeywords = useMemo(() => {
    const keywords = new Set<string>();
    displayPosts.forEach((post) => {
      if (post.category) {
        keywords.add(post.category);
      }
      if (post.title) {
        keywords.add(post.title);
      }
    });
    return Array.from(keywords).join(", ");
  }, [displayPosts]);

  const featuredPost = displayPosts[0];
  const showFeaturedPost = Boolean(featuredPost);
  const gridPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return displayPosts.slice(1);
    }
    return filteredPosts.filter((post) => post.id !== featuredPost?.id);
  }, [displayPosts, filteredPosts, featuredPost?.id, selectedCategory]);

  const renderFeaturedCard = () => {
    if (!showFeaturedPost || !featuredPost) return null;
    const isLink = Boolean(featuredPostUrl);
    const cardHoverClass = isLink
      ? "group-hover:-translate-y-1 group-hover:scale-[1.01]"
      : "hover:-translate-y-1 hover:scale-[1.01]";
    const imageHoverClass = isLink
      ? "group-hover:scale-105"
      : "hover:scale-105";

    const mobileCard = (
      <article
        className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 transform ${cardHoverClass} hover:shadow-lg group-hover:shadow-lg lg:hidden`}
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800"
          style={{ paddingBottom: "62%" }}
        >
          {featuredPost.coverImageUrl ? (
            <img
              src={featuredPost.coverImageUrl}
              alt={featuredPost.coverImageAlt || featuredPost.title}
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${imageHoverClass}`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-brand-teal-200 via-brand-teal-50 to-white dark:from-brand-teal-900/70 dark:via-slate-900 dark:to-slate-900" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal-500">
            {featuredPost.category || "Editorial"}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
            {featuredPost.title}
          </h3>
          {featuredPost.excerpt && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {featuredPost.excerpt}
            </p>
          )}
          {featuredPost.publishedAt && (
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {featuredPost.publishedAt}
            </div>
          )}
          {featuredPostUrl && (
            <span className="mt-6 inline-flex items-center gap-2 text-brand-teal-600 dark:text-brand-teal-400 font-semibold">
              {t("blog.readMore")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H7"
                />
              </svg>
            </span>
          )}
        </div>
      </article>
    );

    const desktopCard = (
      <article
        className={`hidden overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xl transition-shadow duration-300 dark:border-slate-800 dark:bg-slate-900 lg:grid lg:grid-cols-2 lg:gap-10 transform ${cardHoverClass} hover:shadow-2xl group-hover:shadow-2xl`}
      >
        <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          {featuredPost.coverImageUrl ? (
            <img
              src={featuredPost.coverImageUrl}
              alt={featuredPost.coverImageAlt || featuredPost.title}
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${imageHoverClass}`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-500/30 via-brand-teal-400/20 to-transparent" />
          )}
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 dark:bg-slate-900">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-brand-teal-600 dark:text-brand-teal-400">
              <span className="inline-flex items-center justify-center rounded-full bg-brand-teal-50  py-1 text-brand-teal-700 leading-none dark:bg-brand-teal-500/10 dark:text-brand-teal-300">
                {featuredPost.category || "Editorial"}
              </span>
              {featuredPost.publishedAt && (
                <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  {featuredPost.publishedAt}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
              {featuredPost.title}
            </h1>
            {featuredPost.excerpt && (
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {featuredPost.excerpt}
              </p>
            )}
          </div>
          {featuredPostUrl && (
            <span className="mt-8 inline-flex items-center gap-2 text-brand-teal-600 dark:text-brand-teal-400 font-semibold">
              {t("blog.readMore")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H7"
                />
              </svg>
            </span>
          )}
        </div>
      </article>
    );

    const content = (
      <>
        {mobileCard}
        {desktopCard}
      </>
    );

    if (!isLink) {
      return content;
    }

    return (
      <a
        href={featuredPostUrl}
        className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
      >
        {content}
      </a>
    );
  };
  const resolvePostUrl = (post?: DisplayPost) => {
    if (!post) return undefined;
    return post.url || (post.id ? `/blog/${post.id}` : undefined);
  };
  const featuredPostUrl = resolvePostUrl(featuredPost);

  const connectionStatus = () => {
    if (!hasRemoteSource) {
      return t("blog.status.missingSource");
    }
    if (error && !remoteDisplayPosts.length) {
      return t("blog.status.error");
    }
    return undefined;
  };
  const statusMessage = connectionStatus();

  useEffect(() => {
    const baseTitle = t("blog.title") || "Lumiso Blog";
    const subtitle = t("blog.subtitle");
    const canonicalUrl = `${SITE_ORIGIN}/blog`;
    const pageTitle = `${baseTitle} | Lumiso`;
    const breadcrumbGraph = {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Lumiso",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: baseTitle,
          item: canonicalUrl,
        },
      ],
    };
    const blogGraph = {
      "@type": "Blog",
      name: baseTitle,
      description: subtitle,
      url: canonicalUrl,
      inLanguage: language,
    };

    setSeoOverrides({
      title: pageTitle,
      description: subtitle,
      keywords: aggregatedKeywords || undefined,
      ogTitle: pageTitle,
      ogDescription: subtitle,
      canonicalUrl,
      structuredDataGraph: [
        breadcrumbGraph,
        blogGraph,
        {
          "@type": "CollectionPage",
          name: pageTitle,
          description: subtitle,
          url: canonicalUrl,
          inLanguage: language,
        },
      ],
    });

    return () => {
      setSeoOverrides(null);
    };
  }, [t, language, aggregatedKeywords, setSeoOverrides]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Header mode="blog" />
      <main className="mt-16 flex-1 bg-slate-50 dark:bg-slate-950">
        <section className="pt-32 pb-16 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-3 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal-600 dark:text-brand-teal-400">
                {t("blog.tag")}
              </p>
              <h1 className="text-xl font-medium text-slate-900 dark:text-white">
                {t("blog.pageIntro.title")}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("blog.pageIntro.subtitle")}
              </p>
            </div>

            {loading && (
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                <div className="h-72 rounded-3xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                <div className="h-72 rounded-3xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              </div>
            )}

            {!loading && (
              <div className="mt-8 sm:mt-10 lg:mt-12">
                {renderFeaturedCard()}
              </div>
            )}

            {(categories.length > 0 || statusMessage) && (
              <div className="space-y-4 pt-20 mt-12 mb-4">
                {categories.length > 0 && (
                  <>
                    <div className="max-w-2xl">
                      <h2 className="text-xl font-medium text-slate-900 dark:text-white">
                        {t("blog.categorySection.title")}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {t("blog.categorySection.subtitle")}
                      </p>
                    </div>
                    <div className="flex w-full flex-nowrap items-center gap-3 py-2 overflow-x-auto hide-scrollbar">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                          selectedCategory === "all"
                            ? "border-brand-teal-500 bg-brand-teal-500 text-white shadow-md shadow-brand-teal-500/30"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        }`}
                      >
                        {t("blog.allTopics")}
                      </button>
                      {categories.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedCategory(value)}
                          className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            selectedCategory === value
                              ? "border-brand-teal-500 bg-brand-teal-500 text-white shadow-md shadow-brand-teal-500/30"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {statusMessage && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {statusMessage}
                  </p>
                )}
              </div>
            )}

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && gridPosts.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => {
                  const postUrl = resolvePostUrl(post);
                  const isLink = Boolean(postUrl);
                  const cardHoverClass = isLink
                    ? "group-hover:-translate-y-1 group-hover:scale-[1.01]"
                    : "hover:-translate-y-1 hover:scale-[1.01]";
                  const imageHoverClass = isLink
                    ? "group-hover:scale-105"
                    : "hover:scale-105";

                  const card = (
                    <article
                      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transform transition-transform duration-300 ${cardHoverClass} hover:shadow-lg group-hover:shadow-lg dark:border-slate-800 dark:bg-slate-900`}
                    >
                      <div
                        className="relative w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800"
                        style={{ paddingBottom: "62%" }}
                      >
                        {post.coverImageUrl ? (
                          <img
                            src={post.coverImageUrl}
                            alt={post.coverImageAlt || post.title}
                            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${imageHoverClass}`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-brand-teal-200 via-brand-teal-50 to-white dark:from-brand-teal-900/70 dark:via-slate-900 dark:to-slate-900" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal-500">
                          {post.category || "Editorial"}
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                            {post.excerpt}
                          </p>
                        )}
                        {post.publishedAt && (
                          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            {post.publishedAt}
                          </div>
                        )}
                        {postUrl && (
                          <span className="mt-6 inline-flex items-center gap-2 text-brand-teal-600 dark:text-brand-teal-400 font-semibold">
                            {t("blog.readMore")}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H7"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </article>
                  );

                  if (!isLink) {
                    return React.cloneElement(card, { key: post.id });
                  }

                  return (
                    <a
                      key={post.id}
                      href={postUrl}
                      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
                    >
                      {card}
                    </a>
                  );
                })}
              </div>
            )}

            {!loading &&
              selectedCategory !== "all" &&
              gridPosts.length === 0 && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  {t("blog.noPostsInCategory")}
                </p>
              )}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
