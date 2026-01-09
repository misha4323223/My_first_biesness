import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Clock, MapPin, Phone, Star, Calendar, User, Check, ArrowLeft, Zap, Shield, TrendingUp, Users, Activity, Car, Truck, CarFront, Droplets, Sparkles, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import autoServiceHeroImg from "@assets/generated_images/интерьер_современного_автосервиса.webp";
import serviceImg1 from "@assets/generated_images/техническое_обслуживание_автомобиля_замена_масла.webp";
import serviceImg2 from "@assets/generated_images/техническое_обслуживание_автомобиля_замена_масла.webp";
import serviceImg3 from "@assets/generated_images/техническое_обслуживание_автомобиля_замена_масла.webp";
import serviceImg4 from "@assets/generated_images/обслуживание_тормозной_системы_авто.webp";
import serviceImg5 from "@assets/generated_images/компьютерная_диагностика_автомобиля.webp";
import serviceImg6 from "@assets/generated_images/ремонт_двигателя_автомобиля_механиком.webp";
import mechanic1Img from "@assets/generated_images/портрет_главного_механика_мужчины.webp";
import mechanic2Img from "@assets/generated_images/портрет_мастера_по_ходовой_части_авто.webp";
import mechanic3Img from "@assets/generated_images/портрет_мастера_по_двигателям_мужчины.webp";

const services = [
  { id: 1, name: "ТО 1 (5 000 км)", duration: "1.5 часа", price: 2500, icon: Wrench, image: serviceImg1 },
  { id: 2, name: "ТО 2 (15 000 км)", duration: "2.5 часа", price: 4500, icon: Wrench, image: serviceImg2 },
  { id: 3, name: "Замена масла", duration: "30 мин", price: 800, icon: Zap, image: serviceImg3 },
  { id: 4, name: "Замена тормозных колодок", duration: "1.5 часа", price: 3500, icon: Wrench, image: serviceImg4 },
  { id: 5, name: "Диагностика", duration: "1 час", price: 1500, popular: true, icon: Zap, image: serviceImg5 },
  { id: 6, name: "Полная переборка двигателя", duration: "8 часов", price: 25000, icon: Wrench, image: serviceImg6 },
];

