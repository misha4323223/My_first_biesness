import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, MapPin, Phone, Star, Calendar, User, Check, ArrowLeft, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import salonHeroImg from "@assets/stock_images/luxury_beauty_salon__6ff34376.jpg";
import stylist1Img from "@assets/generated_images/professional_woman_portrait_photography.webp";
import stylist2Img from "@assets/generated_images/professional_woman_stylist_portrait_2.png";
import stylist3Img from "@assets/generated_images/professional_woman_stylist_portrait_3.png";
import galleryImg1 from "@assets/generated_images/hair_styling_transformation_close_up.png";
import galleryImg2 from "@assets/generated_images/manicure_nail_art_close_up.png";
import galleryImg3 from "@assets/generated_images/pedicure_spa_treatment_close_up.png";
import galleryImg4 from "@assets/generated_images/eyelash_extension_treatment_detail.png";
import galleryImg5 from "@assets/generated_images/spa_facial_massage_treatment.png";
import galleryImg6 from "@assets/generated_images/modern_luxury_beauty_salon_interior.png";
import svcImg1 from "@assets/generated_images/haircut_service_card_icon.png";
import svcImg2 from "@assets/generated_images/hair_coloring_service_card_icon.png";
import svcImg3 from "@assets/generated_images/manicure_service_card_icon.png";
import svcImg4 from "@assets/generated_images/pedicure_service_card_icon.png";
import svcImg5 from "@assets/generated_images/eyelash_service_card_icon.png";
import svcImg6 from "@assets/generated_images/facial_spa_service_card_icon.png";

const services = [
  { id: 1, name: "Стрижка + укладка", duration: "60 мин", price: 2500, icon: Sparkles, image: svcImg1 },
  { id: 2, name: "Окрашивание волос", duration: "120 мин", price: 4500, icon: Sparkles, popular: true, image: svcImg2 },
  { id: 3, name: "Маникюр", duration: "45 мин", price: 1800, icon: Sparkles, image: svcImg3 },
  { id: 4, name: "Педикюр", duration: "60 мин", price: 2200, icon: Sparkles, image: svcImg4 },
  { id: 5, name: "Наращивание ресниц", duration: "90 мин", price: 3500, icon: Sparkles, image: svcImg5 },
  { id: 6, name: "Массаж лица (SPA)", duration: "45 мин", price: 2800, icon: Zap, image: svcImg6 },
];

const stylists = [
  { 
    id: 1, 
    name: "Виктория", 
    role: "Топ-стилист волос", 
    experience: "10 лет",
    image: stylist1Img,
    rating: 4.9,
    reviews: 345
  },
  { 
    id: 2, 
    name: "Анна", 
    role: "Мастер маникюра", 
    experience: "7 лет",
    image: stylist2Img,
    rating: 4.8,
    reviews: 267
  },
  { 
    id: 3, 
    name: "Елена", 
    role: "SPA-терапевт", 
    experience: "8 лет",
    image: stylist3Img,
    rating: 4.9,
    reviews: 198
  },
];

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const gallery = [
  galleryImg1,
  galleryImg2,
  galleryImg3,
  galleryImg4,
  galleryImg5,
  galleryImg6,
];

