export interface StrapiMediaData {
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
}

type StrapiMedia =
  | {
      data?:
        | {
            attributes?: StrapiMediaData;
          }
        | {
            attributes?: StrapiMediaData;
          }[]
        | null;
    }
  | StrapiMediaData
  | null
  | undefined;

interface StrapiAuthorAttributes {
  name?: string;
  title?: string;
  bio?: string;
  avatar?: StrapiMedia;
  [key: string]: unknown;
}

type MaybeStrapiEntityAttributes<TAttributes> = StrapiEntity<TAttributes> | (TAttributes & { id?: number }) | null | undefined;

interface StrapiRelation<TAttributes = Record<string, unknown>> {
  data?: {
    id: number;
    attributes?: TAttributes;
  } | null;
}

interface StrapiBlogPostAttributes {
  title?: string;
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
  content?: string;
  body?: string;
  excerpt?: string;
  description?: string;
  readTime?: string | number;
  readingTime?: string | number;
  category?: string | StrapiRelation<{ name?: string }> | { name?: string };
  tags?: string[];
  heroImage?: StrapiMedia;
  cover?: StrapiMedia;
  coverImage?: StrapiMedia;
  thumbnail?: StrapiMedia;
  author?: StrapiRelation<StrapiAuthorAttributes> | StrapiAuthorAttributes;
  externalUrl?: string;
  url?: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

interface StrapiEntity<TAttributes> {
  id: number;
  attributes?: TAttributes;
}

interface StrapiCollectionResponse<TAttributes> {
  data?: Array<StrapiEntity<TAttributes>>;
  meta?: Record<string, unknown>;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  publishedAt?: string;
  updatedAt?: string;
  excerpt?: string;
  description?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  content?: string;
  blocks?: Array<Record<string, unknown>>;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorName?: string;
  authorTitle?: string;
  authorAvatarUrl?: string;
  url?: string;
}

export type FetchBlogPostsOptions = {
  limit?: number;
  locale?: string;
  populate?: string;
  signal?: AbortSignal;
  filters?: Record<string, string | undefined>;
};

const BLOG_COLLECTION = import.meta.env.VITE_STRAPI_BLOG_COLLECTION || 'blog-posts';
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, '') ?? '';
const STRAPI_API_TOKEN = import.meta.env.VITE_STRAPI_TOKEN?.trim();
const STRAPI_PUBLICATION_STATE = import.meta.env.VITE_STRAPI_PUBLICATION_STATE?.trim().toLowerCase();

export const isStrapiConfigured = Boolean(STRAPI_BASE_URL);

const getAttributesFromMaybeEntity = <TAttributes>(input?: MaybeStrapiEntityAttributes<TAttributes>): TAttributes | undefined => {
  if (!input) return undefined;
  if (typeof input === 'object' && 'attributes' in (input as StrapiEntity<TAttributes>) && (input as StrapiEntity<TAttributes>).attributes) {
    return (input as StrapiEntity<TAttributes>).attributes as TAttributes;
  }
  return input as TAttributes;
};

const resolveRelationAttributes = <TAttributes>(input?: StrapiRelation<TAttributes> | TAttributes | null): TAttributes | undefined => {
  if (!input) return undefined;
  if (typeof input === 'object' && 'data' in (input as StrapiRelation<TAttributes>)) {
    const relation = input as StrapiRelation<TAttributes>;
    if (!relation.data) return undefined;
    return getAttributesFromMaybeEntity(relation.data as MaybeStrapiEntityAttributes<TAttributes>);
  }
  return input as TAttributes;
};

const resolveMediaAttributes = (media?: StrapiMedia | StrapiRelation<StrapiMediaData>): StrapiMediaData | undefined => {
  if (!media) return undefined;
  if (typeof media === 'object' && 'data' in media && media.data) {
    const data = media.data;
    if (Array.isArray(data)) {
      return data[0]?.attributes ?? undefined;
    }
    return data.attributes ?? undefined;
  }
  if (typeof media === 'object' && 'url' in media) {
    return media as StrapiMediaData;
  }
  return undefined;
};

const resolveMediaUrl = (media?: StrapiMedia | StrapiRelation<StrapiMediaData>): { url?: string; alternativeText?: string } => {
  const mediaData = resolveMediaAttributes(media);
  if (!mediaData?.url) {
    return {};
  }

  const url = mediaData.url.startsWith('http')
    ? mediaData.url
    : `${STRAPI_BASE_URL}${mediaData.url}`;

  return {
    url,
    alternativeText: mediaData.alternativeText,
  };
};

const extractCategory = (category?: string | StrapiRelation<{ name?: string }> | { name?: string }): string | undefined => {
  if (!category) return undefined;
  if (typeof category === 'string') return category;
  const attributes = resolveRelationAttributes(category);
  return attributes?.name;
};

const normalizeReadTime = (input?: string | number): string | undefined => {
  if (input === undefined || input === null) {
    return undefined;
  }
  if (typeof input === 'number' && !Number.isNaN(input)) {
    return `${input} min read`;
  }
  if (typeof input === 'string') {
    return input;
  }
  return undefined;
};

const normalizeAuthor = (author?: StrapiRelation<StrapiAuthorAttributes> | StrapiAuthorAttributes) => {
  const attributes = resolveRelationAttributes(author) ?? {};
  const avatar = resolveMediaUrl(attributes.avatar);
  return {
    authorName: attributes.name,
    authorTitle: attributes.title,
    authorAvatarUrl: avatar.url,
  };
};

