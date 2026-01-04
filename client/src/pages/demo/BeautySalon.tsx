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
  { 
    id: 4, 
    name: "Александр", 
    role: "Топ-барбер", 
    experience: "12 лет",
    image: "@assets/generated_images/russian_barber_maxim_portrait.webp",
    rating: 5.0,
    reviews: 412
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

      <section ref={stylistsRef} id="stylists" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши стилисты</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Профессионалы своего дела с многолетним опытом
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {stylists.map((stylist, i) => (
              <motion.div
                key={stylist.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden bg-neutral-800/50 border-neutral-700 hover-elevate cursor-pointer ${selectedStylist === stylist.id ? 'ring-2 ring-pink-500' : ''}`}
                  onClick={() => handleStylistSelect(stylist.id)}
                  data-testid={`card-stylist-${stylist.id}`}
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={stylist.image} 
                      alt={stylist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold mb-1">{stylist.name}</h3>
                      <p className="text-pink-400 text-sm mb-2">{stylist.role}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-neutral-300">
                          <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
                          {stylist.rating}
                        </span>
                        <span className="text-neutral-400">{stylist.reviews} отзывов</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">Опыт: {stylist.experience}</span>
                      <Button size="sm" className="bg-pink-500/20 text-pink-400 hover:bg-pink-500/30" data-testid={`button-select-stylist-${stylist.id}`}>
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
              Выберите услугу, стилиста и удобное время
            </p>
          </motion.div>

          <Card className="p-8 bg-neutral-800/50 border-neutral-700">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-500 text-white' : 'bg-neutral-700'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div className="flex-1 h-1 bg-neutral-700 rounded">
                <div className={`h-full bg-pink-500 rounded transition-all ${step > 1 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-500 text-white' : 'bg-neutral-700'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <div className="flex-1 h-1 bg-neutral-700 rounded">
                <div className={`h-full bg-pink-500 rounded transition-all ${step > 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-pink-500 text-white' : 'bg-neutral-700'}`}>
                3
              </div>
            </div>

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Выберите дату</label>
                  <Input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-neutral-700 border-neutral-600 text-white"
                    data-testid="input-date"
                  />
                </div>
                {selectedDate && (
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Выберите время</label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={selectedTime === time ? 'bg-pink-500 text-white' : 'border-neutral-600 text-white hover:bg-neutral-700'}
                          onClick={() => handleTimeSelect(time)}
                          data-testid={`button-time-${time}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedService && selectedStylist && selectedTime && selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-neutral-700/50 rounded-lg"
              >
                <h4 className="font-semibold mb-3">Ваша запись:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>{services.find(s => s.id === selectedService)?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-pink-400" />
                    <span>{stylists.find(s => s.id === selectedStylist)?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    <span>{selectedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span>{selectedTime}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-400">
                    {formatPrice(services.find(s => s.id === selectedService)?.price || 0)} ₽
                  </span>
                  <Button 
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                    onClick={handleBook}
                    data-testid="button-confirm-booking"
                  >
                    Подтвердить запись
                  </Button>
                </div>
              </motion.div>
            )}

            {step < 3 && (
              <p className="text-center text-neutral-400 mt-8">
                {step === 1 ? 'Выберите услугу выше' : 'Выберите стилиста выше'}
              </p>
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