export default function BeautySalon() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const servicesRef = useRef<HTMLElement>(null);
  const stylistsRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "Лумина — Салон красоты в Туле | Стрижка, окрашивание, маникюр",
    description: "Премиум салон красоты с опытными стилистами. Стрижка, окрашивание, маникюр, педикюр, наращивание ресниц. Онлайн-запись, профессиональный уход.",
    keywords: "салон красоты, стрижка, окрашивание волос, маникюр, педикюр, ресницы, красота в Туле",
    ogTitle: "Лумина — Салон красоты | Дизайн от MP.WebStudio",
    ogDescription: "Премиум салон красоты с лучшими стилистами города",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/beauty-salon",
    canonical: "https://mp-webstudio.ru/demo/beauty-salon"
  });

  const avgRating = (stylists.reduce((sum, s) => sum + s.rating, 0) / stylists.length).toFixed(1);
  const totalReviews = stylists.reduce((sum, s) => sum + s.reviews, 0);

  useAggregateRatingSchema({
    name: "Лумина Салон красоты",
    description: "Премиум салон красоты с опытными стилистами",
    data: {
      ratingValue: parseFloat(avgRating),
      ratingCount: totalReviews
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "Лумина", url: "https://mp-webstudio.ru/demo/beauty-salon" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToStylists = () => stylistsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleServiceSelect = (id: number) => {
    setSelectedService(id);
    setStep(2);
    toast({
      title: "Услуга выбрана",
      description: services.find(s => s.id === id)?.name,
    });
  };

  const handleStylistSelect = (id: number) => {
    setSelectedStylist(id);
    setStep(3);
    toast({
      title: "Стилист выбран",
      description: stylists.find(s => s.id === id)?.name,
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
    if (selectedService && selectedStylist && selectedTime && selectedDate) {
      toast({
        title: "Вы записаны!",
        description: `${services.find(s => s.id === selectedService)?.name} у ${stylists.find(s => s.id === selectedStylist)?.name}`,
      });
      setStep(1);
      setSelectedService(null);
      setSelectedStylist(null);
      setSelectedTime(null);
      setSelectedDate("");
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <Link href="/#portfolio" className="fixed top-4 left-4 z-[100]">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/80 backdrop-blur-sm border border-stone-200 hover:bg-white shadow-sm"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-5 h-5 text-stone-900" />
        </Button>
      </Link>

      <header className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={salonHeroImg} 
            alt="LUMINA Salon" 
            className="w-full h-full object-cover brightness-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/20 via-transparent to-stone-50" />
        </div>
        
        <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 pl-12">
            <span className="text-3xl font-serif tracking-[0.2em] text-stone-900">LUMINA</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-widest font-medium text-stone-800">
            <button onClick={scrollToServices} className="hover:text-amber-600 transition-colors">Услуги</button>
            <button onClick={scrollToStylists} className="hover:text-amber-600 transition-colors">Команда</button>
            <button onClick={scrollToBooking} className="hover:text-amber-600 transition-colors">Запись</button>
          </div>
          <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-none px-8 py-6 tracking-widest uppercase text-xs" onClick={scrollToBooking}>
            Записаться
          </Button>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-stone-600 uppercase tracking-[0.4em] text-sm mb-6 block">Where Beauty Meets Artistry</span>
            <h1 className="text-6xl md:text-8xl font-serif text-stone-900 mb-8 leading-tight font-light">
              Эстетика <br />
              <span className="italic">совершенства</span>
            </h1>
            <Button 
              size="lg" 
              className="bg-amber-600/90 backdrop-blur-sm text-white hover:bg-amber-700 rounded-none px-12 h-14 tracking-widest uppercase text-xs transition-all hover:scale-105" 
              onClick={scrollToBooking}
            >
              Забронировать визит
            </Button>
          </motion.div>
        </div>
      </header>

      <section className="py-32 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-[1px] bg-amber-600 mx-auto mb-12" />
            <h2 className="text-4xl font-serif mb-10 font-light tracking-wide text-stone-900">Философия LUMINA</h2>
            <p className="text-xl text-stone-600 font-light leading-relaxed tracking-wide italic">
              "Мы не просто создаем образы. Мы раскрываем внутренний свет каждого гостя через архитектурную точность стрижек и магию цвета."
            </p>
            <div className="w-20 h-[1px] bg-amber-600 mx-auto mt-12" />
          </motion.div>
        </div>
      </section>

      <section ref={servicesRef} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-4 block">Наши услуги</span>
              <h2 className="text-5xl font-serif font-light text-stone-900">Signature Services</h2>
            </div>
            <p className="text-stone-500 font-light max-w-sm">Исключительный уход, объединяющий традиции и инновации для вашего преображения.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div 
                  className={`group cursor-pointer ${selectedService === service.id ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="aspect-[16/10] overflow-hidden mb-6 bg-stone-100 relative">
                    <img 
                      src={(service as any).image} 
                      alt={service.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    {service.popular && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-amber-600 text-white rounded-none tracking-widest text-[10px] px-3 py-1 uppercase border-0">Signature</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-serif font-light text-stone-900">{service.name}</h3>
                    <span className="text-amber-600 font-medium">{formatPrice(service.price)} ₽</span>
                  </div>
                  <p className="text-stone-400 text-sm uppercase tracking-widest font-medium">{service.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={stylistsRef} className="py-32 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-4 block">Команда</span>
              <h2 className="text-5xl font-serif font-light text-stone-900">Artisan Stylists</h2>
            </div>
            <p className="text-stone-500 font-light max-w-sm">Наши мастера — архитекторы стиля, создающие искусство в каждой детали вашего образа.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {stylists.map((stylist, i) => (
              <motion.div
                key={stylist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div 
                  className={`group cursor-pointer transition-all duration-700 ${selectedStylist === stylist.id ? 'scale-105' : ''}`}
                  onClick={() => handleStylistSelect(stylist.id)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-8 shadow-2xl">
                    <img 
                      src={stylist.image} 
                      alt={stylist.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <Button className="w-full bg-white text-stone-900 hover:bg-amber-600 hover:text-white rounded-none border-0 tracking-[0.2em] uppercase text-[10px] h-12">
                        Записаться к мастеру
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-8 h-[1px] bg-amber-600" />
                      <span className="text-amber-600 uppercase tracking-widest text-[10px] font-bold">{stylist.role}</span>
                      <div className="w-8 h-[1px] bg-amber-600" />
                    </div>
                    <h3 className="text-3xl font-serif text-stone-900 mb-2">{stylist.name}</h3>
                    <div className="flex items-center justify-center gap-4 text-xs tracking-widest text-stone-400 uppercase">
                      <span>Опыт {stylist.experience}</span>
                      <span className="w-1 h-1 bg-stone-300 rounded-full" />
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-stone-600 font-bold">{stylist.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={bookingRef} className="py-32 bg-stone-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-600 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Reservation</span>
            <h2 className="text-5xl font-serif font-light text-stone-900 mb-6">Онлайн-запись</h2>
            <div className="w-24 h-[1px] bg-amber-600 mx-auto" />
          </div>

          <Card className="p-8 bg-white border-stone-200 shadow-xl rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400" />
            
            <div className="flex items-center justify-between mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md ${
                    step >= s ? 'bg-amber-600 text-white scale-110' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {step > s ? <Check className="w-6 h-6" /> : (
                      s === 1 ? <Sparkles className="w-5 h-5" /> : 
                      s === 2 ? <User className="w-5 h-5" /> : 
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= s ? 'text-amber-600' : 'text-stone-400'}`}>
                    {s === 1 ? 'Услуга' : s === 2 ? 'Мастер' : 'Время'}
                  </span>
                </div>
              ))}
              <div className="absolute top-[52px] left-12 right-12 h-[2px] bg-stone-100 -z-0">
                <div className="h-full bg-amber-600 transition-all duration-700 ease-in-out" style={{ width: `${(step - 1) * 50}%` }} />
              </div>
            </div>

            <div className="min-h-[300px] flex flex-col justify-center">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h3 className="text-xl font-serif text-stone-900 mb-6 text-center">Выберите направление ухода</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s) => (
                      <Button
                        key={s.id}
                        variant="outline"
                        className={`h-auto py-4 px-6 justify-between border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 rounded-xl transition-all ${
                          selectedService === s.id ? 'border-amber-600 bg-amber-50 shadow-inner' : ''
                        }`}
                        onClick={() => handleServiceSelect(s.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium text-stone-900">{s.name}</div>
                          <div className="text-xs text-stone-500">{s.duration}</div>
                        </div>
                        <div className="font-serif text-amber-600">{formatPrice(s.price)} ₽</div>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-stone-400 hover:text-stone-900">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Назад
                    </Button>
                    <h3 className="text-xl font-serif text-stone-900 flex-1 text-center">Ваш персональный стилист</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stylists.map((stylist) => (
                      <div 
                        key={stylist.id}
                        onClick={() => handleStylistSelect(stylist.id)}
                        className={`cursor-pointer group relative rounded-2xl overflow-hidden border-2 transition-all ${
                          selectedStylist === stylist.id ? 'border-amber-600 scale-[1.02]' : 'border-transparent grayscale hover:grayscale-0'
                        }`}
                      >
                        <img src={stylist.image} alt={stylist.name} className="w-full aspect-[3/4] object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="font-bold text-sm">{stylist.name}</div>
                          <div className="text-[10px] uppercase tracking-tighter opacity-80">{stylist.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-stone-400 hover:text-stone-900">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Назад
                    </Button>
                    <h3 className="text-xl font-serif text-stone-900 flex-1 text-center">Дата и время визита</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 px-1">Выберите день</label>
                      <Input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-12 border-stone-200 rounded-xl focus:ring-amber-600 focus:border-amber-600 bg-stone-50/50"
                      />
                    </div>
                    
                    {selectedDate && (
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 px-1">Доступные слоты</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className={`h-10 rounded-lg text-xs font-bold transition-all ${
                                selectedTime === time 
                                ? 'bg-amber-600 text-white border-amber-600 scale-105 shadow-lg' 
                                : 'border-stone-100 text-stone-600 hover:border-amber-200 hover:bg-amber-50/50'
                              }`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {selectedService && selectedStylist && selectedTime && selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-8 bg-stone-900 text-white rounded-2xl shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h4 className="font-serif text-2xl mb-6 italic text-amber-400">Резюме записи</h4>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xs">
                        <div className="text-stone-400 uppercase tracking-tighter mb-0.5">Услуга</div>
                        <div className="font-bold">{services.find(s => s.id === selectedService)?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xs">
                        <div className="text-stone-400 uppercase tracking-tighter mb-0.5">Мастер</div>
                        <div className="font-bold">{stylists.find(s => s.id === selectedStylist)?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xs">
                        <div className="text-stone-400 uppercase tracking-tighter mb-0.5">Дата</div>
                        <div className="font-bold">{selectedDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xs">
                        <div className="text-stone-400 uppercase tracking-tighter mb-0.5">Время</div>
                        <div className="font-bold">{selectedTime}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
                    <div className="text-center sm:text-left">
                      <div className="text-stone-400 text-xs uppercase tracking-[0.2em] mb-1">Итоговая стоимость</div>
                      <div className="text-3xl font-serif text-amber-400">
                        {formatPrice(services.find(s => s.id === selectedService)?.price || 0)} ₽
                      </div>
                    </div>
                    <Button 
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold h-14 px-12 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-600/20"
                      onClick={handleBook}
                    >
                      ПОДТВЕРДИТЬ ВИЗИТ
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши работы</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img 
                  src={img} 
                  alt={`работа ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
