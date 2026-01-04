import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Clock, MapPin, Phone, Star, Calendar, Check, ArrowLeft, 
  Shield, Award, Users, Sparkles, Activity, Eye, Thermometer, UserCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import { Skeleton } from "@/components/ui/skeleton";

import heroImg from "@assets/generated_images/dental_clinic_modern_reception.webp";
import treatmentImg from "@assets/generated_images/dental_treatment_room_interior.webp";
import femaleDocImg from "@assets/generated_images/russian_female_dentist_portrait.webp";
import maleDocImg from "@assets/generated_images/russian_male_dentist_portrait.webp";
import instrumentsImg from "@assets/generated_images/dental_instruments_close-up.webp";
import smileImg from "@assets/generated_images/perfect_white_smile_close-up.webp";
import xrayImg from "@assets/generated_images/dental_x-ray_equipment_modern.webp";

const services = [
  { 
    id: 1, 
    name: "Профессиональная чистка", 
    description: "Удаление зубного камня и налёта ультразвуком",
    price: 4500, 
    duration: "60 мин",
    icon: Sparkles 
  },
  { 
    id: 2, 
    name: "Лечение кариеса", 
    description: "Пломбирование с использованием современных материалов",
    price: 5500, 
    duration: "45 мин",
    icon: Heart 
  },
  { 
    id: 3, 
    name: "Отбеливание зубов", 
    description: "Профессиональное отбеливание ZOOM 4",
    price: 18000, 
    duration: "90 мин",
    popular: true,
    icon: Sparkles 
  },
  { 
    id: 4, 
    name: "Имплантация", 
    description: "Установка импланта Nobel Biocare под ключ",
    price: 55000, 
    duration: "120 мин",
    icon: Award 
  },
  { 
    id: 5, 
    name: "Виниры", 
    description: "Керамические виниры E.max",
    price: 35000, 
    duration: "2 визита",
    icon: Star 
  },
  { 
    id: 6, 
    name: "Брекеты", 
    description: "Установка брекет-системы с сопровождением",
    price: 95000, 
    duration: "18 мес",
    icon: Check 
  },
];

const doctors = [
  { 
    id: 1, 
    name: "Елена Смирнова", 
    role: "Главный врач, терапевт", 
    experience: "15 лет",
    image: femaleDocImg,
    specialization: "Эстетическая стоматология, виниры",
    status: "online"
  },
  { 
    id: 2, 
    name: "Андрей Козлов", 
    role: "Хирург-имплантолог", 
    experience: "12 лет",
    image: maleDocImg,
    specialization: "Имплантация, костная пластика",
    status: "busy"
  },
];

const advantages = [
  { icon: Shield, title: "Гарантия 5 лет", description: "На все виды работ" },
  { icon: Award, title: "Европейское оборудование", description: "Только сертифицированная техника" },
  { icon: Users, title: "10 000+ пациентов", description: "Доверяют нам свои улыбки" },
  { icon: Heart, title: "Безболезненное лечение", description: "Современная анестезия" },
];

const teethData = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  side: i < 16 ? "upper" : "lower",
  label: `${i + 1}`
}));

