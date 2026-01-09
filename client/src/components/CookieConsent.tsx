import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "mp-webstudio-cookie-consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, x: 50, opacity: 0, scale: 0.95 }}
          animate={{ 
            y: 0, 
            x: 0, 
            opacity: [0, 0.4, 0.2, 0.8, 0.3, 1],
            scale: 1,
            transition: {
              opacity: {
                times: [0, 0.1, 0.2, 0.3, 0.4, 1],
                duration: 1.2,
                ease: "linear"
              },
              duration: 0.4
            }
          }}
          exit={{ y: 50, x: 50, opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] max-w-[380px]"
          data-testid="cookie-consent-banner"
        >
          <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.1)] p-5 overflow-hidden group">
            {/* Анимация неонового свечения (мерцание в начале) */}
            <motion.div 
              className="absolute inset-0 bg-cyan-500/5 pointer-events-none"
              animate={{
                opacity: [0, 1, 0.3, 0.8, 0, 1],
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.1, 0.2, 0.3, 0.4, 1],
                ease: "linear"
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            {/* Постоянное мягкое пульсирование после включения */}
            <motion.div 
              className="absolute inset-0 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] pointer-events-none rounded-2xl"
              animate={{
                boxShadow: [
                  "inset 0 0 20px rgba(34,211,238,0.1)",
                  "inset 0 0 30px rgba(34,211,238,0.2)",
                  "inset 0 0 20px rgba(34,211,238,0.1)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 text-muted-foreground/60 hover:text-foreground transition-colors z-10 p-1"
              aria-label="Закрыть"
              data-testid="button-cookie-close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                  <Cookie className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground tracking-tight">
                    Файлы Cookie и Конфиденциальность
                  </h3>
                </div>
              </div>

              <p className="text-[13px] leading-relaxed text-muted-foreground/90">
                Мы используем файлы cookie для улучшения работы сайта. 
                Посещая его, вы принимаете нашу{" "}
                <a 
                  href="/privacy" 
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/30 transition-colors"
                  data-testid="link-privacy-policy"
                >
                  политику
                </a>.
              </p>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecline}
                  className="flex-1 text-xs font-medium hover:bg-white/5 no-default-hover-elevate"
                  data-testid="button-cookie-decline"
                >
                  Отклонить
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1 text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  data-testid="button-cookie-accept"
                >
                  Принять
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
