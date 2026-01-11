import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/send-calculator-order", {
        ...data,
        projectType: "direct_request",
        selectedFeatures: [],
        basePrice: 0,
        totalPrice: 0,
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
              <span className="text-lg md:text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
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
                onClick={() => setIsOrderModalOpen(true)}
                variant={isScrolled ? "default" : "ghost"}
                className={`text-[13px] rounded-full transition-all duration-300 font-bold whitespace-nowrap ${
                  isScrolled 
                    ? "bg-cyan-500 hover:bg-cyan-400 text-white px-5 shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
                    : "text-white hover:text-cyan-300 px-3"
                }`}
                data-testid="button-nav-send-request"
              >
                Отправить заявку
              </Button>
              <a href={orderPagePath} className={`transition-all duration-500 ${isScrolled ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"}`}>
                <Button
                  size="sm"
                  className="bg-[#38bdf8] hover:bg-[#7dd3fc] text-white font-black px-6 py-2 h-auto text-[13px] rounded-full shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border-0 whitespace-nowrap"
                  data-testid="button-nav-cta"
                >
                  Заказать сайт
                </Button>
              </a>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden rounded-full pointer-events-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
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
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsOrderModalOpen(true);
                      }}
                      variant="outline"
                      className="rounded-2xl border-white/10"
                    >
                      Заявка
                    </Button>
                    <a href={orderPagePath}>
                      <Button className="w-full bg-cyan-500 text-white font-bold rounded-2xl">
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
        <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Оставить заявку
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Заполните форму, и наш менеджер свяжется с вами для обсуждения деталей проекта.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (999) 000-00-00" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.ru" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Краткое описание проекта</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Расскажите немного о вашем будущем сайте..." 
                        className="min-h-[100px] bg-background/50 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Отправка..." : "Отправить заявку"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