export default function DentalClinic() {
  const [formData, setFormData] = useState({ name: "", phone: "", service: "" });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"services" | "smile">("services");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const servicesRef = useRef<HTMLElement>(null);
  const doctorsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "SmileCare — Стоматология в Туле | Лечение, имплантация, отбеливание",
    description: "Современная стоматологическая клиника. Профессиональное лечение кариеса, имплантация, отбеливание ZOOM 4. Европейское оборудование, гарантия 5 лет.",
    keywords: "стоматолог, клиника, лечение зубов, имплантация, отбеливание, Тула, зубной врач",
    ogTitle: "SmileCare — Стоматология | Дизайн от MP.WebStudio",
    ogDescription: "Профессиональные врачи, современное оборудование, гарантия на все работы",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/dental",
    canonical: "https://mp-webstudio.ru/demo/dental"
  });

  useAggregateRatingSchema({
    name: "SmileCare Стоматология",
    description: "Современная стоматологическая клиника с профессиональными врачами",
    data: {
      ratingValue: 4.8,
      ratingCount: 287
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "SmileCare", url: "https://mp-webstudio.ru/demo/dental" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToDoctors = () => doctorsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsLoading(true);
    setTimeout(() => {
      setBookingSuccess(true);
      setIsLoading(false);
      toast({
        title: "Заявка принята!",
        description: "Уведомление отправлено дежурному врачу в Telegram",
      });
      setTimeout(() => {
        setBookingOpen(false);
        setBookingSuccess(false);
        setFormData({ name: "", phone: "", service: "" });
      }, 2000);
    }, 800);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md bg-white border-teal-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800">
              <Calendar className="w-5 h-5 text-teal-500" />
              Быстрая запись
            </DialogTitle>
          </DialogHeader>
          
          {bookingSuccess ? (
            <div className="py-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-teal-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-teal-900">Вы записаны!</h3>
              <p className="text-gray-500">Врач свяжется с вами через 5 минут</p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book-name">Ваше имя</Label>
                <Input 
                  id="book-name"
                  value={formData.name} 
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Александр"
                  className="border-teal-100 focus:border-teal-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-phone">Телефон</Label>
                <Input 
                  id="book-phone"
                  type="tel"
                  value={formData.phone} 
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+7 (___) ___-__-__"
                  className="border-teal-100 focus:border-teal-500"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold h-12">
                {isLoading ? "Обработка..." : "Записаться сейчас"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50 pointer-events-none" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" 
          style={{ backgroundImage: `url(${heroImg})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
        
        <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <Link href="/#portfolio">
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-teal-100/60 border border-teal-200 hover:bg-teal-100/80"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-5 h-5 text-teal-600" />
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-teal-700">SmileCare</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
            <button onClick={scrollToServices} className="hover:text-teal-600 transition-colors cursor-pointer">Услуги</button>
            <button onClick={scrollToDoctors} className="hover:text-teal-600 transition-colors cursor-pointer">Врачи</button>
            <button onClick={scrollToAbout} className="hover:text-teal-600 transition-colors cursor-pointer">О клинике</button>
            <button onClick={scrollToBooking} className="hover:text-teal-600 transition-colors cursor-pointer font-bold text-teal-600 underline decoration-teal-200 underline-offset-4">Диагностика</button>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20" onClick={() => setBookingOpen(true)} data-testid="button-book-header">
            <Phone className="w-4 h-4 mr-2" />
            Срочный вызов
          </Button>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-teal-50 text-teal-600 border-teal-100 px-4 py-1">
              <Sparkles className="w-3 h-3 mr-2" />
              Премиальный сервис в Туле
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-[1.1] text-gray-900 tracking-tight">
              Ваша улыбка —<br /> 
              <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent italic">
                произведение искусства
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Инновационная клиника: от цифровой диагностики до эстетического восстановления. Почувствуйте разницу с первого визита.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 h-14 rounded-full shadow-xl shadow-teal-600/20" onClick={scrollToBooking} data-testid="button-book-hero">
                <Activity className="w-5 h-5 mr-2" />
                Начать диагностику
              </Button>
              <Button size="lg" variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 h-14 px-8 rounded-full" onClick={scrollToServices} data-testid="button-prices">
                Прайс-лист
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-teal-500/10 rounded-[3rem] blur-3xl" />
            <img 
              src={smileImg} 
              alt="Здоровая улыбка" 
              className="rounded-[2.5rem] shadow-2xl relative z-10 border-8 border-white"
            />
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl z-20 border border-teal-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-inner">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <div className="font-black text-2xl text-teal-900 leading-none">4.9 / 5</div>
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-1">Рейтинг клиники</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Interactive Diagnostic Section */}
      <section ref={bookingRef} className="py-24 bg-teal-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-teal-400/10 text-teal-400 border-teal-400/20">Интерактивная карта</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Где именно вас<br /> беспокоит зуб?
              </h2>
              <p className="text-teal-100/60 text-lg mb-10 leading-relaxed">
                Выберите область на интерактивной карте зубов. Это поможет нашему специалисту подготовиться к вашему приёму заранее.
              </p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-teal-400" />
                    Тип боли
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["Острая", "Ноющая", "На холодное", "На горячее"].map((pain) => (
                      <Button key={pain} variant="outline" className="border-white/10 text-white hover:bg-teal-500/20 hover:border-teal-400">
                        {pain}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 p-8 backdrop-blur-md">
              <div className="text-center mb-8">
                <div className="text-xs uppercase tracking-[0.2em] text-teal-400 font-black mb-2">Выберите номер зуба</div>
                <div className="h-px w-20 bg-teal-500/50 mx-auto" />
              </div>
              
              <div className="space-y-12">
                <div>
                  <div className="text-[10px] text-center text-teal-500 uppercase font-bold mb-4 tracking-widest">Верхняя челюсть</div>
                  <div className="grid grid-cols-8 gap-2">
                    {teethData.slice(0, 16).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTooth(t.id)}
                        className={`h-10 rounded-md border text-[10px] font-bold transition-all ${
                          selectedTooth === t.id 
                            ? "bg-teal-500 border-teal-400 text-white scale-110 shadow-lg shadow-teal-500/40" 
                            : "bg-white/5 border-white/10 text-teal-300/50 hover:border-teal-500/50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-center text-teal-500 uppercase font-bold mb-4 tracking-widest">Нижняя челюсть</div>
                  <div className="grid grid-cols-8 gap-2">
                    {teethData.slice(16).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTooth(t.id)}
                        className={`h-10 rounded-md border text-[10px] font-bold transition-all ${
                          selectedTooth === t.id 
                            ? "bg-teal-500 border-teal-400 text-white scale-110 shadow-lg shadow-teal-500/40" 
                            : "bg-white/5 border-white/10 text-teal-300/50 hover:border-teal-500/50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTooth && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 p-4 bg-teal-500/20 rounded-xl border border-teal-500/30 text-center"
                >
                  <p className="text-sm font-bold">Выбран зуб №{selectedTooth}</p>
                  <Button className="mt-3 bg-teal-500 hover:bg-teal-600 w-full" onClick={() => setBookingOpen(true)}>
                    Продолжить запись
                  </Button>
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Visualizer / Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100">Портфолио</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Результаты, которые<br /> меняют жизнь
              </h2>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
              <button 
                onClick={() => setActiveTab("services")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "services" ? "bg-white text-teal-700 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
              >
                Виды работ
              </button>
              <button 
                onClick={() => setActiveTab("smile")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "smile" ? "bg-white text-teal-700 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
              >
                До / После
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "services" ? (
              <motion.div 
                key="services"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services.map((s, i) => (
                  <Card key={s.id} className="group overflow-hidden bg-white border-gray-100 hover:border-teal-200 transition-all hover:shadow-2xl hover:shadow-teal-500/5">
                    <div className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <s.icon className="w-7 h-7 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{s.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{s.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="text-2xl font-black text-teal-600">от {formatPrice(s.price)} ₽</div>
                        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 font-bold">Подробнее</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="smile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {[
                  { title: "Тотальное восстановление", before: instrumentsImg, after: smileImg, tags: ["Виниры", "Имплантация"] },
                  { title: "Эстетическая реставрация", before: xrayImg, after: heroImg, tags: [" ZOOM 4", "Чистка"] }
                ].map((item, i) => (
                  <Card key={i} className="overflow-hidden border-gray-100 group">
                    <div className="flex h-72 border-b border-gray-100">
                      <div className="w-1/2 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                        <img src={item.before} className="w-full h-full object-cover" alt="До" />
                        <Badge className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-md border-0 text-[10px] font-black tracking-widest">ДО</Badge>
                      </div>
                      <div className="w-1/2 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                        <img src={item.after} className="w-full h-full object-cover" alt="После" />
                        <Badge className="absolute top-4 right-4 bg-teal-500/80 backdrop-blur-md border-0 text-[10px] font-black tracking-widest">ПОСЛЕ</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-4">
                        {item.tags.map(t => <Badge key={t} variant="secondary" className="bg-teal-50 text-teal-700 text-[10px] font-bold">{t}</Badge>)}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Doctors Section Enhanced */}
      <section ref={doctorsRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200">Команда экспертов</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Мастера вашей улыбки</h2>
            <p className="text-gray-500">Врачи с международным опытом и сотнями успешных кейсов</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {doctors.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -10 }}
                className="relative"
              >
                <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-gray-200/50">
                  <div className="grid sm:grid-cols-2 h-full">
                    <div className="relative aspect-square sm:aspect-auto">
                      <img src={doc.image} className="w-full h-full object-cover" alt={doc.name} />
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-teal-50 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${doc.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                          {doc.status === 'online' ? 'В клинике' : 'На операции'}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                      <p className="text-teal-600 font-bold text-sm mb-4">{doc.role}</p>
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Award className="w-4 h-4 text-teal-500" />
                          <span>Опыт: {doc.experience}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <UserCheck className="w-4 h-4 text-teal-500" />
                          <span>Специализация: {doc.specialization}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-teal-50 text-teal-700 hover:bg-teal-100 border-0 font-bold" onClick={() => setBookingOpen(true)}>
                        Записаться к врачу
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Contact Form */}
      <section ref={contactRef} className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-700 transform skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-none italic">
                ГОТОВЫ К<br /> ПЕРЕМЕНАМ?
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-teal-100/60 text-sm font-bold uppercase tracking-widest mb-1">Горячая линия</p>
                    <a href="tel:+74951234567" className="text-2xl font-black hover:text-teal-100 transition-colors">+7 (495) 123-45-67</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-teal-100/60 text-sm font-bold uppercase tracking-widest mb-1">Где мы находимся</p>
                    <p className="text-2xl font-black leading-tight">г. Тула, пр. Ленина, д. 45, офис 102</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white p-10 rounded-[2rem] shadow-2xl border-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Напишите нам</h3>
              <p className="text-gray-500 mb-8 text-sm">Мы подберем удобное время для консультации</p>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ваше имя</Label>
                    <Input className="bg-gray-50 border-gray-100 h-12 rounded-xl focus:ring-teal-500" placeholder="Алексей" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Телефон</Label>
                    <Input className="bg-gray-50 border-gray-100 h-12 rounded-xl focus:ring-teal-500" placeholder="+7..." required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Сообщение (необязательно)</Label>
                  <Textarea className="bg-gray-50 border-gray-100 rounded-xl min-h-[100px] focus:ring-teal-500" placeholder="Опишите вашу проблему..." />
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black h-14 rounded-xl shadow-xl shadow-teal-600/20 uppercase tracking-widest">
                  Отправить запрос
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SmileCare</span>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            © 2026 SmileCare Clinic. Демо-концепт <span className="text-teal-600">MP.WebStudio</span>
          </div>
          <div className="flex gap-6 grayscale opacity-50">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}
