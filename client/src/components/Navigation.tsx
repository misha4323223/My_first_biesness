import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import logoImg from "@assets/generated_images/mp_hexagonal_tech_logo.webp";

const navItems = [
  { label: "О студии", href: "#about" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Услуги", href: "#services" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Процесс", href: "#process" },
  { label: "Контакты", href: "#contact" },
];

const legalLinks = [
  { label: "Оферта", href: "/offer" },
  { label: "Политика", href: "/privacy" },
];

const orderPagePath = "/order";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (!isHomePage) {
      window.location.href = "/" + href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none w-full">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-4 mx-4 pointer-events-auto transition-all duration-500 ease-in-out flex justify-center ${
          isScrolled
            ? "w-[95%] max-w-5xl rounded-full bg-background/40 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-2 px-4"
            : "w-full max-w-7xl rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/5 py-4 px-6"
        }`}
      >
        <nav className="flex items-center justify-between gap-4 w-full">
          <a
            href="/"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 flex-shrink-0 group"
            data-testid="link-logo"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl group-hover:bg-cyan-500/40 transition-all duration-500 rounded-full scale-125" />
              <img 
                src={logoImg} 
                alt="MP.WebStudio" 
                className="relative w-7 h-7 md:w-9 md:h-9 object-cover rounded-full border border-white/20 shadow-2xl transition-transform duration-700 group-hover:rotate-[360deg]" 
              />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-foreground">
              MP<span className="text-cyan-400">.</span>WebStudio
            </span>
          </a>

          <div className={`hidden md:flex items-center gap-0.5 transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className="relative text-[13px] font-medium tracking-tight text-muted-foreground hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-full overflow-hidden group"
                data-testid={`link-nav-${item.href.slice(1)}`}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className={`flex items-center gap-0.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-cyan-400 transition-colors px-1.5">
                  {link.label}
                </a>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => scrollToSection("#calculator")}
              variant={isScrolled ? "default" : "ghost"}
              className={`text-[13px] rounded-full transition-all duration-300 ${
                isScrolled 
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                  : "text-cyan-400 hover:text-cyan-300 px-3"
              }`}
              data-testid="button-nav-send-request"
            >
              Отправить заявку
            </Button>
            <a href={orderPagePath} className={`transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
              <Button
                size="sm"
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold px-6 py-2 h-auto text-[13px] rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border-0"
                data-testid="button-nav-cta"
              >
                Заказать сайт
              </Button>
            </a>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden mt-4 rounded-3xl bg-background/90 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 flex flex-col gap-3">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    onClick={() => scrollToSection(item.href)}
                    className="justify-start text-lg font-medium tracking-tight rounded-2xl"
                    data-testid={`link-mobile-nav-${item.href.slice(1)}`}
                  >
                    {item.label}
                  </Button>
                ))}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    onClick={() => scrollToSection("#calculator")}
                    variant="outline"
                    className="rounded-2xl border-white/10"
                  >
                    Заявка
                  </Button>
                  <a href={orderPagePath}>
                    <Button className="w-full bg-cyan-500 text-black font-bold rounded-2xl">
                      Заказать
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
