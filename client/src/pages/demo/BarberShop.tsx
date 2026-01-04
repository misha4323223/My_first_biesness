import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Scissors, Clock, MapPin, Phone, Star, Calendar, User, Check, ArrowLeft, Instagram, X, Plus, Minus, MessageSquare, Quote, HelpCircle, ShieldCheck, Zap, Coffee, Map as MapIcon, LogIn } from "lucide-react";
import { SiVk } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
import barberHeroImg from "@assets/generated_images/stylish_barbershop_interior.webp";
import barberHeroVideo from "@assets/generated_videos/cinematic_barbershop_interior_slow_motion.mp4";
import alexeyImg from "@assets/generated_images/russian_barber_alexey_portrait.webp";
import dmitryImg from "@assets/generated_images/russian_barber_dmitry_portrait.webp";
import maximImg from "@assets/generated_images/russian_barber_maxim_portrait.webp";
import galleryImg1 from "@assets/generated_images/modern_undercut_fade_haircut.webp";
import galleryImg2 from "@assets/generated_images/professional_beard_styling_result.webp";
import galleryImg3 from "@assets/generated_images/classic_gentleman_side_part.webp";
import galleryImg4 from "@assets/generated_images/trendy_textured_crop_fade.webp";
import pomadeImg from "@assets/generated_images/premium_hair_pomade_product_photography.png";
import beardOilImg from "@assets/generated_images/luxury_beard_oil_product_photography.png";
import shampooImg from "@assets/generated_images/premium_beard_shampoo_product_photography.png";

const reviews = [
  {
    id: 1,
    author: "Иван С.",
    date: "15 октября 2025",
    text: "Лучший барбершоп в городе! Алексей настоящий мастер своего дела. Стрижка идеальная, атмосфера на высоте.",
    rating: 5,
    source: "Яндекс.Карты"
  },
  {
    id: 2,
    author: "Михаил П.",
    date: "2 ноября 2025",
    text: "Хожу сюда уже год. Всегда отличный результат и вкусный кофе. Рекомендую 'Стрижку + бороду'.",
    rating: 5,
    source: "Google Maps"
  },
  {
    id: 3,
    author: "Артем К.",
    date: "12 декабря 2025",
    text: "Приятное место, стерильные инструменты и вежливый персонал. Цены полностью оправданы качеством.",
    rating: 4,
    source: "Яндекс.Карты"
  }
];

const faqs = [
  {
    question: "Нужно ли мыть голову перед стрижкой?",
    answer: "Не обязательно. Мытье головы входит в стоимость любой стрижки и выполняется мастером перед началом работы."
  },
  {
    question: "Как выбрать подходящего мастера?",
    answer: "Вы можете ознакомиться с портфолио мастеров на сайте или в нашей группе VK. Все наши барберы — профессионалы высокого уровня."
  },
  {
    question: "Есть ли у вас скидки для новых клиентов?",
    answer: "Да, на первый визит действует скидка 20%. Просто скажите об этом администратору или выберите соответствующую акцию при записи."
  }
];

const features = [
  { icon: Coffee, title: "Бесплатный напиток", desc: "Кофе, чай или прохладительные напитки для каждого гостя" },
  { icon: Zap, title: "Стрижка за 45 минут", desc: "Ценим ваше время без ущерба качеству" },
  { icon: ShieldCheck, title: "Стерильность по ГОСТу", desc: "Многоступенчатая очистка всех инструментов" }
];

const offers = [
  { title: "Первый визит", desc: "Скидка 20% на любую стрижку", badge: "-20%" },
  { title: "Папа + Сын", desc: "Специальная цена на парную стрижку", badge: "Выгодно" },
  { title: "Сертификаты", desc: "Идеальный подарок для мужчины", badge: "New" }
];

const vkFeed = [
  galleryImg1,
  galleryImg2,
  galleryImg3,
  galleryImg4,
  galleryImg1,
  galleryImg2
];

