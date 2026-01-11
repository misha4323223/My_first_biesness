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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-cyan-500/20 py-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between gap-4">
        <a
          href="/"
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-3 flex-shrink-0 group"
          data-testid="link-logo"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-md group-hover:bg-cyan-500/40 transition-colors rounded-full" />
            <img 
              src={logoImg} 
              alt="MP.WebStudio" 
              className="relative w-8 h-8 md:w-10 md:h-10 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg] clip-hexagon border border-white/10" 
            />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tighter text-foreground group-hover:text-cyan-400 transition-colors">
            MP<span className="text-cyan-500">.</span>WebStudio
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1 flex-wrap">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(item.href)}
              className="relative text-muted-foreground whitespace-nowrap hover:text-cyan-400 group overflow-hidden"
              data-testid={`link-nav-${item.href.slice(1)}`}
            >
              <span className="relative z-10">{item.label}</span>
              <motion.div
                className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          ))}
          <div className="hidden lg:flex items-center gap-0 ml-4 pl-4 border-l border-white/10">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground/60 text-[10px] uppercase tracking-widest hover:text-white"
                  data-testid={`link-nav-legal-${link.href.slice(1)}`}
                >
                  {link.label}
                </Button>
              </a>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => scrollToSection("#calculator")}
            className="relative bg-transparent hover:bg-transparent border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] clip-hexagon px-6"
            data-testid="button-nav-send-request"
          >
            <span className="relative z-10">Отправить заявку</span>
          </Button>
          <a href={orderPagePath}>
            <Button
              size="sm"
              className="relative bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] clip-hexagon px-6 border-0"
              data-testid="button-nav-cta"
            >
              <span className="relative z-10">Заказать сайт</span>
            </Button>
          </a>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  onClick={() => scrollToSection(item.href)}
                  className="justify-start text-muted-foreground"
                  data-testid={`link-mobile-nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </Button>
              ))}
              <div className="flex gap-1 pt-2 mt-2 border-t border-border">
                {legalLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className="justify-start text-muted-foreground text-xs"
                      data-testid={`link-mobile-nav-legal-${link.href.slice(1)}`}
                    >
                      {link.label}
                    </Button>
                  </a>
                ))}
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <Button
                  onClick={() => scrollToSection("#calculator")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0"
                  data-testid="button-mobile-send-request"
                >
                  Отправить заявку
                </Button>
                <a href={orderPagePath} className="w-full">
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0"
                    data-testid="button-mobile-cta"
                  >
                    Заказать сайт
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
