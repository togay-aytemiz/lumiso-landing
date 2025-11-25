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

const HeroScreenshot: React.FC<{ alt: string; onEnlarge?: () => void; isDesktop: boolean }> = ({
  alt,
  onEnlarge,
  isDesktop,
}) => (
  <div className="w-full mx-auto mt-4 sm:mt-16 max-w-[1400px] lg:max-w-[1500px]">
    <button
      type="button"
      className={`relative w-full rounded-[22px] border border-white/5 bg-transparent shadow-lg shadow-black/10 overflow-hidden aspect-[726/1266] sm:aspect-[2240/1086] transition ring-0 ${
        isDesktop ? "cursor-zoom-in hover:border-white/15" : "cursor-default"
      }`}
      onClick={isDesktop ? onEnlarge : undefined}
      aria-label={isDesktop ? "Enlarge hero screenshot" : undefined}
    >
      <picture className="absolute inset-0 block">
        <source srcSet="/hero/Dashboard-mobile.webp" media="(max-width: 639px)" type="image/webp" />
        <source srcSet="/hero/Dashboard.webp" media="(min-width: 640px)" type="image/webp" />
        <source srcSet="/hero/Dashboard-mobile.png" media="(max-width: 639px)" />
        <img
          src="/hero/Dashboard.png"
          alt={alt}
          className="w-full h-full object-contain"
          loading="eager"
          decoding="async"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 1400px"
          fetchPriority="high"
        />
      </picture>
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
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHeroLightboxOpen, setIsHeroLightboxOpen] = useState(false);
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
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    const handleDesktopChange = () => setIsDesktop(desktopQuery.matches);
    handleChange();
    handleDesktopChange();
    mediaQuery.addEventListener("change", handleChange);
    desktopQuery.addEventListener("change", handleDesktopChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      desktopQuery.removeEventListener("change", handleDesktopChange);
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

  const openHeroLightbox = useCallback(() => {
    if (isDesktop) setIsHeroLightboxOpen(true);
  }, [isDesktop]);

  const closeHeroLightbox = useCallback(() => {
    setIsHeroLightboxOpen(false);
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
          <HeroScreenshot alt={t("hero.imageAlt")} onEnlarge={openHeroLightbox} isDesktop={isDesktop} />
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

      <div
        className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
          isDesktop && isHeroLightboxOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-label="Hero screenshot full view"
        aria-hidden={!(isDesktop && isHeroLightboxOpen)}
        onClick={closeHeroLightbox}
      >
        <div
          className={`relative w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl transition-all duration-200 ${
            isHeroLightboxOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full shadow-md px-3 py-1 text-sm font-semibold hover:bg-slate-100"
            onClick={closeHeroLightbox}
          >
            {t("common.close")}
          </button>
          <div className="rounded-[22px] overflow-hidden bg-slate-900 shadow-2xl">
            <picture className="block">
              <source srcSet="/hero/Dashboard.webp" type="image/webp" />
              <img
                src="/hero/Dashboard.png"
                alt={t("hero.imageAlt")}
                className="w-full h-auto"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