const mechanics = [
  { 
    id: 1, 
    name: "Сергей Петров", 
    role: "Главный механик", 
    experience: "12 лет",
    rating: 4.9,
    reviews: 187,
    status: "online",
    image: mechanic1Img
  },
  { 
    id: 2, 
    name: "Иван Иванов", 
    role: "Мастер по ходовой", 
    experience: "8 лет",
    rating: 4.8,
    reviews: 142,
    status: "busy",
    image: mechanic2Img
  },
  { 
    id: 3, 
    name: "Алексей Сидоров", 
    role: "Мастер по двигателям", 
    experience: "10 лет",
    rating: 4.9,
    reviews: 165,
    status: "online",
    image: mechanic3Img
  },
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const vehicleTypes = [
  { id: "sedan", name: "Седан", multiplier: 1, icon: Car },
  { id: "suv", name: "Внедорожник", multiplier: 1.3, icon: CarFront },
  { id: "truck", name: "Грузовой", multiplier: 1.8, icon: Truck },
];

const additionalServices = [
  { id: "wash", name: "Мойка кузова", price: 500, icon: Droplets },
  { id: "cleaning", name: "Чистка салона", price: 1200, icon: Sparkles },
  { id: "antiseptic", name: "Антисептик", price: 300, icon: ShieldCheck },
];

export default function AutoService() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0].id);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [step, setStep] = useState(1);
  
  const totalPrice = useMemo(() => {
    if (!selectedService) return 0;
    const baseService = services.find(s => s.id === selectedService);
    if (!baseService) return 0;
    
    const vehicle = vehicleTypes.find(v => v.id === selectedVehicle);
    const multiplier = vehicle?.multiplier || 1;
    
    const addonsPrice = selectedAddons.reduce((sum, id) => {
      const addon = additionalServices.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    
    return Math.round(baseService.price * multiplier) + addonsPrice;
  }, [selectedService, selectedVehicle, selectedAddons]);

  const { toast } = useToast();
  const servicesRef = useRef<HTMLElement>(null);
  const mechanicsRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "ТехноПро Сервис — Автосервис | Профессиональное обслуживание",
    description: "Автосервис с опытными механиками. Техническое обслуживание, ремонт, диагностика. Онлайн-запись, качественный сервис, современное оборудование.",
    keywords: "автосервис, техническое обслуживание, ремонт авто, диагностика, запись в автосервис",
    ogTitle: "ТехноПро Сервис — Автосервис | Дизайн от MP.WebStudio",
    ogDescription: "Профессиональный автосервис с опытной командой механиков",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/auto-service",
    canonical: "https://mp-webstudio.ru/demo/auto-service"
  });

  const avgRating = (mechanics.reduce((sum, m) => sum + m.rating, 0) / mechanics.length).toFixed(1);
  const totalReviews = mechanics.reduce((sum, m) => sum + m.reviews, 0);

  useAggregateRatingSchema({
    name: "ТехноПро Сервис",
    description: "Профессиональный автосервис с опытными механиками",
    data: {
      ratingValue: parseFloat(avgRating),
      ratingCount: totalReviews
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "ТехноПро Сервис", url: "https://mp-webstudio.ru/demo/auto-service" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMechanics = () => mechanicsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const availableTimeSlots = useMemo(() => {
    if (!selectedService || !selectedDate) return timeSlots;
    const service = services.find(s => s.id === selectedService);
    if (!service) return timeSlots;
    
    if (service.name.includes("двигателя") || service.duration.includes("8 часов")) {
      return ["08:00", "09:00"];
    }
    return timeSlots;
  }, [selectedService, selectedDate]);

  const handleServiceSelect = (id: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedService(id);
      setStep(2);
      setIsLoading(false);
      toast({
        title: "Услуга выбрана",
        description: services.find(s => s.id === id)?.name,
      });
    }, 600);
  };

  const handleMechanicSelect = (id: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedMechanic(id);
      setStep(3);
      setIsLoading(false);
      toast({
        title: "Мастер выбран",
        description: mechanics.find(m => m.id === id)?.name,
      });
    }, 600);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    toast({
      title: "Время выбрано",
      description: `${selectedDate} в ${time}`,
    });
  };

  const handleBook = () => {
    if (selectedService && selectedMechanic && selectedTime && selectedDate) {
      toast({
        title: "Запись подтверждена!",
        description: "Уведомление отправлено мастеру в Telegram",
      });
      setStep(1);
      setSelectedService(null);
      setSelectedMechanic(null);
      setSelectedTime(null);
      setSelectedDate("");
      setSelectedAddons([]);
      setSelectedVehicle(vehicleTypes[0].id);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-neutral-950 to-neutral-950 pointer-events-none" />
        <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url(${autoServiceHeroImg})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
        
          <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/#portfolio">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 bg-white/10 border border-white/20 hover:bg-white/20"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </Button>
            </Link>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Wrench className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-wider">ТЕХНОПРО</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
            <button onClick={scrollToServices} className="hover:text-blue-400 transition-colors cursor-pointer">Услуги</button>
            <button onClick={scrollToMechanics} className="hover:text-blue-400 transition-colors cursor-pointer">Мастера</button>
            <button onClick={scrollToBooking} className="hover:text-blue-400 transition-colors cursor-pointer">Запись</button>
            <button onClick={scrollToContact} className="hover:text-blue-400 transition-colors cursor-pointer">Контакты</button>
          </div>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold h-9 px-3 md:px-4" onClick={scrollToBooking} data-testid="button-book-header">
            Записаться
          </Button>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 md:mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
              Профессиональный автосервис
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight tracking-tight">
              Ваш автомобиль — в
              <br className="hidden md:block" />{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                надёжных руках
              </span>
            </h1>
            <p className="text-base md:text-xl text-neutral-400 mb-6 md:mb-8 max-w-lg">
              Полное техническое обслуживание и ремонт автомобилей любых марок. Современное оборудование и опытные механики.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full sm:w-auto" onClick={scrollToBooking} data-testid="button-book-hero">
                <Calendar className="w-5 h-5 mr-2" />
                Записаться онлайн
              </Button>
              <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-white/10 w-full sm:w-auto" onClick={scrollToServices} data-testid="button-prices">
                Посмотреть цены
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-10 md:mt-12 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-400">08:00 - 18:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-400">ул. Автозаводская, 28</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+79991234567" className="text-neutral-400 hover:text-blue-400 transition-colors">+7 (999) 123-45-67</a>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section ref={servicesRef} id="services" className="py-12 md:py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Наши услуги</h2>
            <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
              Полный спектр услуг по диагностике, ремонту и техническому обслуживанию
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden bg-neutral-800/50 border-neutral-700 hover-elevate cursor-pointer transition-all ${selectedService === service.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleServiceSelect(service.id)}
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="h-32 md:h-40 relative overflow-hidden bg-neutral-700">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    {service.popular && (
                      <div className="absolute top-2 right-2 md:top-3 md:right-3">
                        <Badge className="bg-blue-500 text-black border-0 text-[10px] md:text-xs">Популярно</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-white line-clamp-1">{service.name}</h3>
                    <div className="flex items-center gap-3 md:gap-4 text-[12px] md:text-sm text-neutral-400 mb-3 md:mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        {service.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl md:text-2xl font-bold text-blue-400">{formatPrice(service.price)} ₽</span>
                      <Button size="sm" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs" data-testid={`button-select-service-${service.id}`}>
                        Выбрать
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={mechanicsRef} id="mechanics" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Наши мастера</h2>
            <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
              Опытные специалисты, прошедшие обучение и сертификацию
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mechanics.map((mechanic, i) => (
              <motion.div
                key={mechanic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden bg-neutral-800/50 border-neutral-700 hover-elevate cursor-pointer ${selectedMechanic === mechanic.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleMechanicSelect(mechanic.id)}
                  data-testid={`card-mechanic-${mechanic.id}`}
                >
                  <div className="aspect-[16/10] sm:aspect-[4/5] relative overflow-hidden bg-neutral-800">
                    <img 
                      src={mechanic.image} 
                      alt={mechanic.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-1 md:gap-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${mechanic.status === 'online' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-bold">
                        {mechanic.status === 'online' ? 'В боксе' : 'Занят'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold mb-0.5 md:mb-1">{mechanic.name}</h3>
                      <p className="text-blue-400 text-xs md:text-sm mb-1.5 md:mb-2">{mechanic.role}</p>
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                        <span className="flex items-center gap-1 text-neutral-300">
                          <Star className="w-3 h-3 md:w-4 md:h-4 text-blue-400 fill-blue-400" />
                          {mechanic.rating}
                        </span>
                        <span className="text-neutral-400">{mechanic.reviews} отзывов</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 md:p-4 border-t border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-neutral-400">Опыт: {mechanic.experience}</span>
                      <Button size="sm" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 h-8 text-xs" data-testid={`button-select-mechanic-${mechanic.id}`}>
                        Выбрать
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={bookingRef} id="booking" className="py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Онлайн-запись</h2>
            <p className="text-neutral-400">
              Выберите услугу, мастера и удобное время
            </p>
          </motion.div>

          <Card className="p-8 bg-neutral-800/50 border-neutral-700">
            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-blue-500/[0.03] rounded-2xl border border-blue-500/10 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-white leading-tight">Живая очередь</h3>
                    <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest font-medium">Real-time status</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 w-fit text-[10px] md:text-xs px-3 py-1 rounded-full">Свободно 2 бокса</Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Бокс 1", status: "busy", progress: 75, color: "bg-amber-500" },
                  { label: "Бокс 2", status: "busy", progress: 40, color: "bg-blue-500" },
                  { label: "Бокс 3", status: "free", progress: 0, color: "bg-neutral-800" },
                  { label: "Бокс 4", status: "busy", progress: 90, color: "bg-green-500" },
                  { label: "Бокс 5", status: "free", progress: 0, color: "bg-neutral-800" },
                ].map((box, i) => (
                  <div key={i} className="group relative">
                    <div className="h-14 rounded-xl bg-neutral-900/50 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:border-blue-500/30">
                      <span className="text-[10px] font-bold text-neutral-400 relative z-10">{box.label}</span>
                      <span className="text-[8px] text-neutral-600 uppercase tracking-tighter relative z-10">
                        {box.status === "free" ? "Свободен" : "В работе"}
                      </span>
                      {box.status === "busy" && (
                        <motion.div 
                          className={`absolute bottom-0 left-0 h-1 ${box.color} shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                          initial={{ width: 0 }}
                          animate={{ width: `${box.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-5 p-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] w-fit">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <p className="text-[10px] md:text-xs text-neutral-400">
                  Ближайший заезд: <span className="text-blue-400 font-bold ml-1">через 15 мин</span>
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">1. Тип автомобиля</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {vehicleTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedVehicle(type.id)}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${
                      selectedVehicle === type.id 
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50' 
                        : 'border-neutral-700 bg-neutral-900/40 hover:border-neutral-600'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:scale-110 ${selectedVehicle === type.id ? 'text-blue-400' : 'text-neutral-500'}`} />
                    <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tighter break-words text-center leading-tight">
                      {type.name}
                    </span>
                    {selectedVehicle === type.id && (
                      <motion.div layoutId="vehicle-active" className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-bl-lg flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">2. Дополнительный сервис</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {additionalServices.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => {
                      setSelectedAddons(prev => 
                        prev.includes(addon.id) 
                          ? prev.filter(id => id !== addon.id)
                          : [...prev, addon.id]
                      );
                    }}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 overflow-hidden ${
                      selectedAddons.includes(addon.id)
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50'
                        : 'border-neutral-700 bg-neutral-900/40 hover:border-neutral-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedAddons.includes(addon.id) ? 'bg-blue-500/20' : 'bg-neutral-800'}`}>
                      <addon.icon className={`w-5 h-5 ${selectedAddons.includes(addon.id) ? 'text-blue-400' : 'text-neutral-500'}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-[11px] md:text-xs font-bold text-white uppercase tracking-tight truncate">
                        {addon.name}
                      </div>
                      <div className="text-[10px] font-medium text-blue-400">+{addon.price} ₽</div>
                    </div>
                    {selectedAddons.includes(addon.id) && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">3. Дата визита</h3>
                  </div>
                  <Input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white h-12 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">4. Время заезда</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-2.5 rounded-xl border text-[11px] font-bold transition-all duration-300 ${
                          selectedTime === time
                            ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-105'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-blue-500/50 hover:text-blue-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">Финальный расчет</div>
                    <div className="text-3xl md:text-4xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">
                      {formatPrice(totalPrice)} <span className="text-lg md:text-xl font-normal text-neutral-500 italic">₽</span>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    disabled={!selectedService || !selectedMechanic || !selectedTime || !selectedDate}
                    onClick={handleBook}
                    className="group relative bg-blue-500 hover:bg-blue-600 text-white font-bold h-14 md:h-16 px-10 md:px-12 rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale overflow-hidden"
                    data-testid="button-confirm-booking"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Подтвердить <ArrowLeft className="w-4 h-4 rotate-180" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </Button>
                </div>
              </div>
            </div>

            {step < 3 && (
              <p className="text-center text-neutral-400 mt-8">
                {step === 1 ? 'Выберите услугу выше' : 'Выберите мастера выше'}
              </p>
            )}
          </Card>
        </div>
      </section>

      <section id="smart-diagnosis" className="py-12 md:py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <Badge className="mb-3 md:mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1">AI Ассистент</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-white">Умная самодиагностика</h2>
            <p className="text-sm md:text-base text-neutral-400">Выберите симптом, и мы подскажем решение</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="bg-neutral-800/50 border-neutral-700 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2 text-white">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-400" /> Что беспокоит?
              </h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  { id: "noise", label: "Странный шум при движении", icon: "🔊" },
                  { id: "brakes", label: "Скрежет при торможении", icon: "🛑" },
                  { id: "engine", label: "Троит или глохнет двигатель", icon: "⚙️" },
                  { id: "fluid", label: "Подтёки под машиной", icon: "💧" },
                ].map((symptom) => (
                  <Button
                    key={symptom.id}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 md:h-14 border-neutral-700 hover:border-blue-500/50 hover:bg-blue-500/5 px-3 md:px-4"
                    onClick={() => {
                      toast({
                        title: "Предварительный диагноз",
                        description: `Для симптома "${symptom.label}" рекомендуем записаться на диагностику.`,
                      });
                    }}
                  >
                    <span className="text-lg md:text-xl">{symptom.icon}</span>
                    <span className="text-[11px] md:text-sm text-white">{symptom.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-600/20 to-neutral-900 p-6 md:p-8 flex flex-col justify-center">
              <div className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 italic text-white">"Не затягивайте"</h3>
              <p className="text-xs md:text-sm text-neutral-400 mb-6 leading-relaxed">
                Своевременное обращение экономит до <span className="text-blue-400 font-bold">40%</span> на стоимости запчастей.
              </p>
              <Button size="sm" className="w-full sm:w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 md:h-11" onClick={scrollToBooking}>
                Консультация
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio-showcase" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-white">Кейсы: До и После</h2>
            <p className="text-sm md:text-base text-neutral-400">Наши результаты говорят сами за себя</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                title: "Ремонт двигателя",
                description: "BMW X5: Капитальный ремонт после перегрева.",
                before: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80",
                after: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80",
                tags: ["Двигатель"]
              },
              {
                title: "Детейлинг кузова",
                description: "Audi A6: Полировка и керамика.",
                before: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80",
                after: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80",
                tags: ["Кузов"]
              }
            ].map((caseItem, i) => (
              <Card key={i} className="bg-neutral-800/50 border-neutral-700 overflow-hidden group">
                <div className="flex h-48 md:h-64 border-b border-neutral-700">
                  <div className="w-1/2 relative overflow-hidden border-r border-neutral-700">
                    <img src={caseItem.before} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="До" />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                      <Badge className="bg-red-500/80 backdrop-blur-md border-0 text-[9px] md:text-xs">ДО</Badge>
                    </div>
                  </div>
                  <div className="w-1/2 relative overflow-hidden">
                    <img src={caseItem.after} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="После" />
                    <div className="absolute top-2 right-2 md:top-4 md:right-4">
                      <Badge className="bg-green-500/80 backdrop-blur-md border-0 text-[9px] md:text-xs">ПОСЛЕ</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex gap-2 mb-2 md:mb-3">
                    {caseItem.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="border-blue-500/30 text-blue-400 text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-white">{caseItem.title}</h3>
                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">{caseItem.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="py-12 md:py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center md:text-left">Как нас найти</h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-base">Адрес</h4>
                    <p className="text-xs md:text-sm text-neutral-400">г. Москва, ул. Автозаводская, 28</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-base">Гарантия</h4>
                    <p className="text-xs md:text-sm text-neutral-400">1 год на все виды работ</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[250px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-neutral-900/90 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-ping" />
                    <span className="text-xs md:text-base font-bold text-white">ТЕХНОПРО СЕРВИС</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-neutral-400">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Остались вопросы?</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-6 md:mt-8">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                <div className="text-left">
                  <p className="text-[10px] md:text-xs text-neutral-500">Телефон</p>
                  <a href="tel:+79991234567" className="text-base md:text-lg font-semibold text-white hover:text-blue-400 transition-colors">+7 (999) 123-45-67</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                <div className="text-left">
                  <p className="text-[10px] md:text-xs text-neutral-500">Режим работы</p>
                  <p className="text-base md:text-lg font-semibold text-white">Пн-Сб: 08:00 - 18:00</p>
                </div>
              </div>
            </div>
          </motion.div>

          <Button 
            variant="ghost" 
            size="sm"
            className="text-[11px] md:text-sm text-neutral-500 hover:text-blue-400 transition-colors mb-8"
            onClick={() => setShowDashboard(!showDashboard)}
          >
            {showDashboard ? "Скрыть панель" : "Панель управления (для владельца)"}
          </Button>

          <AnimatePresence>
            {showDashboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left mb-12">
                  <Card className="bg-neutral-900 border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] md:text-xs text-neutral-400">Доход за сегодня</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-white">142,500 ₽</div>
                    <p className="text-[10px] text-green-500 mt-1">+12% к вчера</p>
                  </Card>
                  <Card className="bg-neutral-900 border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] md:text-xs text-neutral-400">Загрузка боксов</span>
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-white">85%</div>
                    <div className="w-full h-1 bg-neutral-800 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[85%]" />
                    </div>
                  </Card>
                  <Card className="bg-neutral-900 border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] md:text-xs text-neutral-400">Новых клиентов</span>
                      <Users className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-white">+14</div>
                    <p className="text-[10px] text-neutral-500 mt-1">За последние 24 часа</p>
                  </Card>
                  <Card className="bg-neutral-900 border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] md:text-xs text-neutral-400">Telegram активен</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-white">Online</div>
                    <p className="text-[10px] text-amber-500 mt-1">Бот синхронизирован</p>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="py-8 md:py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-neutral-500 text-[11px] md:text-sm">
          <p>© 2026 ТехноПро Сервис. Все права защищены.</p>
          <p className="mt-1">Демо-концепт <span className="text-white">MP.WebStudio</span></p>
        </div>
      </footer>
    </div>
  );
}
