import React from "react";
import { CheckCircleIcon } from "./icons/CheckCircleIcon";
import { useAppContext } from "../contexts/AppContext";
import CTAButton from "./ui/CTAButton";
import PrismBackground from "./ui/PrismBackground";
import { useIsMobile } from "../hooks/useIsMobile";

const BadgeList: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useAppContext();
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-white/80 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5 text-brand-teal-300" />
        <span>{t("hero.cta.subtext.line1")}</span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5 text-brand-teal-300" />
        <span>{t("hero.cta.subtext.line2")}</span>
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const { t } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <section id="contact" className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-[#030015] text-white shadow-[0_50px_140px_rgba(5,0,21,0.7)]">
          <div className="absolute inset-0">
            <PrismBackground
              animationType="rotate"
              timeScale={0.4}
              height={3.5}
              baseWidth={isMobile ? 2 : 6}
              scale={isMobile ? 3.6 : 4}
              hueShift={0}
              colorFrequency={1}
              noise={0.1}
              glow={0.7}
            />
          </div>
          <div className="relative flex min-h-[480px] sm:min-h-[560px] flex-col items-center justify-center text-center px-5 sm:px-6 py-12 sm:py-24 gap-5">
            <BadgeList className="hidden sm:flex" />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 py-2 text-sm font-semibold tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-white" />
              {t("cta.badge")}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold leading-snug max-w-3xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              {t("cta.title")}
            </h2>
            <p className="text-base sm:text-xl text-white/85 max-w-2xl">
              {t("cta.subtitle")}
            </p>
            <div className="mt-4 flex flex-col items-center gap-3">
              <CTAButton
                href="#"
                variant="contrast"
                className="rounded-full px-8 py-3 text-base sm:px-10 sm:py-4 sm:text-lg whitespace-nowrap"
              >
                {t("cta.button")}
              </CTAButton>
            </div>
            <BadgeList className="flex sm:hidden pt-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
