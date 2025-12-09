import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppContext } from "../contexts/AppContext";
import { SIGN_UP_URL } from "../lib/urls";
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

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 4.5a1 1 0 0 1 1.53-.85l11 7.5a1 1 0 0 1 0 1.7l-11 7.5A1 1 0 0 1 6 19.5V4.5Z" />
  </svg>
);

const HERO_VIDEO_POSTER_DESKTOP = "/hero/Dashboard.webp";
const HERO_VIDEO_POSTER_DESKTOP_FALLBACK = "/hero/Dashboard.png";
const HERO_VIDEO_POSTER_MOBILE = "/hero/Dashboard-mobile.webp";
const HERO_VIDEO_POSTER_MOBILE_FALLBACK = "/hero/Dashboard-mobile.png";
const HERO_VIDEO_SOURCES = [
  { type: "video/webm", src: "/videos/lumiso-hero.webm" },
  { type: "video/mp4", src: "/videos/lumiso-hero.mp4" },
];

const HeroVideoCover: React.FC<{
  alt: string;
  onPlay: () => void;
  eyebrow: string;
  description: string;
  duration: string;
  playLabel: string;
}> = ({ alt, onPlay, eyebrow, description, duration, playLabel }) => (
  <div className="w-full mx-auto mt-4 sm:mt-16 max-w-[1400px] lg:max-w-[1500px]">
    <button
      type="button"
      className="group relative w-full overflow-hidden rounded-[22px] border border-white/8 bg-slate-900/50 shadow-2xl shadow-black/20 aspect-[726/1266] sm:aspect-video ring-0 transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-400"
      onClick={onPlay}
      aria-label={playLabel}
    >
      <picture className="absolute inset-0 block">
        <source srcSet={HERO_VIDEO_POSTER_MOBILE} media="(max-width: 639px)" type="image/webp" />
        <source srcSet={HERO_VIDEO_POSTER_DESKTOP} media="(min-width: 640px)" type="image/webp" />
        <source srcSet={HERO_VIDEO_POSTER_MOBILE_FALLBACK} media="(max-width: 639px)" />
        <img
          src={HERO_VIDEO_POSTER_DESKTOP_FALLBACK}
          alt={alt}
          className="h-full w-full object-cover sm:object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="absolute inset-0 bg-slate-950/45 transition duration-300 group-hover:bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/25 to-slate-950/5 pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 backdrop-blur">
          <ClockIcon className="h-4 w-4" />
          <span>{eyebrow}</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl shadow-black/30 transition duration-300 group-hover:scale-105">
            <PlayIcon className="h-10 w-10 translate-x-[2px]" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg">{description}</p>
          <p className="text-sm text-white/80">{duration}</p>
        </div>
      </div>
    </button>
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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: "", phone: "", note: "" });
  const [demoError, setDemoError] = useState("");
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
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
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

  const openVideoModal = useCallback(() => {
    setIsVideoModalOpen(true);
    setShouldLoadVideo(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
    setIsVideoModalOpen(false);
  }, []);

  const openDemoModal = useCallback((event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsDemoModalOpen(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIsDemoModalOpen(false);
    setDemoError("");
    setDemoForm({ name: "", phone: "", note: "" });
  }, []);

  const handleDemoSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!demoForm.name.trim() || !demoForm.phone.trim()) {
        setDemoError(t("hero.demoModal.validation"));
        return;
      }

      const subject = encodeURIComponent(t("hero.demoModal.subject"));
      const bodyLines = [
        `${t("hero.demoModal.body.name")}: ${demoForm.name.trim()}`,
        `${t("hero.demoModal.body.phone")}: ${demoForm.phone.trim()}`,
        `${t("hero.demoModal.body.note")}: ${demoForm.note.trim() || t("hero.demoModal.body.notProvided")}`,
      ];
      const mailtoUrl = `mailto:support@lumiso.app?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailtoUrl;
      closeDemoModal();
    },
    [closeDemoModal, demoForm.name, demoForm.phone, demoForm.note, t]
  );

  useEffect(() => {
    if (!isVideoModalOpen || typeof document === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeVideoModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeVideoModal, isVideoModalOpen]);

  useEffect(() => {
    if (!isVideoModalOpen) return;

    const requestFullscreen = async () => {
      const videoEl = videoRef.current;
      const containerEl = modalContainerRef.current;
      const target: HTMLElement | null = videoEl ?? containerEl ?? null;

      if (!target) return;

      const anyVideo = videoEl as unknown as { webkitEnterFullscreen?: () => Promise<void> | void };

      try {
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if (anyVideo?.webkitEnterFullscreen) {
          await anyVideo.webkitEnterFullscreen();
        }
      } catch {
        // Ignore failures; user can still play inline.
      }

      try {
        await videoEl?.play();
      } catch {
        // Autoplay might be blocked; user can tap play.
      }
    };

    const handleFullscreenChange = () => {
      if (isVideoModalOpen && !document.fullscreenElement) {
        setIsVideoModalOpen(false);
      }
    };

    requestFullscreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isVideoModalOpen]);

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
                href={SIGN_UP_URL}
                variant="primary"
                fullWidth
                className="hero-primary-cta sm:w-auto"
              >
                {t("hero.cta.primary")}
              </CTAButton>
              <CTAButton
                href="#"
                variant="ghost"
                fullWidth
                className="hero-secondary-cta sm:w-auto"
                onClick={(e) => openDemoModal(e)}
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
          className="hero-dashboard mt-12 sm:mt-16 animate-slide-in-fade"
          style={{ animationDelay: "900ms" }}
        >
          <HeroVideoCover
            alt={t("hero.video.alt")}
            onPlay={openVideoModal}
            eyebrow={t("hero.video.badge")}
            description={t("hero.video.heading")}
            duration={t("hero.video.duration")}
            playLabel={t("hero.video.playLabel")}
          />
        </div>
      </div>

      {isDemoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("hero.demoModal.title")}
          onClick={closeDemoModal}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t("hero.demoModal.title")}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{t("hero.demoModal.description")}</p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                onClick={closeDemoModal}
                aria-label={t("common.close")}
              >
                ×
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleDemoSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {t("hero.demoModal.nameLabel")}
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                  value={demoForm.name}
                  onChange={(e) => setDemoForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {t("hero.demoModal.phoneLabel")}
                </label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                  value={demoForm.phone}
                  onChange={(e) => setDemoForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {t("hero.demoModal.noteLabel")}
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                  rows={3}
                  placeholder={t("hero.demoModal.notePlaceholder")}
                  value={demoForm.note}
                  onChange={(e) => setDemoForm((prev) => ({ ...prev, note: e.target.value }))}
                />
              </div>

              {demoError && <p className="text-sm text-red-600 dark:text-red-400">{demoError}</p>}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  onClick={closeDemoModal}
                >
                  {t("hero.demoModal.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-teal-500 text-white font-semibold hover:bg-brand-teal-600 shadow-lg shadow-brand-teal-500/30 transition"
                >
                  {t("hero.demoModal.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("hero.video.modalTitle")}
          onClick={closeVideoModal}
        >
          <div
            ref={modalContainerRef}
            className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black">
              <button
                type="button"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg shadow-black/30 transition hover:bg-white"
                onClick={closeVideoModal}
                aria-label={t("common.close")}
              >
                ×
              </button>

              {shouldLoadVideo ? (
                <video
                  ref={videoRef}
                  className="h-full w-full bg-black"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={HERO_VIDEO_POSTER_DESKTOP}
                >
                  {HERO_VIDEO_SOURCES.map((source) => (
                    <source key={source.src} src={source.src} type={source.type} />
                  ))}
                  {t("hero.video.unsupported")}
                </video>
              ) : (
                <div className="h-full w-full animate-pulse bg-slate-900" />
              )}
            </div>
            <div className="flex flex-col items-start justify-between gap-3 px-4 py-3 text-sm text-white/80 sm:flex-row sm:items-center">
              <span className="font-semibold text-white">{t("hero.video.modalTitle")}</span>
              <p className="sm:text-right">{t("hero.video.modalDescription")}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
