import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CTA from "../components/CTA";
import { useAppContext } from "../contexts/AppContext";
import { BlogPost, fetchBlogPostBySlug } from "../lib/strapi";

interface BlogArticlePageProps {
  slug: string;
}

type ArticleBlock = {
  __component?: string;
  [key: string]: unknown;
};

type MediaAsset = {
  url: string;
  alt?: string;
  caption?: string;
  mime?: string;
};

type SliderItem = MediaAsset & {
  id?: string | number;
  label?: string;
  description?: string;
};

const STRAPI_BASE_URL =
  import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, "") ?? "";

const toAbsoluteUrl = (url?: string) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (!STRAPI_BASE_URL) return url;
  return `${STRAPI_BASE_URL}${url}`;
};

const pickMediaAttributes = (
  input?: Record<string, unknown>
): MediaAsset | undefined => {
  if (!input) return undefined;
  const candidate = input as {
    url?: string;
    alternativeText?: string;
    caption?: string;
    mime?: string;
  };
  const resolvedUrl = toAbsoluteUrl(candidate.url);
  if (!resolvedUrl) return undefined;
  return {
    url: resolvedUrl,
    alt: candidate.alternativeText,
    caption: candidate.caption,
    mime: candidate.mime,
  };
};

const extractMediaAssets = (input?: unknown): MediaAsset[] => {
  const visited = new WeakSet<object>();

  const walk = (value?: unknown): MediaAsset[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      if (visited.has(value as object)) {
        return [];
      }
      visited.add(value as object);
      return value
        .map((entry) => walk(entry))
        .flat()
        .filter((asset): asset is MediaAsset => Boolean(asset?.url));
    }
    if (typeof value === "object" && value !== null) {
      if (visited.has(value as object)) {
        return [];
      }
      visited.add(value as object);
      const candidate = value as Record<string, unknown>;

      if ("data" in candidate && candidate.data) {
        const data = candidate.data as unknown;
        if (Array.isArray(data)) {
          return data
            .map((entry) => walk(entry))
            .flat()
            .filter((asset): asset is MediaAsset => Boolean(asset?.url));
        }
        if (typeof data === "object" && data !== null) {
          return walk(data);
        }
      }

      const direct = pickMediaAttributes(candidate);
      if (direct?.url) {
        return [direct];
      }

      return Object.values(candidate)
        .map((entry) => walk(entry))
        .flat()
        .filter((asset): asset is MediaAsset => Boolean(asset?.url));
    }
    return [];
  };

  return walk(input);
};

const extractMediaAsset = (input?: unknown): MediaAsset | undefined => {
  const assets = extractMediaAssets(input);
  return assets[0];
};

const isVideoAsset = (asset: MediaAsset) => {
  if (asset.mime) {
    return asset.mime.startsWith("video");
  }
  return /\.(mp4|mov|webm|m4v|ogg)$/i.test(asset.url);
};

const sliderCollectionKeys = [
  "files",
  "items",
  "slides",
  "mediaItems",
  "media_items",
  "gallery",
  "galleryItems",
  "mediaGallery",
  "images",
];

const MEDIA_COMPONENT_NAMES = [
  "shared.media-element",
  "shared.media",
  "shared.media-block",
  "blog.media-element",
  "content.media-element",
];

const SLIDER_COMPONENT_NAMES = [
  "shared.media-slider",
  "shared.slider",
  "shared.gallery-slider",
  "blog.media-slider",
  "content.media-slider",
];

const extractSliderItemsFromBlock = (block: ArticleBlock): SliderItem[] => {
  for (const key of sliderCollectionKeys) {
    const value = block[key];
    if (Array.isArray(value) && value.length) {
      const items = value
        .map((entry) => {
          if (!entry || typeof entry !== "object") return undefined;
          const record = entry as Record<string, unknown>;
          const asset = extractMediaAsset(
            record.media ??
              record.image ??
              record.asset ??
              record.file ??
              entry
          );
          if (!asset?.url) return undefined;
          return {
            ...asset,
            caption:
              typeof record.caption === "string"
                ? record.caption
                : asset.caption,
            description:
              typeof record.description === "string"
                ? record.description
                : undefined,
            label:
              typeof record.title === "string"
                ? record.title
                : typeof record.label === "string"
                ? record.label
                : undefined,
            id:
              typeof record.id === "number" || typeof record.id === "string"
                ? record.id
                : undefined,
          };
        })
        .filter((item): item is SliderItem => Boolean(item?.url));
      if (items.length) {
        return items;
      }
    }
  }

  const groupedFiles = extractMediaAssets(block.files);
  if (groupedFiles.length) {
    return groupedFiles;
  }

  const groupedMedia = extractMediaAssets(block.media);
  if (groupedMedia.length) {
    return groupedMedia;
  }

  const nestedAssets = extractMediaAssets(block);
  if (nestedAssets.length > 1) {
    return nestedAssets;
  }

  return [];
};

