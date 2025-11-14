import React from "react";
import { useAppContext } from "../contexts/AppContext";
import CTAButton from "./ui/CTAButton";
import PrismBackground from "./ui/PrismBackground";

const CTA: React.FC = () => {
  const { t } = useAppContext();

  return (
    <section id="contact" className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-[#030015] text-white shadow-[0_50px_140px_rgba(5,0,21,0.7)]">
          <div className="absolute inset-0">
            <PrismBackground
              animationType="rotate"
              timeScale={0.5}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              hueShift={0}
              colorFrequency={1}
              noise={0.1}
              glow={1}
            />
          </div>
          <div className="relative flex min-h-[560px] flex-col items-center justify-center text-center px-6 py-16 sm:py-24 gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 py-2 text-sm font-semibold tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-white" />
              {t("cta.badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              {t("cta.title")}
            </h2>
            <p className="text-lg sm:text-xl text-white/85 max-w-2xl">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <CTAButton
                href="#"
                variant="contrast"
                className="rounded-full px-10 py-4 text-base sm:text-lg"
              >
                {t("cta.button")}
              </CTAButton>
              <CTAButton
                href="#"
                variant="muted"
                className="rounded-full px-10 py-4 text-base sm:text-lg backdrop-blur"
              >
                {t("cta.secondaryButton")}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
