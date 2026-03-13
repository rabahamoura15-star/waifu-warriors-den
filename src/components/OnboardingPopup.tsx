import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Swords, BookOpen, Star, Trophy, ChevronLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function OnboardingPopup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const { t } = useI18n();

  const steps = [
    { icon: <BookOpen size={40} className="text-primary" />, titleKey: "onboardingWelcome", descKey: "onboardingWelcomeDesc" },
    { icon: <Swords size={40} className="text-accent" />, titleKey: "onboardingRanks", descKey: "onboardingRanksDesc" },
    { icon: <Star size={40} className="text-ssr" />, titleKey: "onboardingGacha", descKey: "onboardingGachaDesc" },
    { icon: <Trophy size={40} className="text-gold" />, titleKey: "onboardingCompete", descKey: "onboardingCompeteDesc" },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("asgard-onboarding");
    if (!seen) setTimeout(() => setShow(true), 1500);
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem("asgard-onboarding", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-md glass-strong rounded-2xl p-8 text-center space-y-6 glow-purple"
          >
            <button onClick={close} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-center">{steps[step].icon}</div>
              <h2 className="text-2xl font-display font-bold text-foreground text-glow-purple">
                {t(steps[step].titleKey)}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(steps[step].descKey)}
              </p>
            </motion.div>

            <div className="flex justify-center gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={14} />
                  {t("prev")}
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 rounded-lg gradient-purple text-primary-foreground font-bold text-sm hover:scale-105 transition-transform"
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  onClick={close}
                  className="px-6 py-2 rounded-lg gradient-purple text-primary-foreground font-bold text-sm hover:scale-105 transition-transform glow-purple"
                >
                  {t("letsGo")}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