interface MediaSliderBlockProps {
  items: SliderItem[];
  title?: string;
  description?: string;
}

const MediaSliderBlock: React.FC<MediaSliderBlockProps> = ({
  items,
  title,
  description,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  if (!items.length) return null;

  const wrapIndex = (index: number) => {
    const total = items.length;
    if (!total) return 0;
    return (index + total) % total;
  };

  const safeIndex = wrapIndex(activeIndex);
  const activeItem = items[safeIndex];
  const hasMultiple = items.length > 1;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((current) => wrapIndex(current - 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((current) => wrapIndex(current + 1));
    }
  };

  const selectSlide = (index: number) => {
    setActiveIndex(wrapIndex(index));
  };

  const renderCaption = () => {
    if (
      !activeItem.label &&
      !activeItem.caption &&
      !activeItem.description
    ) {
      return null;
    }
    return (
      <div className="space-y-1 text-center" aria-live="polite">
        {activeItem.label && (
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {activeItem.label}
          </p>
        )}
        {activeItem.caption && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {activeItem.caption}
          </p>
        )}
        {activeItem.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeItem.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-lg shadow-slate-900/10">
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-slate-600 dark:text-slate-300">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        <div
          className="relative focus:outline-none"
          tabIndex={hasMultiple ? 0 : -1}
          onKeyDown={handleKeyDown}
          aria-roledescription="carousel"
          aria-live="polite"
          aria-label={title ? `${title} gallery` : "Article media slider"}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            {isVideoAsset(activeItem) ? (
              <video
                key={activeItem.url}
                src={activeItem.url}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={activeItem.url}
                alt={
                  activeItem.alt ||
                  activeItem.caption ||
                  title ||
                  "Gallery slide"
                }
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            {hasMultiple && (
              <span className="absolute top-4 right-4 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {safeIndex + 1} / {items.length}
              </span>
            )}
          </div>
        </div>
        {renderCaption()}
        {hasMultiple && (
          <div
            className="mt-2 flex gap-3 overflow-x-auto pb-2"
            aria-label="Select slide"
          >
            {items.map((item, thumbIndex) => {
              const isActive = thumbIndex === safeIndex;
              return (
                <button
                  key={`slider-thumb-${thumbIndex}`}
                  type="button"
                  onClick={() => selectSlide(thumbIndex)}
                  className={`relative flex-shrink-0 rounded-2xl border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-500 ${
                    isActive
                      ? "border-brand-teal-500"
                      : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                  aria-label={`Go to slide ${thumbIndex + 1}`}
                >
                  <img
                    src={item.url}
                    alt={item.alt || item.caption || `Slide ${thumbIndex + 1}`}
                    className={`h-16 w-24 rounded-xl object-cover ${
                      isActive ? "opacity-100" : "opacity-70"
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                  {isVideoAsset(item) && (
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                      Video
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const formatDate = (dateValue?: string) => {
  if (!dateValue) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch {
    return dateValue;
  }
};

const stripMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();
};

const renderRichTextBlock = (body: string, keyPrefix: string) => {
  const segments = body.split(/\n{2,}/);
  return segments.map((segment, index) => {
    const trimmed = segment.trim();
    if (!trimmed) return null;

    if (/^###\s+/.test(trimmed)) {
      return (
        <h3
          key={`${keyPrefix}-h3-${index}`}
          className="text-xl font-semibold text-slate-900 dark:text-white mt-10"
        >
          {stripMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
    }

    if (/^##\s+/.test(trimmed)) {
      return (
        <h2
          key={`${keyPrefix}-h2-${index}`}
          className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-12"
        >
          {stripMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h2>
      );
    }

    if (/^#\s+/.test(trimmed)) {
      return (
        <h1
          key={`${keyPrefix}-h1-${index}`}
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-14"
        >
          {stripMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h1>
      );
    }

    const lines = trimmed.split("\n").map((line) => line.trim());
    const isList = lines.every((line) => /^[-\*]\s+/.test(line));

    if (isList) {
      return (
        <ul
          key={`${keyPrefix}-list-${index}`}
          className="mt-6 list-disc space-y-3 pl-6 text-slate-700 dark:text-slate-300"
        >
          {lines.map((line, lineIndex) => (
            <li key={`${keyPrefix}-list-item-${index}-${lineIndex}`}>
              {stripMarkdown(line.replace(/^[-\*]\s+/, ""))}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={`${keyPrefix}-p-${index}`}
        className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
      >
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
  const [headerTone, setHeaderTone] = useState<"light" | "dark">("light");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchBlogPostBySlug(slug)
      .then((article) => {
        if (!isMounted) return;
        setPost(article);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setError(err.message || "Unable to load article");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const formattedDate = useMemo(
    () => formatDate(post?.publishedAt),
    [post?.publishedAt]
  );

  useEffect(() => {
    if (!post?.coverImageUrl) {
      setHeaderTone("light");
      return;
    }

    let isActive = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.referrerPolicy = "no-referrer";
    image.src = post.coverImageUrl;

    image.onload = () => {
      if (!isActive) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Missing canvas context");

        const sampleWidth = 32;
        const aspectRatio =
          image.naturalHeight && image.naturalWidth
            ? image.naturalHeight / image.naturalWidth
            : 1;
        const sampleHeight = Math.max(1, Math.round(sampleWidth * aspectRatio));

        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        ctx.drawImage(image, 0, 0, sampleWidth, sampleHeight);

        const imageData = ctx.getImageData(
          0,
          0,
          sampleWidth,
          sampleHeight
        ).data;
        const totalPixels = imageData.length / 4;
        let totalLuminance = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          totalLuminance += 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        const averageLuminance = totalLuminance / totalPixels;
        setHeaderTone(averageLuminance > 165 ? "dark" : "light");
      } catch {
        setHeaderTone("light");
      }
    };

    image.onerror = () => {
      if (!isActive) return;
      setHeaderTone("light");
    };

    return () => {
      isActive = false;
    };
  }, [post?.coverImageUrl]);

  const resolveBlockMediaAsset = (
    block: ArticleBlock
  ): MediaAsset | undefined => {
    const record = block as Record<string, unknown>;
    const candidateKeys = [
      "media",
      "image",
      "asset",
      "file",
      "video",
      "cover",
      "picture",
      "illustration",
    ];
    for (const key of candidateKeys) {
      const asset = extractMediaAsset(record[key]);
      if (asset?.url) {
        return asset;
      }
    }
    return extractMediaAsset(block);
  };

  const renderMediaElementBlock = (
    block: ArticleBlock,
    index: number,
    assetOverride?: MediaAsset
  ) => {
    const asset = assetOverride ?? resolveBlockMediaAsset(block);
    if (!asset?.url) return null;
    const record = block as Record<string, unknown>;
    const caption =
      typeof record.caption === "string" ? record.caption : asset.caption;
    const description =
      typeof record.description === "string" ? record.description : undefined;
    const isFullWidth =
      record.fullWidth === true ||
      record.layout === "wide" ||
      record.alignment === "full" ||
      record.full_bleed === true;
    const containerClasses = `space-y-4 ${
      isFullWidth ? "md:-mx-6 lg:-mx-12" : ""
    }`;

    return (
      <figure key={`media-${index}`} className={containerClasses}>
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          {isVideoAsset(asset) ? (
            <video
              src={asset.url}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={asset.url}
              alt={asset.alt || caption || "Article media"}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        {(caption || description) && (
          <figcaption className="text-center text-sm text-slate-600 dark:text-slate-300">
            {caption && (
              <span className="block font-semibold text-slate-800 dark:text-white">
                {caption}
              </span>
            )}
            {description && (
              <span className="mt-1 block text-slate-500 dark:text-slate-400">
                {description}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    );
  };

  const renderSliderBlock = (
    block: ArticleBlock,
    items: SliderItem[],
    index: number
  ) => {
    if (!items.length) return null;
    const blockTitle =
      typeof block.title === "string" ? block.title : undefined;
    const blockDescription =
      typeof block.description === "string" ? block.description : undefined;
    return (
      <MediaSliderBlock
        key={`slider-${index}`}
        items={items}
        title={blockTitle}
        description={blockDescription}
      />
    );
  };

  const showHeroSkeleton = loading && !post;
  const hasPost = Boolean(post);
  const heroCategory = post?.category || (hasPost ? "Editorial" : undefined);
  const heroTitle = post?.title || (hasPost ? "Untitled article" : undefined);
  const heroDescription = post?.description;
  const heroReadTime = post?.readTime;

  const renderQuoteBlock = (block: ArticleBlock, index: number) => {
    const body = typeof block.body === "string" ? block.body : undefined;
    if (!body) return null;
    return (
      <figure
        key={`quote-${index}`}
        className="my-10 rounded-3xl bg-slate-100 dark:bg-slate-800 p-8 text-center text-lg italic text-slate-700 dark:text-slate-200"
      >
        <blockquote>“{body.trim()}”</blockquote>
        {typeof block.title === "string" && (
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
          {renderRichTextBlock(post.content, "fallback")}
        </div>
      );
    }

    return post.blocks
      .map((block, index) => {
        if (!block || typeof block !== "object") return null;
        const componentName =
          typeof block.__component === "string" ? block.__component : "";
        if (
          componentName === "shared.rich-text" &&
          typeof block.body === "string"
        ) {
          return (
            <div key={`rich-text-${index}`} className="space-y-6">
              {renderRichTextBlock(block.body, `block-${index}`)}
            </div>
          );
        }
        if (componentName === "shared.quote") {
          return renderQuoteBlock(block, index);
        }

        const sliderItems = extractSliderItemsFromBlock(block);
        if (
          sliderItems.length &&
          (SLIDER_COMPONENT_NAMES.includes(componentName) ||
            componentName.includes("slider") ||
            componentName.includes("gallery") ||
            sliderItems.length > 1)
        ) {
          return renderSliderBlock(block, sliderItems, index);
        }

        const mediaAsset = resolveBlockMediaAsset(block);
        if (
          mediaAsset &&
          (MEDIA_COMPONENT_NAMES.includes(componentName) ||
            componentName.includes("media") ||
            componentName.includes("image") ||
            !componentName)
        ) {
          return renderMediaElementBlock(block, index, mediaAsset);
        }

        return null;
      })
      .filter(Boolean);
  }, [post?.blocks, post?.content]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header mode="blog" initialContentTone={headerTone} />
      <main className="-mt-16">
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[480px] sm:min-h-[560px] lg:min-h-[640px]">
          <div className="absolute inset-0">
            {post?.coverImageUrl && (
              <img
                src={post.coverImageUrl}
                alt={post.coverImageAlt || post.title}
                className="h-full w-full object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-end">
            <div className="max-w-3xl flex h-full min-h-[320px] flex-col gap-6 mt-20 sm:mt-24 lg:mt-32 pb-16">
              <div>
                {showHeroSkeleton ? (
                  <div className="inline-flex h-10 w-40 animate-pulse rounded-full bg-white/20" />
                ) : (
                  <a
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-white/25"
                  >
                    ← {t("blog.viewAll")}
                  </a>
                )}
              </div>
              <div className="mt-auto space-y-6">
                {showHeroSkeleton ? (
                  <div className="space-y-5 animate-pulse">
                    <div className="h-3 w-24 rounded-full bg-white/25" />
                    <div className="space-y-3">
                      <div className="h-10 w-3/4 rounded bg-white/30" />
                      <div className="h-8 w-2/3 rounded bg-white/20" />
                    </div>
                    <div className="h-4 w-4/5 rounded bg-white/20" />
                    <div className="flex flex-wrap gap-4">
                      <div className="h-4 w-20 rounded bg-white/20" />
                      <div className="h-4 w-20 rounded bg-white/20" />
                    </div>
                  </div>
                ) : hasPost ? (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal-300">
                      {heroCategory}
                    </p>
                    <div>
                      <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                        {heroTitle}
                      </h1>
                      {heroDescription && (
                        <p className="mt-4 text-lg text-white/80">
                          {heroDescription}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      {formattedDate && <span>{formattedDate}</span>}
                      {heroReadTime && (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-white/70" />
                          {heroReadTime}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                      Blog
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                      Article unavailable
                    </h1>
                    <p className="text-lg text-white/80">
                      This story may be unpublished or no longer available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-12 shadow-xl shadow-slate-900/10">
              {loading && (
                <div className="space-y-8 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-8 w-3/5 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="flex gap-4">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, paragraphIndex) => (
                      <div
                        key={`paragraph-skeleton-${paragraphIndex}`}
                        className={`h-4 rounded bg-slate-200 dark:bg-slate-800 ${
                          paragraphIndex === 4 ? "w-2/3" : "w-full"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="h-72 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, blockIndex) => (
                      <div
                        key={`block-skeleton-${blockIndex}`}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-800/60"
                      >
                        <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
                          <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && error && (
                <p className="text-center text-sm text-rose-500">{error}</p>
              )}

              {!loading && !post && !error && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Article not found
                  </h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                    This link may be broken or the article is still being
                    drafted.
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
                      {post.excerpt || "This article will be updated soon."}
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
