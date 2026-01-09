import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Calendar, Star, Users, Sun, Palmtree, Mountain, Ship, ArrowLeft, Clock, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import travelHeroImg from "@assets/generated_images/tropical_beach_travel_destination.webp";
import maldivesImg from "@assets/generated_images/maldives_beach_paradise_resort.webp";
import parisImg from "@assets/generated_images/paris_eiffel_tower_sunset.webp";
import baliImg from "@assets/generated_images/bali_rice_terraces_tropical.webp";
import dubaiImg from "@assets/generated_images/dubai_skyline_night_burj.webp";
import santoriniImg from "@assets/generated_images/santorini_greece_blue_domes.webp";
import tokyoImg from "@assets/generated_images/tokyo_neon_cityscape_night.webp";
import luxuryHero from "@assets/generated_images/luxury_overwater_villa_maldives_luxury_travel_hero.webp";
import itineraryPreview from "@assets/generated_images/personalized_travel_itinerary_generator_interface_preview.webp";

const destinations = [
  { 
    id: 1, 
    name: "Мальдивы", 
    country: "Мальдивы",
    image: maldivesImg,
    price: 185000, 
    duration: "7 ночей",
    rating: 4.9,
    reviews: 234,
    tag: "Пляжный отдых"
  },
  { 
    id: 2, 
    name: "Париж", 
    country: "Франция",
    image: parisImg,
    price: 95000, 
    duration: "5 ночей",
    rating: 4.8,
    reviews: 512,
    tag: "Романтика"
  },
  { 
    id: 3, 
    name: "Бали", 
    country: "Индонезия",
    image: baliImg,
    price: 125000, 
    duration: "10 ночей",
    rating: 4.7,
    reviews: 389,
    tag: "Экзотика"
  },
  { 
    id: 4, 
    name: "Дубай", 
    country: "ОАЭ",
    image: dubaiImg,
    price: 145000, 
    duration: "7 ночей",
    rating: 4.8,
    reviews: 456,
    tag: "Люкс"
  },
  { 
    id: 5, 
    name: "Санторини", 
    country: "Греция",
    image: santoriniImg,
    price: 110000, 
    duration: "6 ночей",
    rating: 4.9,
    reviews: 278,
    tag: "Острова"
  },
  { 
    id: 6, 
    name: "Токио", 
    country: "Япония",
    image: tokyoImg,
    price: 175000, 
    duration: "8 ночей",
    rating: 4.8,
    reviews: 321,
    tag: "Культура"
  },
];

const categories = [
  { icon: Sun, name: "Пляжный отдых", count: 124 },
  { icon: Mountain, name: "Горы", count: 56 },
  { icon: Ship, name: "Круизы", count: 32 },
  { icon: Palmtree, name: "Экзотика", count: 78 },
];

const stats = [
  { value: "15+", label: "Лет опыта" },
  { value: "50K+", label: "Довольных клиентов" },
  { value: "100+", label: "Направлений" },
  { value: "24/7", label: "Поддержка" },
];

