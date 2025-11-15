import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppContext } from "../contexts/AppContext";
import { CheckCircleIcon } from "./icons/CheckCircleIcon";
import SectionBadge from "./ui/SectionBadge";
import CTAButton from "./ui/CTAButton";

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

const heroVideos = [
  {
    id: "studio-light-trails",
    poster: "/videos/v1-hero.jpg",
    sources: [
      { type: "video/webm", src: "/videos/v1-hero.webm" },
      { type: "video/mp4", src: "/videos/v1-hero.mp4" },
    ],
  },
  {
    id: "dolly-panels",
    poster: "/videos/v2-hero.jpg",
    sources: [
      { type: "video/webm", src: "/videos/v2-hero.webm" },
      { type: "video/mp4", src: "/videos/v2-hero.mp4" },
    ],
  },
  {
    id: "city-rush",
    poster: "/videos/v3-hero.jpg",
    sources: [
      { type: "video/webm", src: "/videos/v3-hero.webm" },
      { type: "video/mp4", src: "/videos/v3-hero.mp4" },
    ],
  },
];

const VIDEO_ROTATION_INTERVAL = 12000;

const Hero: React.FC = () => {
  const { t } = useAppContext();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const rotationRef = useRef<number | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hasMultipleVideos = heroVideos.length > 1;
  const activeVideo = heroVideos[activeVideoIndex] ?? heroVideos[0];
  const fallbackPoster = activeVideo?.poster ?? heroVideos[0]?.poster ?? "";
  const activeSources = activeVideo?.sources ?? [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const stopVideoRotation = useCallback(() => {
    if (rotationRef.current) {
      clearInterval(rotationRef.current);
      rotationRef.current = null;
    }
  }, []);

  const startVideoRotation = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!hasMultipleVideos) return;
    stopVideoRotation();
    rotationRef.current = window.setInterval(() => {
      setActiveVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
    }, VIDEO_ROTATION_INTERVAL);
  }, [hasMultipleVideos, stopVideoRotation]);

  useEffect(() => {
    if (prefersReducedMotion || !hasMultipleVideos) {
      setActiveVideoIndex(0);
      stopVideoRotation();
      return;
    }
    startVideoRotation();
    return () => {
      stopVideoRotation();
    };
  }, [hasMultipleVideos, prefersReducedMotion, startVideoRotation, stopVideoRotation]);

  useEffect(() => {
    setIsVideoLoaded(false);
  }, [activeVideoIndex]);

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  return (
    <section className="hero-critical relative bg-slate-950 text-white overflow-hidden pt-16 min-h-screen flex flex-col">
      <div className="hero-background absolute inset-0">
        {!prefersReducedMotion && activeVideo ? (
          <video
            key={activeVideo.id}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? "opacity-60 dark:opacity-50" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            poster={fallbackPoster}
            preload="auto"
            onLoadedData={handleVideoLoaded}
            aria-hidden="true"
          >
            {activeSources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        ) : (
          <img
            src={fallbackPoster}
            alt={t("hero.imageAlt")}
            className="absolute inset-0 h-full w-full object-cover opacity-60 dark:opacity-50"
            loading="eager"
            decoding="async"
          />
        )}
        <div className="hero-gradient absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/10"></div>
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
            {hasMultipleVideos && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {heroVideos.map((video, index) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideoIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full border border-white/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                      activeVideoIndex === index
                        ? "bg-white"
                        : "bg-transparent hover:border-white/70"
                    }`}
                    aria-label={`Show hero background ${index + 1}`}
                  />
                ))}
              </div>
            )}
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
