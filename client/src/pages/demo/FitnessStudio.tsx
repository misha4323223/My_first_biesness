import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Dumbbell, Users, Calendar, Zap, Heart, Trophy, ArrowLeft, Check, Menu, X as CloseIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import fitnessHeroImg from "@assets/generated_images/modern_gym_interior_purple.webp";

const classes = [
  { id: 1, name: "Силовая тренировка", time: "07:00", trainer: "Алексей", duration: "60 мин", spots: 8 },
  { id: 2, name: "Йога", time: "09:00", trainer: "Марина", duration: "75 мин", spots: 12 },
  { id: 3, name: "HIIT", time: "12:00", trainer: "Дмитрий", duration: "45 мин", spots: 5 },
  { id: 4, name: "Пилатес", time: "14:00", trainer: "Анна", duration: "60 мин", spots: 10 },
  { id: 5, name: "Бокс", time: "18:00", trainer: "Сергей", duration: "60 мин", spots: 6 },
  { id: 6, name: "Стретчинг", time: "20:00", trainer: "Елена", duration: "45 мин", spots: 15 },
];

const stats = [
  { icon: Users, value: "500+", label: "Активных членов" },
  { icon: Dumbbell, value: "50+", label: "Тренажёров" },
  { icon: Trophy, value: "15", label: "Тренеров" },
];

const plans = [
  { name: "Базовый", price: 2500, features: ["Тренажёрный зал", "Раздевалки", "Душевые"] },
  { name: "Стандарт", price: 4500, features: ["Всё из Базового", "Групповые занятия", "Сауна"], popular: true },
  { name: "Премиум", price: 7500, features: ["Всё из Стандарт", "Персональный тренер", "Питание"] },
];

