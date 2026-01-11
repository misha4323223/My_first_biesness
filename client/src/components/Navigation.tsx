import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import logoImg from "@assets/generated_images/mp_hexagonal_tech_logo.webp";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChatWidget } from "./ChatWidget"; // Предполагается наличие экспорта или будем вызывать через стейт если нужно

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

const schema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
});

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  const isHomePage = location === "/";

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", {
        action: "contact",
        ...data,
        projectType: "direct_request",
        budget: "Не указан",
        message: data.description,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsOrderModalOpen(false);
      form.reset();
      toast({
        title: "Заявка отправлена!",
        description: "Мы получили вашу заявку и свяжемся с вами вскоре.",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    },
  });

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
      const offset = 80;
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
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none w-full">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-4 mx-4 pointer-events-auto transition-all duration-500 ease-in-out flex justify-center relative ${
            isScrolled
              ? "w-[95%] max-w-5xl rounded-full bg-background/40 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-2 px-4"
              : "w-full max-w-7xl rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/5 py-4 px-6"
          }`}
        >
          <nav className="flex items-center justify-between gap-4 w-full">
            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center gap-4 w-full`}>
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
                <span className="text-lg md:text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
                  MP<span className="text-cyan-400">.</span>WebStudio
                </span>
              </a>

              <div className="flex-1 flex justify-center">
                <div className={`flex items-center gap-0.5 transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
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
              </div>

              <div className="flex items-center gap-3">
                <div className={`hidden lg:flex items-center gap-0.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
                  {legalLinks.map((link) => (
                    <a key={link.href} href={link.href} className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-cyan-400 transition-colors px-1.5">
                      {link.label}
                    </a>
                  ))}
                </div>
                
                <div className="hidden md:block h-9 w-9 rounded-sm bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500 p-[1.5px] group opacity-100 transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(148,163,184,0.3)]">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-ai-chat'));
                    }}
                    data-testid="button-desktop-ai"
                    className="h-full w-full rounded-sm bg-black flex flex-col items-center justify-center font-mono"
                    title="AI Assistant"
                  >
                    <Brain className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors duration-200" />
                    <span className="text-[8px] leading-none mt-0.5 text-slate-300 group-hover:text-white transition-colors duration-200">AI</span>
                  </button>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsOrderModalOpen(true)}
                  variant={isScrolled ? "default" : "ghost"}
                  className={`text-[13px] rounded-full transition-all duration-300 font-bold whitespace-nowrap ${
                    isScrolled 
                      ? "bg-cyan-500 hover:bg-cyan-400 text-white px-5 shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
                      : "text-white hover:text-cyan-300 px-3"
                  }`}
                  data-testid="button-nav-send-request"
                >
                  Заявка
                </Button>
                <a href={orderPagePath} className={`hidden sm:block transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
                  <Button
                    size="sm"
                    className="bg-[#38bdf8] hover:bg-[#7dd3fc] text-white font-black px-6 py-2 h-auto text-[13px] rounded-full shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border-0 whitespace-nowrap"
                    data-testid="button-nav-cta"
                  >
                    Заказать сайт
                  </Button>
                </a>
              </div>
            </div>

            {/* Mobile Navigation - Variant 4: Center Logo */}
            <div className="flex md:hidden items-center justify-between w-full relative h-12 px-2">
              <div className="z-20">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full pointer-events-auto hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  data-testid="button-mobile-menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </Button>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isHomePage) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      window.location.href = "/";
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-cyan-500/30 blur-lg rounded-full animate-pulse" />
                  <img 
                    src={logoImg} 
                    alt="MP" 
                    className="relative w-9 h-9 object-cover rounded-full border border-white/30 shadow-2xl" 
                  />
                </motion.div>
              </div>

              <div className="z-20">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500 p-[1.5px] group opacity-100 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(148,163,184,0.3)]">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-ai-chat'));
                    }}
                    data-testid="button-mobile-ai"
                    className="h-full w-full rounded-full bg-black flex flex-col items-center justify-center font-mono"
                    title="AI Assistant"
                  >
                    <Brain className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors duration-200" />
                    <span className="text-[8px] leading-none mt-0.5 text-slate-300 group-hover:text-white transition-colors duration-200">AI</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="md:hidden absolute top-[calc(100%+0.5rem)] left-0 right-0 rounded-[32px] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.8)] z-[100]"
              >
                <div className="p-6 flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection(item.href)}
                        className="w-full justify-start text-lg font-bold tracking-tight rounded-2xl py-6 hover:bg-white/5 text-white/80 hover:text-cyan-400"
                        data-testid={`link-mobile-nav-${item.href.slice(1)}`}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsOrderModalOpen(true);
                      }}
                      variant="outline"
                      className="rounded-2xl border-white/10 h-12 font-bold hover:bg-white/5 text-white"
                    >
                      Заявка
                    </Button>
                    <a href={orderPagePath} className="w-full">
                      <Button className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)]">
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

      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-[480px] w-[95vw] p-0 overflow-hidden bg-transparent border-0 shadow-none gap-0">
          <div className="relative w-full h-full p-1">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative h-full flex flex-col bg-[#0a0a0a]/80 backdrop-blur-[32px] border border-white/10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="relative p-6 sm:p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 p-[1px] shadow-[0_8px_16px_-4px_rgba(56,189,248,0.4)]">
                      <div className="w-full h-full rounded-[14px] bg-[#0a0a0a] flex items-center justify-center">
                        <img src={logoImg} alt="MP" className="w-6 h-6 object-contain" />
                      </div>
                    </div>
                    <div>
                      <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                        Начать <span className="text-cyan-400">проект</span>
                      </DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm text-white/50 font-medium mt-1">
                        Воплотим вашу идею в реальность
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[70vh] p-6 sm:p-8 custom-scrollbar">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div className="grid gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Ваше имя</FormLabel>
                            <FormControl>
                              <div className="group relative">
                                <Input 
                                  placeholder="Алексей" 
                                  {...field} 
                                  className="h-12 bg-white/[0.03] border-white/10 rounded-2xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20 pl-4" 
                                />
                                <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold text-red-400 ml-1" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Телефон</FormLabel>
                              <FormControl>
                                <div className="group relative">
                                  <Input 
                                    placeholder="+7 (___) ___ __ __" 
                                    {...field} 
                                    className="h-12 bg-white/[0.03] border-white/10 rounded-2xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20 pl-4" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] font-bold text-red-400 ml-1" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email</FormLabel>
                              <FormControl>
                                <div className="group relative">
                                  <Input 
                                    placeholder="mail@example.ru" 
                                    {...field} 
                                    className="h-12 bg-white/[0.03] border-white/10 rounded-2xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20 pl-4" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] font-bold text-red-400 ml-1" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">О проекте</FormLabel>
                            <FormControl>
                              <div className="group relative">
                                <Textarea 
                                  placeholder="Опишите ваши цели и пожелания..." 
                                  className="min-h-[120px] bg-white/[0.03] border-white/10 rounded-2xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20 resize-none p-4 leading-relaxed" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold text-red-400 ml-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        disabled={mutation.isPending}
                        className="relative w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-base rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_12px_24px_-8px_rgba(56,189,248,0.5)] group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" style={{ clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)' }} />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {mutation.isPending ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Отправка...
                            </>
                          ) : (
                            <>
                              Запустить процесс
                              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                              </div>
                            </>
                          )}
                        </span>
                      </Button>
                      <p className="text-[10px] text-center text-white/20 mt-4 font-medium uppercase tracking-widest">
                        Безопасно • Конфиденциально • 24/7
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
