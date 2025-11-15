import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppContext } from "../contexts/AppContext";
import { CheckCircleIcon } from "./icons/CheckCircleIcon";
import SectionBadge from "./ui/SectionBadge";
import CTAButton from "./ui/CTAButton";
import PrismaticBurst from "./PrismaticBurst";
import { useIsMobile } from "../hooks/useIsMobile";

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="24"
    height="24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DotsHorizontalIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="24"
    height="24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
);

const HeroScreenshotPlaceholder: React.FC = () => (
  <div className="w-full max-w-5xl mx-auto mt-4 sm:mt-16 rounded-[22px] border border-white/10 bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
    <div className="bg-slate-900/60 text-white px-6 py-3 flex items-center justify-between text-sm">
      <p className="font-semibold">App screenshot coming soon</p>
      <span className="text-slate-300">
        Drop your image into `public/hero-screenshot.png`
      </span>
    </div>
    <div className="relative aspect-[16/9] flex items-center justify-center bg-slate-900/40">
      <div className="w-3/4 text-center space-y-3">
        <p className="text-slate-300 text-lg font-semibold">
          Reserved for product preview
        </p>
        <p className="text-slate-400 text-base">
          Replace this placeholder with your hero screenshot to immediately show
          the UI. Suggested size: 1600×900 PNG with transparent corners.
        </p>
      </div>
    </div>
  </div>
);

const HERO_IMAGE_WIDTHS = [768, 1200, 1600, 2000];
const HERO_IMAGE_QUALITY = 70;

const heroBackgroundImageUrls = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1475274226786-e636f48a5645?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1623783356340-95375aac85ce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1594296459195-8b2f3fbf1c86?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1699401984773-f6bf9a20b774?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const withImageParams = (url: string, width: number) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&fit=crop&q=${HERO_IMAGE_QUALITY}&w=${width}`;
};

const heroBackgroundImages = heroBackgroundImageUrls.map((url) => ({
  original: url,
  src: withImageParams(url, 1600),
  srcSet: HERO_IMAGE_WIDTHS.map(
    (width) => `${withImageParams(url, width)} ${width}w`
  ).join(", "),
}));

const Hero: React.FC = () => {
  const { t } = useAppContext();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>(() =>
    heroBackgroundImages.map((_, index) => index === 0)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const startTimer = useCallback(() => {
    if (typeof window === "undefined") return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1) % heroBackgroundImages.length
      );
    }, 5000);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isMobile) {
      setActiveIndex(0);
      setVisibleIndex(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    startTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prefersReducedMotion, startTimer, isMobile]);

  const handleImageLoad = useCallback(
    (index: number) => {
      setLoadedImages((prev) => {
        if (prev[index]) return prev;
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
      if (index === activeIndex) {
        setVisibleIndex(index);
      }
    },
    [activeIndex]
  );

  useEffect(() => {
    if (isMobile) return;
    if (loadedImages[activeIndex]) {
      setVisibleIndex(activeIndex);
    }
  }, [activeIndex, loadedImages, isMobile]);

  return (
    <section className="hero-critical relative bg-slate-950 text-white overflow-hidden pt-16 min-h-screen flex flex-col">
      <div className="hero-background absolute inset-0">
        {isMobile ? (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <PrismaticBurst
              animationType="rotate3d"
              intensity={2}
              speed={0.5}
              distort={1}
              paused={false}
              offset={{ x: 0, y: 0 }}
              hoverDampness={0.25}
              rayCount={24}
              mixBlendMode="lighten"
              colors={["#ff007a", "#4d3dff", "#ffffff"]}
              className="absolute inset-0"
            />
          </div>
        ) : (
          <>
            {heroBackgroundImages.map(({ src, srcSet }, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                  index === visibleIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={src}
                  srcSet={srcSet}
                  sizes="100vw"
                  width={1600}
                  height={900}
                  alt={t("hero.imageAlt")}
                  className="w-full h-full object-cover opacity-60 dark:opacity-50"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            ))}
            <div className="hero-gradient absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/10"></div>
          </>
        )}
      </div>

      <div className="hero-inner container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col flex-grow">
        <div className="text-center pt-12 sm:pt-20">
          <div className="max-w-4xl mx-auto">
            <div
              className="inline-block mb-4 animate-slide-in-fade"
              style={{ animationDelay: "100ms" }}
            >
              <SectionBadge variant="glass">{t("hero.tag")}</SectionBadge>
            </div>
            <h1
              className="hero-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight animate-slide-in-fade"
              style={{ animationDelay: "300ms" }}
            >
              {t("hero.title")}
            </h1>
            <p
              className="hero-subtitle mt-8 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 animate-slide-in-fade"
              style={{ animationDelay: "500ms" }}
            >
              {t("hero.subtitle")}
            </p>
            <div
              className="hero-cta-group mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-fade"
              style={{ animationDelay: "700ms" }}
            >
              <CTAButton
                href="#contact"
                variant="primary"
                fullWidth
                className="hero-primary-cta sm:w-auto"
              >
                {t("hero.cta.primary")}
              </CTAButton>
              <CTAButton
                href="https://calendly.com/photoflow/demo"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                fullWidth
                className="hero-secondary-cta sm:w-auto"
              >
                {t("hero.cta.secondary")}
              </CTAButton>
            </div>
            <div
              className="hero-cta-subtext mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-base font-medium text-slate-200 animate-slide-in-fade"
              style={{ animationDelay: "800ms" }}
            >
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-brand-teal-400 flex-shrink-0" />
                <p>{t("hero.cta.subtext.line1")}</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-brand-teal-400 flex-shrink-0" />
                <p>{t("hero.cta.subtext.line2")}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hero-dashboard mt-20 animate-slide-in-fade"
          style={{ animationDelay: "900ms" }}
        >
          <HeroScreenshotPlaceholder />
        </div>
      </div>
    </section>
  );
};

export default Hero;