export default function FitnessStudio() {
  const [bookedClasses, setBookedClasses] = useState<number[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [trialOpen, setTrialOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trialForm, setTrialForm] = useState({ name: "", phone: "" });
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [bmi, setBmi] = useState({ weight: "", height: "", result: null as number | null });
  const [activeDay, setActiveDay] = useState("Пн");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const calculateBmi = () => {
    const w = parseFloat(bmi.weight);
    const h = parseFloat(bmi.height) / 100;
    if (w > 0 && h > 0) {
      setBmi(prev => ({ ...prev, result: parseFloat((w / (h * h)).toFixed(1)) }));
    }
  };

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: "Дефицит массы", color: "text-blue-400" };
    if (val < 25) return { label: "Норма", color: "text-green-400" };
    if (val < 30) return { label: "Избыточный вес", color: "text-yellow-400" };
    return { label: "Ожирение", color: "text-red-400" };
  };
  const scheduleRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "PowerFlex — Фитнес студия в Туле | Йога, HIIT, Пилатес",
    description: "Современный фитнес-центр с 50+ тренажёрами и 15 профессиональными тренерами. Групповые занятия, персональный тренинг, сауна. Пробное занятие бесплатно!",
    keywords: "фитнес клуб, тренажёрный зал, йога, HIIT, личный тренер, фитнес в Туле",
    ogTitle: "PowerFlex — Фитнес клуб | Дизайн от MP.WebStudio",
    ogDescription: "500+ активных членов, профессиональные тренеры, групповые занятия и персональный тренинг",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/fitness-studio",
    canonical: "https://mp-webstudio.ru/demo/fitness-studio"
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "PowerFlex", url: "https://mp-webstudio.ru/demo/fitness" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSchedule = () => {
    scheduleRef.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialForm.name || !trialForm.phone) return;
    setTrialSuccess(true);
    setTimeout(() => {
      setTrialOpen(false);
      setTrialSuccess(false);
      setTrialForm({ name: "", phone: "" });
    }, 2000);
  };

  const handleSubscribe = () => {
    if (!email) return;
    toast({ title: "Подписка оформлена!", description: `Письма будут приходить на ${email}` });
    setEmail("");
  };

  const bookClass = (id: number) => {
    if (bookedClasses.includes(id)) {
      setBookedClasses(prev => prev.filter(x => x !== id));
      toast({
        title: "Запись отменена",
        description: "Вы отменили запись на занятие",
      });
    } else {
      setBookedClasses(prev => [...prev, id]);
      const cls = classes.find(c => c.id === id);
      toast({
        title: "Вы записаны!",
        description: `${cls?.name} в ${cls?.time}`,
      });
    }
  };

  const selectPlan = (planName: string) => {
    setSelectedPlan(planName);
    toast({
      title: "Тариф выбран",
      description: `Вы выбрали тариф "${planName}"`,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {bookedClasses.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <Badge className="bg-violet-500 text-white border-0 px-4 py-2 text-sm shadow-lg shadow-violet-500/20">
            <Calendar className="w-4 h-4 mr-2 inline" />
            Записей: {bookedClasses.length}
          </Badge>
        </div>
      )}

      <Dialog open={trialOpen} onOpenChange={setTrialOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Запись на пробное занятие</DialogTitle>
          </DialogHeader>
          {trialSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Заявка отправлена!</h3>
              <p className="text-muted-foreground">Мы свяжемся с вами для подтверждения</p>
            </div>
          ) : (
            <form onSubmit={handleTrialSubmit} className="space-y-4">
              <div>
                <Label htmlFor="trial-name">Ваше имя</Label>
                <Input 
                  id="trial-name" 
                  value={trialForm.name} 
                  onChange={(e) => setTrialForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван"
                  required
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>
              <div>
                <Label htmlFor="trial-phone">Телефон</Label>
                <Input 
                  id="trial-phone" 
                  type="tel"
                  value={trialForm.phone} 
                  onChange={(e) => setTrialForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="bg-neutral-800 border-neutral-700"
                />
              </div>
              <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 h-12">
                Записаться
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/#portfolio">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 w-9 h-9"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight">ФОРМА</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
            <button onClick={scrollToSchedule} className="hover:text-white transition-colors cursor-pointer">Расписание</button>
            <button onClick={scrollToPricing} className="hover:text-white transition-colors cursor-pointer">Абонементы</button>
            <button onClick={scrollToContact} className="hover:text-white transition-colors cursor-pointer">Контакты</button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="hidden sm:flex bg-violet-600 hover:bg-violet-700" onClick={() => setTrialOpen(true)} data-testid="button-trial">
              Пробное занятие
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-neutral-900 border-b border-white/5 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <button onClick={scrollToSchedule} className="text-left py-2 text-lg text-neutral-300 hover:text-white border-b border-white/5">Расписание</button>
                <button onClick={scrollToPricing} className="text-left py-2 text-lg text-neutral-300 hover:text-white border-b border-white/5">Абонементы</button>
                <button onClick={scrollToContact} className="text-left py-2 text-lg text-neutral-300 hover:text-white border-b border-white/5">Контакты</button>
                <Button className="w-full bg-violet-600 hover:bg-violet-700 mt-2" onClick={() => { setTrialOpen(true); setMobileMenuOpen(false); }}>
                  Бесплатное занятие
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <header className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-neutral-950 to-neutral-950 pointer-events-none" />
        <img 
          src={fitnessHeroImg} 
          alt="Фитнес" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 sm:mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30">
              Первое занятие бесплатно
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight">
              Твоя лучшая
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                форма
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-400 mb-8 sm:mb-10 max-w-lg leading-relaxed">
              Современный фитнес-клуб с профессиональными тренерами и новейшим оборудованием. Создай тело своей мечты вместе с нами.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-base h-14 px-8 shadow-lg shadow-violet-600/20" onClick={scrollToSchedule} data-testid="button-start">
                Начать тренировки
              </Button>
              <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-white/5 text-base h-14 px-8" onClick={scrollToPricing} data-testid="button-tour">
                Выбрать абонемент
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-violet-500"
            />
          </div>
        </motion.div>
      </header>

      <section className="py-16 sm:py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-white/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-violet-400" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">{stat.value}</div>
                <div className="text-neutral-500 text-sm sm:text-base font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={scheduleRef} id="schedule" className="py-16 sm:py-24 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Расписание занятий</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">Выберите подходящее направление и забронируйте место в группе всего в пару кликов.</p>
          </motion.div>

          <Tabs defaultValue="Пн" className="w-full" onValueChange={setActiveDay}>
            <div className="overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-hide">
              <TabsList className="inline-flex min-w-full sm:min-w-0 sm:flex justify-start sm:justify-center bg-neutral-800/50 border border-white/5 p-1 rounded-xl h-auto">
                {days.map(day => (
                  <TabsTrigger 
                    key={day} 
                    value={day}
                    className="px-6 py-3 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg transition-all text-base font-medium"
                  >
                    {day}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <AnimatePresence mode="wait">
              <TabsContent value={activeDay} key={activeDay} className="mt-0">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {classes.map((cls, index) => {
                    const isBooked = bookedClasses.includes(cls.id);
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`p-6 border-2 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 ${isBooked ? 'border-violet-500 bg-violet-500/5' : 'border-white/5 bg-neutral-800/40 hover:border-violet-500/40'}`} data-testid={`card-class-${cls.id}`}>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="min-w-0">
                              <h3 className="font-bold text-lg text-white mb-1 truncate">{cls.name}</h3>
                              <p className="text-sm text-neutral-400 font-medium">Тренер: {cls.trainer}</p>
                            </div>
                            {isBooked ? (
                              <Badge className="bg-violet-500 text-white border-0 shrink-0">
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Записан
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-violet-500/10 text-violet-300 border-0 shrink-0">
                                {cls.spots} мест
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-neutral-400 mb-6">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-violet-400" />
                              <span className="font-semibold">{cls.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Dumbbell className="w-4 h-4 text-violet-400" />
                              <span>{cls.duration}</span>
                            </div>
                          </div>
                          <Button 
                            variant={isBooked ? "default" : "outline"}
                            className={`w-full h-11 transition-all active-elevate-2 font-bold ${isBooked ? 'bg-violet-600 hover:bg-violet-700 border-violet-600 shadow-lg shadow-violet-600/20' : 'border-neutral-700 text-neutral-200 hover:bg-violet-600 hover:border-violet-600 hover:text-white'}`}
                            onClick={() => bookClass(cls.id)}
                            data-testid={`button-book-${cls.id}`}
                          >
                            {isBooked ? "Отменить запись" : "Записаться"}
                          </Button>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-violet-500 text-white border-0 py-1 px-3">Инструменты</Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">Калькулятор ИМТ</h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                Индекс массы тела (ИМТ) — это простой способ оценить соответствие вашего веса вашему росту. Узнайте свою норму прямо сейчас и получите персональные рекомендации.
              </p>
              
              <div className="bg-neutral-900/50 border border-white/5 p-6 sm:p-10 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                <div className="grid sm:grid-cols-2 gap-6 mb-8 relative z-10">
                  <div className="space-y-3">
                    <Label className="text-neutral-300 font-semibold text-base">Вес (кг)</Label>
                    <Input 
                      type="number" 
                      placeholder="70" 
                      className="bg-neutral-800/80 border-white/5 h-14 text-lg focus:ring-violet-500/50 transition-all rounded-xl"
                      value={bmi.weight}
                      onChange={(e) => setBmi(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-neutral-300 font-semibold text-base">Рост (см)</Label>
                    <Input 
                      type="number" 
                      placeholder="175" 
                      className="bg-neutral-800/80 border-white/5 h-14 text-lg focus:ring-violet-500/50 transition-all rounded-xl"
                      value={bmi.height}
                      onChange={(e) => setBmi(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 font-bold text-lg rounded-xl shadow-lg shadow-violet-600/20 mb-8 relative z-10"
                  onClick={calculateBmi}
                >
                  Рассчитать ИМТ
                </Button>

                {bmi.result && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-neutral-800/80 rounded-2xl border border-violet-500/30 relative z-10"
                  >
                    <div className="text-sm text-neutral-400 mb-1 font-medium uppercase tracking-wider">Ваш результат</div>
                    <div className="text-5xl font-bold mb-3 tracking-tighter text-white">{bmi.result}</div>
                    <div className={`text-lg font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block bg-white/5 ${getBmiCategory(bmi.result).color}`}>
                      {getBmiCategory(bmi.result).label}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square sm:aspect-[4/3] lg:aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-[100px] rounded-full opacity-50" />
              <div className="relative h-full border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-center text-center shadow-2xl">
                <div className="w-24 h-24 rounded-3xl bg-violet-500/10 flex items-center justify-center mx-auto mb-8">
                  <Dumbbell className="w-12 h-12 text-violet-500 animate-pulse" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-white leading-tight">Готовы к изменениям?</h3>
                <p className="text-lg text-neutral-400 mb-10 leading-relaxed mx-auto max-w-sm">
                  Начните свой путь к идеальному телу сегодня с бесплатной тренировки и консультации.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-neutral-200 h-14 rounded-xl text-lg font-bold shadow-xl shadow-white/5"
                  onClick={() => setTrialOpen(true)}
                >
                  Записаться на тест-драйв
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={pricingRef} id="pricing" className="py-16 sm:py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Абонементы</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">Инвестируйте в своё здоровье. Мы предлагаем гибкие тарифы для любых целей и уровня подготовки.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.name;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative h-full p-8 sm:p-10 flex flex-col border-2 transition-all duration-500 rounded-[2rem] overflow-hidden ${plan.popular ? 'border-violet-500 bg-neutral-900/80' : 'border-white/5 bg-neutral-900/40 hover:border-white/10'}`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs font-bold px-5 py-2 rounded-bl-2xl uppercase tracking-widest">
                        Популярный
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-neutral-400">₽/мес</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-10 flex-grow">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-center gap-3 text-neutral-300 font-medium">
                          <div className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-violet-400" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full h-14 rounded-xl text-lg font-bold transition-all active-elevate-2 ${plan.popular ? 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/20' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
                      onClick={() => selectPlan(plan.name)}
                      data-testid={`button-plan-${index}`}
                    >
                      {isSelected ? "Выбрано" : "Выбрать тариф"}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={contactRef} className="py-16 sm:py-24 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-neutral-800/30 border border-white/5 rounded-[3rem] p-8 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-500/5 to-transparent pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-8">Свяжитесь с нами</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Наш адрес</h4>
                      <p className="text-neutral-400 leading-relaxed">г. Тула, проспект Ленина, 85, ТЦ "Ликерка Лофт"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Телефон</h4>
                      <p className="text-neutral-400 leading-relaxed text-lg">+7 (4872) 12-34-56</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Режим работы</h4>
                      <p className="text-neutral-400 leading-relaxed">Ежедневно: 07:00 – 23:00</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  {['VK', 'TG', 'WA'].map(social => (
                    <Button key={social} variant="outline" className="w-12 h-12 rounded-xl border-white/5 hover:bg-white/5 text-white p-0">
                      {social}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900/50 p-8 sm:p-10 rounded-[2rem] border border-white/5 shadow-2xl">
                <h3 className="text-2xl font-bold mb-2">Спецпредложения</h3>
                <p className="text-neutral-400 mb-8">Подпишитесь на нашу рассылку, чтобы получать информацию об акциях и новых направлениях.</p>
                <div className="space-y-4">
                  <Input 
                    placeholder="Ваш Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-neutral-800 border-white/5 rounded-xl text-lg px-6"
                  />
                  <Button className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-lg font-bold rounded-xl shadow-lg shadow-violet-600/20" onClick={handleSubscribe}>
                    Подписаться
                  </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-6 text-center leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>&copy; 2024 PowerFlex. Все права защищены.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Правила клуба</a>
            <a href="#" className="hover:text-white transition-colors">Политика</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