const products = [
  {
    id: 1,
    name: "Помада для укладки",
    brand: "Kings Grooming",
    price: 1800,
    image: pomadeImg,
    description: "Сильная фиксация, матовый финиш"
  },
  {
    id: 2,
    name: "Масло для бороды",
    brand: "Kings Grooming",
    price: 1200,
    image: beardOilImg,
    description: "Питает и смягчает даже самую жесткую бороду"
  },
  {
    id: 3,
    name: "Шампунь для бороды",
    brand: "Kings Grooming",
    price: 1500,
    image: shampooImg,
    description: "Глубокое очищение и свежесть"
  }
];

const services = [
  { id: 1, name: "Мужская стрижка", duration: "45 мин", price: 1500, icon: Scissors },
  { id: 2, name: "Стрижка машинкой", duration: "30 мин", price: 1000, icon: Scissors },
  { id: 3, name: "Моделирование бороды", duration: "30 мин", price: 1200, icon: Scissors },
  { id: 4, name: "Королевское бритьё", duration: "40 мин", price: 1800, icon: Scissors },
  { id: 5, name: "Стрижка + борода", duration: "60 мин", price: 2500, popular: true, icon: Scissors },
  { id: 6, name: "Детская стрижка", duration: "30 мин", price: 800, icon: Scissors },
];

const barbers = [
  { 
    id: 1, 
    name: "Алексей", 
    role: "Старший барбер", 
    experience: "8 лет",
    image: alexeyImg,
    rating: 4.9,
    reviews: 234
  },
  { 
    id: 2, 
    name: "Дмитрий", 
    role: "Барбер", 
    experience: "5 лет",
    image: dmitryImg,
    rating: 4.8,
    reviews: 156
  },
  { 
    id: 3, 
    name: "Максим", 
    role: "Барбер", 
    experience: "3 года",
    image: maximImg,
    rating: 4.7,
    reviews: 89
  },
];

const timeSlots = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const gallery = [
  galleryImg1,
  galleryImg2,
  galleryImg3,
  galleryImg4,
];