export default function TravelAgency() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "" });
  const [consultPhone, setConsultPhone] = useState("");
  const [plannerStep, setPlannerStep] = useState(0);
  const [plannerData, setPlannerData] = useState({ style: "", budget: "", duration: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const destinationsRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "WayToTravel — Туристическое агентство | Туры по миру",
    description: "Подберём идеальный тур для вас. Мальдивы, Париж, Бали, Дубай, Санторини. 15+ лет опыта, 50K+ довольных клиентов. Консультация и бронирование онлайн.",
    keywords: "туризм, туры, путешествия, агентство, Мальдивы, Бали, Дубай, горячие туры",
    ogTitle: "WayToTravel — Туристическое агентство | Дизайн от MP.WebStudio",
    ogDescription: "Незабываемые путешествия по всему миру. Консультация и бронирование онлайн",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/travel",
    canonical: "https://mp-webstudio.ru/demo/travel"
  });

  const avgDestRating = (destinations.reduce((sum, d) => sum + d.rating, 0) / destinations.length).toFixed(1);
  const totalDestReviews = destinations.reduce((sum, d) => sum + d.reviews, 0);

  useAggregateRatingSchema({
    name: "WayToTravel Туристическое агентство",
    description: "Туристическое агентство с опытом 15+ лет и 50K+ довольных клиентов",
    data: {
      ratingValue: parseFloat(avgDestRating),
      ratingCount: totalDestReviews
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "WayToTravel", url: "https://mp-webstudio.ru/demo/travel" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(x => x !== id));
    } else {
      setFavorites(prev => [...prev, id]);
      const dest = destinations.find(d => d.id === id);
      toast({
        title: "Добавлено в избранное",
        description: dest?.name,
      });
    }
  };

  const openBooking = (dest: typeof destinations[0]) => {
    setSelectedDestination(dest);
    setBookingOpen(true);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingOpen(false);
      setBookingSuccess(false);
      setSelectedDestination(null);
      setBookingForm({ name: "", phone: "", email: "" });
    }, 2000);
  };

  const handleConsultation = () => {
    if (!consultPhone) return;
    toast({ title: "Заявка принята!", description: "Менеджер свяжется с вами в ближайшее время" });
    setConsultPhone("");
  };

  const scrollToDestinations = () => destinationsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToCategories = () => categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {favorites.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge className="bg-sky-500 text-white border-0 px-4 py-2 text-sm shadow-lg">
            <Heart className="w-4 h-4 mr-2 inline fill-current" />
            В избранном: {favorites.length}
          </Badge>
        </div>
      )}

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-500" />
              Заявка на тур
            </DialogTitle>
          </DialogHeader>
          
          {bookingSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Заявка отправлена!</h3>
              <p className="text-muted-foreground">Менеджер свяжется с вами в ближайшее время</p>
            </div>
          ) : (
            <>
              {selectedDestination && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                  <img src={selectedDestination.image} alt={selectedDestination.name} className="w-16 h-12 rounded object-cover" />
                  <div>
                    <p className="font-semibold">{selectedDestination.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedDestination.duration} | от {formatPrice(selectedDestination.price)} р</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <Label htmlFor="book-name">Ваше имя</Label>
                  <Input 
                    id="book-name"
                    value={bookingForm.name} 
                    onChange={(e) => setBookingForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="book-phone">Телефон</Label>
                  <Input 
                    id="book-phone"
                    type="tel"
                    value={bookingForm.phone} 
                    onChange={(e) => setBookingForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="book-email">Email</Label>
                  <Input 
                    id="book-email"
                    type="email"
                    value={bookingForm.email} 
                    onChange={(e) => setBookingForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="ivan@mail.ru"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-teal-500">
                  Отправить заявку
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <header className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none transition-transform duration-1000 scale-105" 
          style={{ 
            backgroundImage: `url(${luxuryHero})`,
            filter: "brightness(0.7)"
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
        
        <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/#portfolio">
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 no-default-hover-elevate h-9 w-9"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </Button>
            </Link>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tighter flex items-center gap-2">
                <Plane className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                TravelDream
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-amber-400/80 font-medium">Роскошные экспедиции</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[13px] uppercase tracking-widest text-white/70 font-medium">
            <button onClick={scrollToDestinations} className="hover:text-amber-400 transition-colors cursor-pointer">Направления</button>
            <button onClick={scrollToCategories} className="hover:text-amber-400 transition-colors cursor-pointer">Впечатления</button>
            <button onClick={scrollToContact} className="hover:text-amber-400 transition-colors cursor-pointer">Консьерж</button>
          </div>
          <div className="flex items-center gap-2">
            <Button className="hidden sm:flex bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold px-4 md:px-8 rounded-full transition-all hover:scale-105 text-xs md:text-sm h-9 md:h-10" data-testid="button-consultation">
              ЗАКАЗАТЬ ЗВОНОК
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white bg-white/10 backdrop-blur-md border border-white/20 h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Users className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[60] lg:hidden flex flex-col p-8 pt-24 gap-8">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-6 right-6 text-white h-10 w-10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="w-6 h-6 rotate-45" />
              </Button>
              <button onClick={() => { scrollToDestinations(); setMobileMenuOpen(false); }} className="text-2xl font-bold text-white text-left">Направления</button>
              <button onClick={() => { scrollToCategories(); setMobileMenuOpen(false); }} className="text-2xl font-bold text-white text-left">Впечатления</button>
              <button onClick={() => { scrollToContact(); setMobileMenuOpen(false); }} className="text-2xl font-bold text-white text-left">Консьерж</button>
              <Button className="mt-auto bg-amber-400 text-slate-950 font-bold h-14 rounded-xl text-lg" onClick={() => setMobileMenuOpen(false)}>
                ЗАКАЗАТЬ ЗВОНОК
              </Button>
            </div>
          )}
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="h-[1px] w-8 md:w-12 bg-amber-400" />
              <span className="text-amber-400 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold">Направления мирового уровня</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 leading-[1] md:leading-[0.9] text-white tracking-tighter">
              ОТКРОЙТЕ <br />
              <span className="italic font-serif text-amber-400">Уникальные</span> <br />
              ПУТЕШЕСТВИЯ
            </h1>
            <p className="text-base md:text-xl text-white/70 mb-8 md:mb-12 max-w-xl leading-relaxed">
              Курируем эксклюзивный отдых для тех, кто ищет исключительное. Мы создаем не просто туры, а легенды.
            </p>

            <Card className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                    <Input 
                      placeholder="Куда отправимся?" 
                      className="pl-12 h-14 md:h-16 border-0 bg-transparent text-white placeholder:text-white/40 text-base md:text-lg focus-visible:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-[1px] bg-white/20 hidden md:block my-3" />
                  <div className="flex-1 relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                    <Input 
                      type="date" 
                      className="pl-12 h-14 md:h-16 border-0 bg-transparent text-white [color-scheme:dark] text-base md:text-lg focus-visible:ring-0"
                    />
                  </div>
                </div>
                <Button className="h-14 md:h-16 px-10 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-base md:text-lg rounded-xl w-full md:w-auto" onClick={scrollToDestinations}>
                  ИСКАТЬ
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </header>

      {/* Unique AI Feature Section */}
      <section className="py-20 md:py-32 bg-slate-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-400/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-amber-400 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold mb-4 block">Экспериментальные технологии</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">
                УМНЫЙ <span className="text-amber-400 italic font-serif">Генератор</span> МАРШРУТОВ
              </h2>
              <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-12 leading-relaxed">
                Испытайте будущее планирования путешествий. Наш интеллектуальный движок создает пошаговый маршрут, основанный на вашей уникальной личности и предпочтениях.
              </p>
              
              <div className="space-y-6">
                <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <span className="text-white font-bold text-sm md:text-base">Шаг {plannerStep + 1} из 3</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`h-1 w-6 md:w-8 rounded-full ${i <= plannerStep ? 'bg-amber-400' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </div>
                  
                  {plannerStep === 0 && (
                    <div className="space-y-4">
                      <p className="text-white/80 text-sm md:text-base">Выберите стиль путешествия:</p>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {['Релакс', 'Приключения', 'Культура', 'Гастрономия'].map(style => (
                          <Button 
                            key={style}
                            variant="outline" 
                            className={`h-12 md:h-14 border-white/10 text-white hover:bg-amber-400 hover:text-slate-950 text-xs md:text-sm ${plannerData.style === style ? 'bg-amber-400 text-slate-950' : ''}`}
                            onClick={() => setPlannerData(d => ({ ...d, style }))}
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {plannerStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-white/80 text-sm md:text-base">Выберите уровень бюджета:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                        {['Премиум', 'Люкс', 'Ультра-Люкс'].map(b => (
                          <Button 
                            key={b}
                            variant="outline" 
                            className={`h-12 md:h-14 border-white/10 text-white hover:bg-amber-400 hover:text-slate-950 text-xs md:text-sm ${plannerData.budget === b ? 'bg-amber-400 text-slate-950' : ''}`}
                            onClick={() => setPlannerData(d => ({ ...d, budget: b }))}
                          >
                            {b}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {plannerStep === 2 && (
                    <div className="py-4 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-400 text-slate-950 mb-4">
                        <Star className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                      </div>
                      <h3 className="text-white text-lg md:text-xl font-bold mb-2">Готово к генерации?</h3>
                      <p className="text-white/60 text-xs md:text-sm mb-6">Наш движок обрабатывает вашу уникальную {plannerData.style} экспедицию уровня {plannerData.budget}.</p>
                      <Button className="w-full h-12 md:h-14 bg-amber-400 text-slate-950 font-bold text-sm md:text-base" onClick={() => {
                        toast({ title: "Маршрут сгенерирован", description: "Проверьте почту, мы отправили ваш персональный PDF!" });
                        setPlannerStep(0);
                      }}>
                        СГЕНЕРИРОВАТЬ МАРШРУТ
                      </Button>
                    </div>
                  )}

                  {plannerStep < 2 && (
                    <Button 
                      className="w-full mt-6 h-12 md:h-14 bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm md:text-base"
                      onClick={() => setPlannerStep(s => s + 1)}
                      disabled={plannerStep === 0 ? !plannerData.style : !plannerData.budget}
                    >
                      ПРОДОЛЖИТЬ
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-first lg:order-last"
            >
              <div className="absolute inset-0 bg-amber-400/20 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
              <Card className="relative overflow-hidden border-white/10 bg-slate-900 shadow-2xl rounded-2xl md:rounded-3xl aspect-[4/3] md:aspect-auto">
                <img src={itineraryPreview} alt="Itinerary Engine" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-white font-medium text-[10px] md:text-sm uppercase tracking-wider">Вычисления в реальном времени</span>
                  </div>
                  <p className="text-white/80 text-[10px] md:text-sm">Разработано для создания уникальных путей, которые невозможно воссоздать в стандартных конструкторах.</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={destinationsRef} className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-[1px] w-8 md:w-12 bg-sky-500" />
                <span className="text-sky-500 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold">Лучшие предложения</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                ПОПУЛЯРНЫЕ <span className="text-sky-500 italic font-serif">Направления</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 md:h-12 md:w-12 border-slate-200 dark:border-slate-800"><MapPin className="w-4 h-4 md:w-5 md:h-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 md:h-12 md:w-12 border-slate-200 dark:border-slate-800"><Calendar className="w-4 h-4 md:w-5 md:h-5" /></Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl md:rounded-3xl hover-elevate">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 border-0 font-bold px-3 py-1 rounded-full text-[10px] md:text-xs">
                      {dest.tag}
                    </Badge>
                    <button 
                      onClick={() => toggleFavorite(dest.id)}
                      className={`absolute top-4 right-4 h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all ${favorites.includes(dest.id) ? 'bg-rose-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/40'}`}
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 ${favorites.includes(dest.id) ? 'fill-current' : ''}`} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        {dest.duration}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-current" />
                        {dest.rating}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 md:p-8">
                    <div className="flex items-center gap-2 text-sky-500 mb-2">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{dest.country}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">{dest.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] md:text-xs text-slate-500 block uppercase tracking-tighter">от</span>
                        <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{formatPrice(dest.price)} <span className="text-sm font-normal">₽</span></span>
                      </div>
                      <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-sky-500 dark:hover:bg-sky-500 dark:hover:text-white rounded-full px-4 md:px-6 h-10 md:h-12 font-bold transition-all text-xs md:text-sm" onClick={() => openBooking(dest)}>
                        ВЫБРАТЬ
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={categoriesRef} className="py-20 md:py-32 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <span className="text-sky-500 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold mb-4 md:mb-6 block">Найдите свой стиль</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6 md:mb-8">
              ВПЕЧАТЛЕНИЯ ДЛЯ <span className="text-sky-500 italic font-serif">Каждого</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">От спокойного пляжного отдыха до экстремальных экспедиций в самые отдаленные уголки планеты.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group p-6 md:p-10 text-center border-0 bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-500 dark:hover:bg-sky-500 transition-all duration-500 rounded-2xl md:rounded-3xl cursor-pointer hover-elevate overflow-visible">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-sky-500 group-hover:text-sky-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-2">{cat.name}</h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 group-hover:text-white/80 uppercase tracking-widest">{cat.count} туров</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl md:rounded-[3rem] p-8 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16 overflow-hidden">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 leading-tight uppercase tracking-tighter">
                ГОТОВЫ К <br className="hidden md:block" /> СЛЕДУЮЩЕМУ <span className="text-slate-900">Приключению?</span>
              </h2>
              <p className="text-white/90 text-base md:text-xl mb-8 md:mb-12 font-medium">Оставьте заявку сейчас и получите персональную скидку 10% на ваш первый люкс-тур.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Input 
                  placeholder="Ваш телефон" 
                  className="h-12 md:h-16 px-6 md:px-8 bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-full text-base md:text-lg focus:ring-white/50 w-full sm:w-auto sm:min-w-[300px]" 
                  value={consultPhone}
                  onChange={(e) => setConsultPhone(e.target.value)}
                />
                <Button className="h-12 md:h-16 px-8 md:px-12 bg-white text-sky-500 hover:bg-slate-100 font-bold text-base md:text-lg rounded-full shrink-0" onClick={handleConsultation}>
                  ЖДУ ЗВОНКА
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-white/20 blur-[80px] rounded-full animate-pulse" />
              <Plane className="w-32 h-32 md:w-48 md:h-48 text-white/20 rotate-12 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      <footer ref={contactRef} className="py-12 md:py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
            <div className="col-span-full lg:col-span-1">
              <div className="flex flex-col mb-8">
                <span className="text-2xl font-bold text-white tracking-tighter flex items-center gap-2">
                  <Plane className="w-6 h-6 text-sky-500" />
                  TravelDream
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-sky-500/80 font-medium">Роскошные экспедиции</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8">Создаем исключительные путешествия для тех, кто ценит комфорт, приватность и безупречный сервис.</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 md:mb-8 text-sky-500">Навигация</h4>
              <ul className="space-y-3 md:space-y-4 text-slate-400">
                <li><button onClick={scrollToDestinations} className="hover:text-white transition-colors">Направления</button></li>
                <li><button onClick={scrollToCategories} className="hover:text-white transition-colors">Впечатления</button></li>
                <li><button onClick={scrollToContact} className="hover:text-white transition-colors">Консьерж-сервис</button></li>
                <li><a href="#" className="hover:text-white transition-colors">О компании</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 md:mb-8 text-sky-500">Контакты</h4>
              <ul className="space-y-3 md:space-y-4 text-slate-400">
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-sky-500" /> Москва, Пресненская наб., 12</li>
                <li className="flex items-center gap-3"><Users className="w-4 h-4 text-sky-500" /> 8 (800) 555-35-35</li>
                <li className="flex items-center gap-3"><Plane className="w-4 h-4 text-sky-500" /> welcome@traveldream.ru</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 md:mb-8 text-sky-500">Соцсети</h4>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Button key={i} variant="outline" size="icon" className="rounded-full border-slate-800 bg-slate-900/50 hover:bg-sky-500 hover:border-sky-500 h-10 w-10 md:h-12 md:w-12 transition-all">
                    <Star className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 md:pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs md:text-sm">
            <p>© 2024 TravelDream Luxury Expeditions. Все права защищены.</p>
            <p className="flex items-center gap-2">Designed with <Heart className="w-3 h-3 text-rose-500 fill-current" /> by MP.WebStudio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