const extractRichTextFromBlocks = (blocks?: Array<Record<string, unknown>>): string | undefined => {
  if (!Array.isArray(blocks)) return undefined;
  const sections = blocks
    .map((block) => {
      if (block && typeof block === 'object' && block.__component === 'shared.rich-text' && typeof block.body === 'string') {
        return block.body.trim();
      }
      return undefined;
    })
    .filter((section): section is string => Boolean(section));
  if (!sections.length) return undefined;
  return sections.join('\n\n');
};

const normalizeBlogPost = (entity: StrapiEntity<StrapiBlogPostAttributes>): BlogPost => {
  const attributes = getAttributesFromMaybeEntity(entity as MaybeStrapiEntityAttributes<StrapiBlogPostAttributes>) ?? {};
  const coverImage = resolveMediaUrl(attributes.coverImage || attributes.cover || attributes.heroImage || attributes.thumbnail);
  const author = normalizeAuthor(attributes.author);

  const slug = attributes.slug || `post-${entity.id}`;
  const publishedAt = attributes.publishedAt || attributes.updatedAt;
  const excerpt = attributes.excerpt || attributes.description;
  const readTime = normalizeReadTime(attributes.readTime ?? attributes.readingTime);
  const url = attributes.url || attributes.externalUrl || (slug ? `/blog/${slug}` : undefined);
  const category = extractCategory(attributes.category);
  const blocks = Array.isArray(attributes.blocks) ? attributes.blocks : undefined;
  const fallbackContent = extractRichTextFromBlocks(blocks);

  return {
    id: entity.id,
    slug,
    title: attributes.title || 'Untitled article',
    publishedAt,
    updatedAt: attributes.updatedAt,
    excerpt,
    description: attributes.description,
    readTime,
    category,
    tags: Array.isArray(attributes.tags) ? attributes.tags : undefined,
    content: (attributes.content as string | undefined) || (attributes.body as string | undefined) || fallbackContent,
    blocks,
    coverImageUrl: coverImage.url,
    coverImageAlt: coverImage.alternativeText,
    url,
    ...author,
  };
};

type StrapiRequestError = Error & { status?: number; body?: string };

const isValidPublicationState = (state?: string | null): state is 'live' | 'preview' => {
  return state === 'live' || state === 'preview';
};

const shouldRetryWithWildcardPopulate = (error: unknown, currentPopulate?: string) => {
  if (!currentPopulate) return false;
  const normalized = currentPopulate.trim().toLowerCase();
  if (!normalized.startsWith('deep')) return false;
  const err = error as StrapiRequestError | undefined;
  if (!err || err.status !== 400) return false;
  const body = err.body || err.message || '';
  return /invalid key/i.test(body) && /populate/i.test(body);
};

export const fetchBlogPosts = async (
  options: FetchBlogPostsOptions = {}
): Promise<BlogPost[]> => {
  if (!isStrapiConfigured) {
    throw new Error('Strapi base URL is not configured (VITE_STRAPI_URL)');
  }

  const { limit, locale, populate, signal } = options;
  const collection = BLOG_COLLECTION.replace(/^\/+|\/+$/g, '');
  const endpoint = `${STRAPI_BASE_URL}/api/${collection}`;

  const buildParams = (overridePopulate?: string) => {
    const params = new URLSearchParams();
    params.set('sort', 'publishedAt:desc');
    const populateValue = overridePopulate ?? populate;
    if (populateValue) {
      params.set('populate', populateValue);
    } else {
      params.set('populate[blocks][populate]', '*');
      params.set('populate[cover][populate]', '*');
      params.set('populate[author][populate]', 'avatar');
      params.set('populate[category][populate]', '*');
    }
    if (limit) {
      params.set('pagination[pageSize]', String(limit));
    }
    if (locale) {
      params.set('locale', locale);
    }
    if (options.filters) {
      Object.entries(options.filters).forEach(([paramKey, value]) => {
        if (value) {
          params.set(paramKey, value);
        }
      });
    }
    if (isValidPublicationState(STRAPI_PUBLICATION_STATE)) {
      params.set('publicationState', STRAPI_PUBLICATION_STATE);
    }
    return params;
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const requestOnce = async (overridePopulate?: string) => {
    const params = buildParams(overridePopulate);
    const url = `${endpoint}?${params.toString()}`;
    const response = await fetch(url, { headers, signal });
    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      const error = new Error(`Failed to load blog posts: ${response.status} ${message}`) as StrapiRequestError;
      error.status = response.status;
      error.body = message;
      throw error;
    }
    return (await response.json()) as StrapiCollectionResponse<StrapiBlogPostAttributes>;
  };

  let payload: StrapiCollectionResponse<StrapiBlogPostAttributes>;
  try {
    payload = await requestOnce();
  } catch (error) {
    if (shouldRetryWithWildcardPopulate(error, populate)) {
      payload = await requestOnce('*');
    } else {
      throw error;
    }
  }

  const items = payload.data ?? [];
  return items.map(normalizeBlogPost);
};

export const fetchBlogPostBySlug = async (
  slug: string,
  options: FetchBlogPostsOptions = {}
): Promise<BlogPost | null> => {
  if (!slug) return null;
  const posts = await fetchBlogPosts({
    ...options,
    populate: options.populate,
    limit: 1,
    filters: {
      ...options.filters,
      'filters[slug][$eq]': slug,
    },
  });
  return posts[0] ?? null;
};