export default function BarberShop() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} теперь в вашей корзине`,
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter((item): item is CartItem => item !== null));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const servicesRef = useRef<HTMLElement>(null);
  const barbersRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "KingsCut — Барбершоп в Туле | Мужские стрижки и борода",
    description: "Профессиональная барбершоп с 3 мастерами. Мужские стрижки, королевское бритьё, моделирование бороды. Запись онлайн, опытные барберы.",
    keywords: "барбершоп, мужские стрижки, борода, укладка волос, барбер Тула, стрижка машинкой",
    ogTitle: "KingsCut — Барбершоп | Дизайн от MP.WebStudio",
    ogDescription: "Профессиональные барберы, качественное обслуживание, современный дизайн",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/barber",
    canonical: "https://mp-webstudio.ru/demo/barber"
  });

  const avgRating = (barbers.reduce((sum, b) => sum + b.rating, 0) / barbers.length).toFixed(1);
  const totalReviews = barbers.reduce((sum, b) => sum + b.reviews, 0);

  useAggregateRatingSchema({
    name: "KingsCut Барбершоп",
    description: "Профессиональная барбершоп с опытными мастерами",
    data: {
      ratingValue: parseFloat(avgRating),
      ratingCount: totalReviews
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "KingsCut", url: "https://mp-webstudio.ru/demo/barber" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBarbers = () => barbersRef.current?.scrollIntoView({ behavior: "smooth" });
  const shopRef = useRef<HTMLElement>(null);
  const scrollToShop = () => shopRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleServiceSelect = (id: number) => {
    setSelectedService(id);
    setStep(2);
    scrollToBooking();
    toast({
      title: "Услуга выбрана",
      description: services.find(s => s.id === id)?.name,
    });
  };

  const handleBarberSelect = (id: number) => {
    setSelectedBarber(id);
    setStep(3);
    scrollToBooking();
    toast({
      title: "Мастер выбран",
      description: barbers.find(b => b.id === id)?.name,
    });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    toast({
      title: "Время выбрано",
      description: `${selectedDate} в ${time}`,
    });
  };

  const handleBook = () => {
    if (selectedService && selectedBarber && selectedTime && selectedDate) {
      toast({
        title: "Вы записаны!",
        description: `${services.find(s => s.id === selectedService)?.name} у ${barbers.find(b => b.id === selectedBarber)?.name}`,
      });
      setStep(1);
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedTime(null);
      setSelectedDate("");
    }
  };

   const formatPrice = (price: number) => `${price} ₽`;

  const CartContent = () => (
    <div className="space-y-4 py-4">
      {cart.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          Корзина пуста
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-[60vh] sm:max-h-[400px] overflow-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-neutral-800/50 p-3 rounded-xl border border-neutral-700">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate uppercase tracking-tight text-sm sm:text-base">{item.name}</h4>
                  <p className="text-amber-400 text-sm font-black">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-1 border border-neutral-700">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-neutral-400 hover:text-white"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-4 text-center text-sm font-black">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-neutral-400 hover:text-white"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-neutral-400 font-medium">Итого:</span>
              <span className="text-2xl font-black text-amber-400 uppercase tracking-tighter">{formatPrice(cartTotal)}</span>
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black h-12 uppercase tracking-widest"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              ОФОРМИТЬ ЗАКАЗ
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/#portfolio">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wider uppercase">BLADE</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
            <button onClick={scrollToServices} className="hover:text-amber-400 transition-colors cursor-pointer">Услуги</button>
            <button onClick={scrollToBarbers} className="hover:text-amber-400 transition-colors cursor-pointer">Мастера</button>
            <button onClick={scrollToShop} className="hover:text-amber-400 transition-colors cursor-pointer">Магазин</button>
            <button onClick={scrollToBooking} className="hover:text-amber-400 transition-colors cursor-pointer">Запись</button>
            <button onClick={scrollToContact} className="hover:text-amber-400 transition-colors cursor-pointer">Контакты</button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-neutral-300 hover:text-amber-400 h-9 w-9"
              onClick={() => setIsCartOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold h-9 px-4" data-testid="button-book-header" onClick={scrollToBooking}>
              <span className="text-xs sm:text-sm">Запись</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-neutral-950 pointer-events-none" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
        >
          <source src={barberHeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/40 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center sm:text-left"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-8 sm:mb-6">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] sm:text-xs">
                Премиум барбершоп
              </Badge>
              <Badge variant="outline" className="border-amber-500/50 text-amber-500 animate-pulse text-[10px] sm:text-xs">
                Скидка 20% на первый визит
              </Badge>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              Стиль — это
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent uppercase inline-block">
                искусство
              </span>
            </h1>
            <p className="text-base sm:text-xl text-neutral-300 mb-10 max-w-lg mx-auto sm:mx-0">
              Мужская парикмахерская с атмосферой и вниманием к деталям. Только лучшие мастера и премиальный уход.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-4 mb-12">
              <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 sm:h-14 px-8 text-base" data-testid="button-book-hero" onClick={scrollToBooking}>
                <Calendar className="w-5 h-5 mr-2" />
                Записаться
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-12 sm:h-14 px-8 text-base backdrop-blur-sm" data-testid="button-prices" onClick={scrollToServices}>
                Прайс-лист
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 sm:gap-10 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-200">10:00 - 22:00</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-200">Тула, ул. Пушкина, 15</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-12 sm:py-20 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <f.icon className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-3 gap-4 sm:gap-6 no-scrollbar snap-x px-4 sm:px-0 -mx-4 sm:mx-0">
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[85vw] sm:min-w-0 snap-center first:pl-4 last:pr-4 sm:first:pl-0 sm:last:pr-0"
              >
                <Card className="p-6 sm:p-8 h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 relative overflow-hidden group hover-elevate cursor-pointer">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-500 text-black font-bold">{offer.badge}</Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors uppercase tracking-tight">{offer.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-400 mb-6">{offer.desc}</p>
                  <Button variant="link" className="p-0 h-auto text-amber-500 font-bold" onClick={scrollToBooking}>
                    ПОДРОБНЕЕ →
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="py-12 sm:py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter italic">Услуги и цены</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Премиальный уход для настоящих джентльменов</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {services.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card 
                  className={`p-4 sm:p-6 bg-neutral-900/50 border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer relative overflow-hidden ${selectedService === s.id ? 'border-amber-500 bg-amber-500/5' : ''}`}
                  onClick={() => handleServiceSelect(s.id)}
                >
                  {s.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 uppercase tracking-tighter transform rotate-45 translate-x-4 translate-y-2">
                        BEST
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedService === s.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors'}`}>
                        <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-lg uppercase tracking-tight truncate">{s.name}</h3>
                        <p className="text-xs text-neutral-500 font-medium">{s.duration}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-xl font-black text-amber-400 tracking-tighter">{formatPrice(s.price)}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={barbersRef} className="py-12 sm:py-20 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter italic">Мастера</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Команда профессионалов, влюбленных в свое дело</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {barbers.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card 
                  className={`overflow-hidden bg-neutral-900 border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer ${selectedBarber === b.id ? 'border-amber-500 ring-1 ring-amber-500' : ''}`}
                  onClick={() => handleBarberSelect(b.id)}
                >
                  <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden">
                    <img 
                      src={b.image} 
                      alt={b.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] sm:text-sm font-bold">{b.rating}</span>
                      </div>
                      <h3 className="text-sm sm:text-xl font-black uppercase tracking-tight">{b.name}</h3>
                      <p className="text-[10px] sm:text-sm text-neutral-400 font-medium uppercase tracking-wider">{b.role}</p>
                    </div>
                  </div>
                  <div className="p-2 sm:p-4 flex items-center justify-between border-t border-neutral-800 bg-neutral-950/50">
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-bold uppercase tracking-widest">Опыт {b.experience}</span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-colors">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={shopRef} className="py-12 sm:py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 sm:mb-16">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter italic">Магазин</h2>
              <p className="text-neutral-400">Профессиональная косметика для домашнего ухода</p>
            </div>
            <Button variant="outline" className="border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black font-bold uppercase tracking-widest text-xs h-10 px-6">
              Весь каталог
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-neutral-900 border-neutral-800 overflow-hidden hover-elevate group">
                  <div className="relative aspect-square sm:aspect-[4/5] bg-neutral-800 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors" />
                    <Button 
                      className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-tighter text-[10px] sm:text-xs h-8 sm:h-10"
                      onClick={() => addToCart(p)}
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      В корзину
                    </Button>
                  </div>
                  <div className="p-3 sm:p-6">
                    <div className="text-[10px] sm:text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">{p.brand}</div>
                    <h3 className="font-black text-sm sm:text-xl uppercase tracking-tight mb-1 truncate">{p.name}</h3>
                    <p className="text-[10px] sm:text-sm text-neutral-500 mb-3 sm:mb-4 line-clamp-2 h-8 sm:h-10 leading-tight">{p.description}</p>
                    <div className="text-base sm:text-2xl font-black text-white tracking-tighter">{formatPrice(p.price)}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tighter">Отзывы клиентов</h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">Что говорят о нас те, кто уже доверил нам свой стиль</p>
          </motion.div>

          <div className="flex overflow-x-auto pb-6 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 no-scrollbar snap-x px-4 sm:px-0 -mx-4 sm:mx-0">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[80vw] sm:min-w-0 snap-center first:pl-4 last:pr-4 sm:first:pl-0 sm:last:pr-0"
              >
                <Card className="p-5 sm:p-6 bg-neutral-900 border-neutral-800 h-full flex flex-col group hover-elevate">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-bold uppercase tracking-wider">{review.source}</span>
                  </div>
                  <Quote className="w-8 h-8 text-amber-500/10 mb-4 group-hover:text-amber-500/20 transition-colors" />
                  <p className="text-sm sm:text-base text-neutral-300 mb-6 flex-grow italic leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="font-bold text-sm sm:text-base text-white uppercase tracking-tight">{review.author}</span>
                    <span className="text-[10px] sm:text-xs text-neutral-500">{review.date}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <SiVk className="text-[#4C75A3]" />
                Мы в VK
              </h2>
              <p className="text-neutral-400">Следите за нашими работами и акциями в реальном времени</p>
            </div>
            <Button variant="outline" className="border-neutral-700 hover:bg-[#4C75A3] hover:text-white transition-colors gap-2">
              <SiVk />
              Подписаться на группу
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {vkFeed.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer"
              >
                <img src={img} alt={`Work ${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <SiVk className="text-white w-8 h-8" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-950">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Частые вопросы</h2>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-neutral-800">
                <AccordionTrigger className="text-left hover:text-amber-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section ref={bookingRef} id="booking" className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold mb-6">Онлайн запись</h2>
              <p className="text-neutral-400 mb-8">Запишитесь за 30 секунд. Выберите услугу, мастера и удобное время.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4 mb-12">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}>1</div>
                  <div className={`h-px bg-neutral-800 flex-1 mt-6 transition-colors ${step >= 2 ? 'bg-amber-500' : ''}`} />
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}>2</div>
                  <div className={`h-px bg-neutral-800 flex-1 mt-6 transition-colors ${step >= 3 ? 'bg-amber-500' : ''}`} />
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}>3</div>
                </div>

                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Scissors className="w-5 h-5 text-amber-400" />
                      Выберите услугу
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map(s => (
                        <Button
                          key={s.id}
                          variant={selectedService === s.id ? "default" : "outline"}
                          className={`justify-between h-auto py-4 px-4 ${selectedService === s.id ? 'bg-amber-500 text-black border-amber-500' : 'border-neutral-700 text-white hover:bg-white/5'}`}
                          onClick={() => handleServiceSelect(s.id)}
                        >
                          <div className="text-left">
                            <div className="font-bold">{s.name}</div>
                            <div className="text-xs opacity-70">{s.duration}</div>
                          </div>
                          <div className="font-bold">{s.price}₽</div>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <Button variant="ghost" className="mb-4 -ml-2 text-neutral-400 hover:text-white" onClick={() => setStep(1)}>
                      ← Назад к услугам
                    </Button>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-amber-400" />
                      Выберите мастера
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {barbers.map(b => (
                        <button
                          key={b.id}
                          onClick={() => handleBarberSelect(b.id)}
                          className={`p-4 rounded-xl border transition-all text-center group ${selectedBarber === b.id ? 'border-amber-500 bg-amber-500/10' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'}`}
                        >
                          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-transparent group-hover:border-amber-500/50 transition-colors">
                            <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-bold text-sm">{b.name}</div>
                          <div className="text-[10px] text-amber-400 uppercase tracking-tighter">{b.role}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <Button variant="ghost" className="mb-4 -ml-2 text-neutral-400 hover:text-white" onClick={() => setStep(2)}>
                      ← Назад к мастерам
                    </Button>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      Выберите время
                    </h3>
                    <div className="mb-6">
                      <label className="text-sm text-neutral-500 mb-2 block">Дата визита</label>
                      <Input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map(time => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`h-10 ${selectedTime === time ? 'bg-amber-500 text-black border-amber-500' : 'border-neutral-800 text-neutral-400 hover:text-white'}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-neutral-800 mt-8">
                      <div className="flex justify-between mb-4">
                        <span className="text-neutral-400">Итого к оплате:</span>
                        <span className="text-2xl font-bold text-amber-500">
                          {selectedService ? services.find(s => s.id === selectedService)?.price : 0} ₽
                        </span>
                      </div>
                      <Button 
                        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg"
                        disabled={!selectedTime || !selectedDate}
                        onClick={handleBook}
                        data-testid="button-confirm-booking"
                      >
                        Подтвердить запись
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <Card className="p-6 sm:p-8 bg-neutral-900 border-neutral-800 sticky top-24 rounded-2xl hidden lg:block shadow-2xl shadow-black/50">
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">Ваш визит</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-1">Услуга</div>
                    <div className="text-white font-bold uppercase tracking-tight">{selectedService ? services.find(s => s.id === selectedService)?.name : "Не выбрана"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-1">Мастер</div>
                    <div className="text-white font-bold uppercase tracking-tight">{selectedBarber ? barbers.find(b => b.id === selectedBarber)?.name : "Не выбран"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Дата и время</div>
                    <div className="text-white font-medium">
                      {selectedDate && selectedTime ? `${selectedDate} в ${selectedTime}` : "Не выбраны"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section ref={contactRef} id="contacts" className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Наши контакты</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-lg">Адрес</h4>
                    <p className="text-neutral-400">г. Тула, ул. Пушкина, 15</p>
                    <p className="text-xs text-neutral-500 mt-1">Рядом с ТЦ «Гостиный Двор»</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-lg">Телефон</h4>
                    <a href="tel:+79991234567" className="text-neutral-400 hover:text-amber-400 transition-colors">+7 (999) 123-45-67</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <SiVk className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-lg">Социальные сети</h4>
                    <p className="text-neutral-400">vk.com/blade_tula</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 rounded-2xl bg-amber-500 text-black">
                <h3 className="text-2xl font-bold mb-2">Запись по телефону</h3>
                <p className="font-medium mb-4">Если вам удобнее записаться через администратора</p>
                <Button size="lg" className="bg-black text-white hover:bg-neutral-800 w-full font-bold">
                  Позвонить нам
                </Button>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden h-[400px] border border-white/5 relative group">
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-center p-8">
                <MapIcon className="w-16 h-16 text-amber-500/30 mb-4 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-xl font-bold mb-2 text-white">Интерактивная карта</h3>
                <p className="text-neutral-500 max-w-xs mb-6">Здесь будет расположена Яндекс.Карта с меткой нашего барбершопа</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-neutral-700 text-white">В Яндекс.Картах</Button>
                  <Button variant="outline" className="border-neutral-700 text-white">В 2ГИС</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-neutral-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-wider">BLADE</span>
              </div>
              <p className="text-sm text-neutral-400">
                Премиум барбершоп для настоящих мужчин
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Услуги</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>Мужские стрижки</li>
                <li>Моделирование бороды</li>
                <li>Королевское бритьё</li>
                <li>Магазин косметики</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Часы работы</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>Пн-Пт: 10:00 - 22:00</li>
                <li>Сб: 10:00 - 20:00</li>
                <li>Вс: 11:00 - 18:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Контакты</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+79991234567" className="hover:text-amber-400 transition-colors">+7 (999) 123-45-67</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ул. Пушкина, 15
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  @blade_barbershop
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
            <p>Демо-сайт создан в <a href="https://mp-webstudio.ru" className="text-amber-400 hover:underline">MP.WebStudio</a></p>
          </div>
        </div>
      </footer>

      {/* Cart Navigation */}
      {isMobile ? (
        <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DrawerContent className="bg-neutral-900 border-neutral-800 text-white px-4 pb-8">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl font-black text-amber-400 flex items-center gap-2 uppercase tracking-tighter">
                <ShoppingCart className="w-6 h-6" />
                Корзина
              </DrawerTitle>
            </DrawerHeader>
            <CartContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-amber-400 flex items-center gap-2 uppercase tracking-tighter">
                <ShoppingCart className="w-6 h-6" />
                Корзина
              </DialogTitle>
            </DialogHeader>
            <CartContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Checkout Success Dialog (Demo) */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="bg-neutral-950 border-neutral-800 text-white text-center p-8 sm:p-12 max-w-lg rounded-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-amber-500/10">
            <Check className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-black mb-4 uppercase tracking-tighter">Заказ принят!</DialogTitle>
          </DialogHeader>
          <div className="text-neutral-400 space-y-4 mb-8 text-sm sm:text-base leading-relaxed">
            <p>Это демонстрация процесса покупки. В реальном магазине клиент был бы перенаправлен на страницу оплаты через защищенный шлюз.</p>
            <p className="text-xs sm:text-sm border-l-2 border-amber-500 pl-4 italic text-left bg-white/5 py-3 rounded-r-lg">
              Интеграция MP.WebStudio включает автоматическую отправку уведомлений в Telegram владельцу и Email-подтверждение клиенту.
            </p>
          </div>
          <Button 
            className="w-full bg-white text-black hover:bg-neutral-200 font-bold h-12 uppercase tracking-widest"
            onClick={() => {
              setIsCheckoutOpen(false);
              setCart([]);
            }}
          >
            ПОНЯТНО
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
