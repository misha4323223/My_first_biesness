import { SiTelegram, SiVk } from "react-icons/si";
import { Button } from "@/components/ui/button";
import logoImg from "@assets/generated_images/mp_hexagonal_tech_logo.webp";
import { useState } from "react";
import { ChevronDown, Mail, Phone, Clock, FileText, User, Hash, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const footerLinks = [
  { label: "О студии", href: "#about" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Услуги", href: "#services" },
  { label: "Процесс", href: "#process" },
  { label: "Оферта", href: "/offer" },
  { label: "Политика", href: "/privacy" },
];

export function Footer() {
  const [isRequisitesOpen, setIsRequisitesOpen] = useState(false);

  const scrollToSection = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      const duration = 1200; // Медленный скроллинг (мс)
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      const ease = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <footer className="relative py-8 border-t border-white/5 bg-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* Top Section: Logo & Nav */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-lg rounded-full group-hover:bg-cyan-500/20 transition-all" />
                <img src={logoImg} alt="MP" className="relative w-8 h-8 rounded-full border border-white/10" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white">
                MP<span className="text-cyan-400">.</span>WebStudio
              </span>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-cyan-400 transition-colors font-bold"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Middle Section: Terminal Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="mailto:mpwebstudio1@gmail.com"
              className="group flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] transition-all"
            >
              <div className="w-8 h-8 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Email</span>
                <span className="text-xs font-mono text-white/70">mpwebstudio1@gmail.com</span>
              </div>
            </a>

            <a 
              href="tel:+79531814136"
              className="group flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/[0.02] transition-all"
            >
              <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Телефон</span>
                <span className="text-xs font-mono text-white/70">+7 (953) 181-41-36</span>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-white/40">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">График</span>
                <span className="text-xs font-mono text-white/70">9:00 — 20:00 МСК</span>
              </div>
            </div>
          </div>

          {/* Bottom Section: Requisites & Copyright */}
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <button
                onClick={() => setIsRequisitesOpen(!isRequisitesOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-white/40">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold group-hover:text-white/60 transition-colors">
                    Юридическая информация
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-300 ${isRequisitesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isRequisitesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 mt-1 rounded-lg bg-white/[0.01] border border-white/5 font-mono">
                      <div className="flex items-center gap-3">
                        <User className="w-3 h-3 text-cyan-500/50" />
                        <span className="text-[10px] text-white/50 truncate">Пимашин Михаил Игоревич</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Hash className="w-3 h-3 text-cyan-500/50" />
                        <span className="text-[10px] text-white/50">ИНН: 711612442203</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Info className="w-3 h-3 text-cyan-500/50" />
                        <span className="text-[10px] text-white/50">Самозанятый (НПД)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
              <p>© {new Date().getFullYear()} MP.WebStudio. Все права защищены.</p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-cyan-400 transition-colors">Политика</a>
                <a href="/offer" className="hover:text-cyan-400 transition-colors">Оферта</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
