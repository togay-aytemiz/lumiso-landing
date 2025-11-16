import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BlogPost, fetchBlogPosts, isStrapiConfigured } from '../lib/strapi';

type UseBlogPostsOptions = {
  limit?: number;
};

export const useBlogPosts = (options: UseBlogPostsOptions = {}) => {
  const { language } = useAppContext();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(isStrapiConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStrapiConfigured) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetchBlogPosts({ limit: options.limit, locale: language, signal: controller.signal })
      .then((remotePosts) => {
        if (!isMounted) return;
        setPosts(remotePosts);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        if (err.name === 'AbortError') return;
        setError(err.message || 'Unable to load blog posts');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language, options.limit]);

  const hasRemotePosts = posts.length > 0;

  return {
    posts,
    loading,
    error,
    hasRemotePosts,
    hasRemoteSource: isStrapiConfigured,
  };
};
