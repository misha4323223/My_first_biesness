import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, MapPin, Phone, Star, Calendar, User, Check, ArrowLeft, 
  DollarSign, Bed, Bath, Search, Shield, Key, FileCheck, PlayCircle, Map as MapIcon, ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import realEstateHeroImg from "@/assets/generated_images/modern_luxury_real_estate_agency_office.webp";
import propertyImg1 from "@/assets/generated_images/luxury_central_moscow_apartment_interior.webp";
import propertyImg2 from "@/assets/generated_images/modern_luxury_cottage_with_garden_plot.webp";
import propertyImg3 from "@/assets/generated_images/minimalist_compact_studio_apartment.webp";
import propertyImg4 from "@/assets/generated_images/luxury_penthouse_with_panoramic_views.webp";
import propertyImg5 from "@/assets/generated_images/modern_townhouse_near_forest_park.webp";
import propertyImg6 from "@/assets/generated_images/class_a_premium_office_space_interior.webp";
import stockMapImg from "@/assets/generated_images/luxury_central_moscow_apartment_interior.webp";

const properties = [
  { id: 1, name: "Апартаменты в центре", beds: 3, baths: 2, area: 120, price: 12500000, type: "Квартира", image: propertyImg1 },
  { id: 2, name: "Коттедж с участком", beds: 4, baths: 3, area: 250, price: 35000000, type: "Дом", popular: true, image: propertyImg2 },
  { id: 3, name: "Студия на Арбате", beds: 1, baths: 1, area: 45, price: 5000000, type: "Квартира", image: propertyImg3 },
  { id: 4, name: "Пентхаус с панорамой", beds: 5, baths: 4, area: 300, price: 85000000, type: "Апартаменты", image: propertyImg4 },
  { id: 5, name: "Таунхаус у лесопарка", beds: 3, baths: 2, area: 180, price: 18000000, type: "Дом", image: propertyImg5 },
  { id: 6, name: "Офис класса А", beds: 0, baths: 2, area: 150, price: 25000000, type: "Коммерция", image: propertyImg6 },
];

const agents = [
  { 
    id: 1, 
    name: "Виктория Волкова", 
    role: "Топ-агент", 
    experience: "15 лет",
    deals: 342,
    rating: 4.9,
    reviews: 298
  },
  { 
    id: 2, 
    name: "Антон Морозов", 
    role: "Агент по люксу", 
    experience: "12 лет",
    deals: 187,
    rating: 4.8,
    reviews: 215
  },
  { 
    id: 3, 
    name: "Елена Смирнова", 
    role: "Коммерческий агент", 
    experience: "10 лет",
    deals: 124,
    rating: 4.9,
    reviews: 178
  },
];

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function RealEstateAgency() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [step, setStep] = useState(1);
  const [filterType, setFilterType] = useState("Все");
  const [filterPrice, setFilterPrice] = useState("Все");
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const dealSteps = [
    { icon: Search, title: "Подбор", desc: "Анализируем ваши пожелания и подбираем лучшие варианты" },
    { icon: Shield, title: "Проверка", desc: "Юридическая проверка объекта и чистоты сделки" },
    { icon: FileCheck, title: "Сделка", desc: "Профессиональное сопровождение на всех этапах" },
    { icon: Key, title: "Ключи", desc: "Поздравляем с новосельем в вашем идеальном доме" }
  ];

  const quizQuestions = [
    { id: "purpose", q: "Какова цель покупки?", options: ["Инвестиции", "Для жизни", "Коммерция"] },
    { id: "budget", q: "Ваш бюджет?", options: ["до 10 млн", "10-30 млн", "от 30 млн"] },
    { id: "urgency", q: "Сроки покупки?", options: ["Срочно", "В течение месяца", "Присматриваюсь"] }
  ];
  const propertiesRef = useRef<HTMLElement>(null);
  const agentsRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "ЛюксПро — Агентство недвижимости | Покупка и продажа",
    description: "Агентство недвижимости с опытными агентами. Апартаменты, дома, коммерческая недвижимость. Персональный сервис, честные цены, онлайн-просмотры.",
    keywords: "недвижимость, апартаменты, купить дом, агенство, агент по недвижимости",
    ogTitle: "ЛюксПро — Агентство недвижимости | Дизайн от MP.WebStudio",
    ogDescription: "Премиум агенство недвижимости с лучшими предложениями на рынке",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/real-estate",
    canonical: "https://mp-webstudio.ru/demo/real-estate"
  });

  const avgRating = (agents.reduce((sum, a) => sum + a.rating, 0) / agents.length).toFixed(1);
  const totalReviews = agents.reduce((sum, a) => sum + a.reviews, 0);

  useAggregateRatingSchema({
    name: "ЛюксПро Агенство недвижимости",
    description: "Премиум агенство недвижимости с опытными агентами",
    data: {
      ratingValue: parseFloat(avgRating),
      ratingCount: totalReviews
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "ЛюксПро", url: "https://mp-webstudio.ru/demo/real-estate" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToProperties = () => propertiesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAgents = () => agentsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => contactRef.current?.scrollIntoView({ behavior: "smooth" });

  const handlePropertySelect = (id: number) => {
    setSelectedProperty(id);
    setStep(2);
    toast({
      title: "Объект выбран",
      description: properties.find(p => p.id === id)?.name,
    });
  };

  const handleAgentSelect = (id: number) => {
    setSelectedAgent(id);
    setStep(3);
    toast({
      title: "Агент выбран",
      description: agents.find(a => a.id === id)?.name,
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
    if (selectedProperty && selectedAgent && selectedTime && selectedDate) {
      toast({
        title: "Просмотр запланирован!",
        description: `${properties.find(p => p.id === selectedProperty)?.name} с ${agents.find(a => a.id === selectedAgent)?.name}`,
      });
      setStep(1);
      setSelectedProperty(null);
      setSelectedAgent(null);
      setSelectedTime(null);
      setSelectedDate("");
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Link href="/#portfolio">
        <Button
          variant="ghost"
          className="fixed top-2 left-4 z-50 bg-black/80 backdrop-blur-sm text-white hover:text-white hover:bg-white/10"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </Link>

      <header className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-neutral-950 to-neutral-950 pointer-events-none" />
        <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url(${realEstateHeroImg})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
        
        <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Home className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-base md:text-xl font-bold tracking-wider">ЛЮКСПРО</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
            <button onClick={scrollToProperties} className="hover:text-emerald-400 transition-colors cursor-pointer">Объекты</button>
            <button onClick={scrollToAgents} className="hover:text-emerald-400 transition-colors cursor-pointer">Агенты</button>
            <button onClick={scrollToBooking} className="hover:text-emerald-400 transition-colors cursor-pointer">Просмотр</button>
            <button onClick={scrollToContact} className="hover:text-emerald-400 transition-colors cursor-pointer">Контакты</button>
          </div>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm" data-testid="button-book-header">
            Записаться
          </Button>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-12 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-3 md:mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] md:text-xs">
              Премиум недвижимость
            </Badge>
            <h1 className="text-3xl md:text-7xl font-bold mb-3 md:mb-6 leading-tight tracking-tight">
              Найди свой идеальный
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                дом
              </span>
            </h1>
            <p className="text-sm md:text-xl text-neutral-400 mb-6 md:mb-8 max-w-lg leading-relaxed">
              Более 300 проектов успешно завершено. Апартаменты, дома, коммерция. Прозрачность и честность.
            </p>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-1.5 md:p-2 rounded-xl flex flex-col md:flex-row gap-1.5 md:gap-2 max-w-3xl mb-6 md:mb-8">
              <div className="flex-1 px-3 py-1.5 md:px-4 md:py-2 border-b md:border-b-0 md:border-r border-white/10 last:border-0">
                <label className="block text-[8px] md:text-[10px] text-neutral-500 uppercase font-bold mb-0.5">Тип</label>
                <select 
                  className="bg-transparent text-xs md:text-sm w-full outline-none cursor-pointer text-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="Все" className="bg-neutral-900">Все типы</option>
                  <option value="Квартира" className="bg-neutral-900">Квартиры</option>
                  <option value="Дом" className="bg-neutral-900">Дома</option>
                </select>
              </div>
              <div className="flex-1 px-3 py-1.5 md:px-4 md:py-2 border-b md:border-b-0 md:border-r border-white/10 last:border-0">
                <label className="block text-[8px] md:text-[10px] text-neutral-500 uppercase font-bold mb-0.5">Бюджет</label>
                <select 
                  className="bg-transparent text-xs md:text-sm w-full outline-none cursor-pointer text-white"
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                >
                  <option value="Все" className="bg-neutral-900">Любой</option>
                  <option value="до 10" className="bg-neutral-900">до 10 млн ₽</option>
                  <option value="10-50" className="bg-neutral-900">10-50 млн ₽</option>
                </select>
              </div>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 h-10 md:h-12 text-sm"
                onClick={scrollToProperties}
              >
                Найти
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold w-full sm:w-auto h-11 md:h-12 text-sm" 
                onClick={scrollToBooking}
                data-testid="button-book-hero"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Забронировать
              </Button>
            </div>
            <div className="flex flex-row items-center flex-wrap gap-4 md:gap-8 mt-8 md:mt-12 text-[10px] md:text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-neutral-400">09:00 - 19:00</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-neutral-400">Москва</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section ref={propertiesRef} id="properties" className="py-12 md:py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
          >
            {dealSteps.map((s, i) => (
              <div key={i} className="relative group p-3 md:p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <s.icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-1 text-white">{s.title}</h3>
                <p className="text-[10px] md:text-xs text-neutral-500 leading-tight">{s.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Избранные объекты</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Лучшие предложения на рынке недвижимости
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden bg-neutral-800/40 border-neutral-700/50 hover-elevate cursor-pointer transition-all ${selectedProperty === property.id ? 'ring-2 ring-emerald-500' : ''}`}
                  onClick={() => handlePropertySelect(property.id)}
                  data-testid={`card-property-${property.id}`}
                >
                  <div className="h-32 md:h-36 relative overflow-hidden bg-neutral-700">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <Badge className="bg-black/60 backdrop-blur-md text-[10px] h-5 py-0 px-2 text-white border-white/10 flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" /> 3D
                      </Badge>
                      {property.popular && (
                        <Badge className="bg-emerald-500 text-black border-0 text-[10px] h-5 py-0 px-2">Хит</Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm md:text-base font-semibold text-white truncate">{property.name}</h3>
                      <span className="text-sm font-bold text-emerald-400 whitespace-nowrap">{formatPrice(property.price / 1000000)} млн ₽</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span>{property.type}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-700" />
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" /> {property.beds}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" /> {property.baths}
                      </span>
                      <span>{property.area} м²</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-neutral-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -left-1/4" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">Ваш будущий дом на карте</h2>
              <p className="text-sm md:text-base text-neutral-400 mb-6 md:mb-8">
                Мы отобрали лучшие локации в Москве. Посмотрите расположение наших объектов и инфраструктуру.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 md:gap-4 mb-8">
                {["Центр", "Резиденции", "Бизнес"].map(item => (
                  <div key={item} className="flex items-center gap-2 md:gap-3 justify-center lg:justify-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-neutral-300 font-medium text-xs md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-neutral-800">
                <img 
                  src={stockMapImg} 
                  alt="Map View" 
                  className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                
                <div className="absolute top-[25%] left-[20%] group/pin">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    <div className="relative w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                      <Home className="w-3 h-3 md:w-4 md:h-4 text-black" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 whitespace-nowrap border border-white/10 pointer-events-none font-bold z-20 shadow-xl">
                      Пентхаус Сити
                    </div>
                  </div>
                </div>

                <div className="absolute top-[45%] left-[65%] group/pin">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75 delay-300" />
                    <div className="relative w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                      <Home className="w-3 h-3 md:w-4 md:h-4 text-black" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 whitespace-nowrap border border-white/10 pointer-events-none font-bold z-20 shadow-xl">
                      Резиденция Арбат
                    </div>
                  </div>
                </div>

                <div className="absolute top-[65%] left-[45%] group/pin">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75 delay-700" />
                    <div className="relative w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                      <Home className="w-3 h-3 md:w-4 md:h-4 text-black" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 whitespace-nowrap border border-white/10 pointer-events-none font-bold z-20 shadow-xl">
                      Офис Класса А
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-emerald-500 text-black font-bold border-none text-[8px] md:text-[10px] h-5 px-2">КАРТА ОБЪЕКТОВ</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
              <div className="flex-1">
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Квиз-подбор</Badge>
                <h2 className="text-2xl md:text-4xl font-bold mb-3">Сложно выбрать?</h2>
                <p className="text-neutral-400 text-sm md:text-lg">
                  Ответьте на 3 вопроса и получите персональную подборку объектов за 1 минуту
                </p>
              </div>
              <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 h-12 md:h-14 rounded-xl shadow-lg shadow-emerald-500/20 whitespace-nowrap w-full md:w-auto"
                    onClick={() => {
                      setQuizStep(0);
                      setQuizAnswers({});
                    }}
                    data-testid="button-start-quiz"
                  >
                    Подобрать объекты
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-950 border-neutral-800 text-white max-w-md mx-auto w-[95%] rounded-2xl p-6 shadow-2xl">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-bold text-center">
                      {quizStep < quizQuestions.length ? `Шаг ${quizStep + 1} из ${quizQuestions.length}` : 'Готово!'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {quizStep < quizQuestions.length ? (
                      <motion.div key={quizStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-lg font-medium mb-4 text-center">{quizQuestions[quizStep].q}</h3>
                        <div className="grid gap-2">
                          {quizQuestions[quizStep].options.map((opt) => (
                            <Button
                              key={opt}
                              variant="outline"
                              className={`h-14 justify-between px-6 text-base rounded-xl border-neutral-800 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left ${
                                quizAnswers[quizQuestions[quizStep].id] === opt ? 'border-emerald-500 bg-emerald-500/10' : ''
                              }`}
                              onClick={() => {
                                setQuizAnswers({ ...quizAnswers, [quizQuestions[quizStep].id]: opt });
                                setQuizStep(quizStep + 1);
                              }}
                            >
                              {opt}
                              <ChevronRight className="w-4 h-4 text-neutral-600" />
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center pb-4">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Отлично!</h3>
                        <p className="text-neutral-400 mb-8">Мы подобрали лучшие варианты на основе ваших предпочтений.</p>
                        <Button 
                          className="w-full bg-emerald-500 text-black font-bold h-12 rounded-xl" 
                          onClick={() => {
                            setQuizOpen(false);
                            setQuizStep(0);
                            toast({ 
                              title: "Подборка готова!", 
                              description: "Мы отправили её вам в Telegram" 
                            });
                          }}
                        >
                          Посмотреть объекты
                        </Button>
                      </motion.div>
                    )}
                    
                    {quizStep < quizQuestions.length && (
                      <div className="flex justify-between items-center gap-4 pt-4 border-t border-white/5">
                        <Button 
                          variant="ghost" 
                          onClick={() => quizStep > 0 && setQuizStep(quizStep - 1)}
                          className={`text-neutral-400 hover:text-white ${quizStep === 0 ? 'invisible' : ''}`}
                        >
                          Назад
                        </Button>
                        <div className="flex gap-1.5">
                          {quizQuestions.map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1 rounded-full transition-all ${
                                i === quizStep ? 'w-6 bg-emerald-500' : 'w-1.5 bg-neutral-800'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="w-16" /> {/* Spacer */}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      <section ref={agentsRef} id="agents" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши агенты</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Опытные профессионалы, помогут вам найти идеальное решение
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`p-4 bg-neutral-800/40 border-neutral-700/50 hover-elevate cursor-pointer transition-all ${selectedAgent === agent.id ? 'ring-2 ring-emerald-500' : ''}`}
                  onClick={() => handleAgentSelect(agent.id)}
                  data-testid={`card-agent-${agent.id}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center border border-emerald-500/20">
                      <User className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-white truncate">{agent.name}</h3>
                      <p className="text-emerald-400 text-xs font-medium">{agent.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-1.5 bg-neutral-900/30 rounded-lg">
                      <div className="text-[10px] text-neutral-500 mb-0.5">Опыт</div>
                      <div className="font-bold text-xs text-white">{agent.experience}</div>
                    </div>
                    <div className="text-center p-1.5 bg-neutral-900/30 rounded-lg">
                      <div className="text-[10px] text-neutral-500 mb-0.5">Сделки</div>
                      <div className="font-bold text-xs text-white">{agent.deals}</div>
                    </div>
                    <div className="text-center p-1.5 bg-neutral-900/30 rounded-lg">
                      <div className="text-[10px] text-neutral-500 mb-0.5">Рейтинг</div>
                      <div className="font-bold text-xs text-white flex items-center justify-center gap-0.5">
                        {agent.rating} <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-neutral-700 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all font-bold text-xs h-9" data-testid={`button-select-agent-${agent.id}`}>
                    Выбрать
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={bookingRef} id="booking" className="py-20 bg-neutral-900">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Запланировать просмотр</h2>
            <p className="text-neutral-400 text-sm md:text-lg">
              Выберите объект, агента и удобное время для личной встречи
            </p>
          </motion.div>

          <Card className="p-0.5 md:p-1 bg-neutral-800/30 border-neutral-700/50 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="bg-neutral-900/50 backdrop-blur-xl rounded-[0.9rem] md:rounded-[1.8rem] p-4 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="grid lg:grid-cols-2 gap-4 md:gap-16 relative z-10">
                <div className="space-y-4 md:space-y-8">
                  <div className="space-y-2 md:space-y-4">
                    <label className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-widest">
                      <Home className="w-3 h-3" /> Объект недвижимости
                    </label>
                    <div className="group relative">
                      <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl bg-neutral-950/50 border transition-all duration-300 ${selectedProperty ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-neutral-800'}`}>
                        {selectedProperty ? (
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden shadow-lg border border-white/5">
                              <img 
                                src={properties.find(p => p.id === selectedProperty)?.image} 
                                className="w-full h-full object-cover" 
                                alt="" 
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm md:text-lg text-white">{properties.find(p => p.id === selectedProperty)?.name}</p>
                              <p className="text-xs md:text-sm font-medium text-emerald-400">{formatPrice(properties.find(p => p.id === selectedProperty)?.price || 0)} ₽</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-neutral-500 py-1 md:py-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                              <Search className="w-4 h-4 md:w-5 md:h-5 opacity-20" />
                            </div>
                            <p className="text-xs md:text-sm font-medium">Выберите объект выше</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-widest">
                      <User className="w-3 h-3" /> Ваш персональный агент
                    </label>
                    <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl bg-neutral-950/50 border transition-all duration-300 ${selectedAgent ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-neutral-800'}`}>
                      {selectedAgent ? (
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                            <User className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-white">{agents.find(a => a.id === selectedAgent)?.name}</p>
                            <p className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-tighter">{agents.find(a => a.id === selectedAgent)?.role}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-neutral-500 py-1">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                            <Shield className="w-3 h-3 md:w-4 md:h-4 opacity-20" />
                          </div>
                          <p className="text-xs md:text-sm font-medium">Агент назначен автоматически</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-4 md:space-y-8">
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
                    <div className="space-y-2 md:space-y-4">
                      <label className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" /> Дата
                      </label>
                      <Input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-neutral-950/50 border-neutral-800 text-white h-11 md:h-14 rounded-xl md:rounded-2xl px-3 md:px-5 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs md:text-sm"
                        data-testid="input-date"
                      />
                    </div>
                    <div className="space-y-2 md:space-y-4">
                      <label className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-widest">
                        <PlayCircle className="w-3 h-3" /> Время
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl md:rounded-2xl h-11 md:h-14 px-3 md:px-5 text-xs md:text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none transition-all cursor-pointer text-white"
                          value={selectedTime || ""}
                          onChange={(e) => handleTimeSelect(e.target.value)}
                        >
                          <option value="" className="bg-neutral-950">Время</option>
                          {timeSlots.map(t => <option key={t} value={t} className="bg-neutral-950">{t}</option>)}
                        </select>
                        <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600">
                          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 md:pt-0">
                    <Button 
                      className="w-full h-12 md:h-16 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm md:text-lg rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl shadow-emerald-500/20 disabled:opacity-30 disabled:grayscale transition-all duration-500 transform active:scale-[0.98]"
                      disabled={!selectedProperty || !selectedDate || !selectedTime}
                      onClick={handleBook}
                      data-testid="button-confirm-booking"
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Забронировать
                    </Button>
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-3 md:mt-6">
                      <Shield className="w-2.5 h-2.5 md:w-3 md:h-3 text-neutral-600" />
                      <p className="text-[8px] md:text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                        Данные защищены
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section ref={contactRef} id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Свяжитесь с нами</h2>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
              Наши специалисты помогут вам найти идеальный вариант
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm text-neutral-400">Телефон</p>
                  <a href="tel:+79991234567" className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors">
                    +7 (999) 123-45-67
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm text-neutral-400">Адрес</p>
                  <p className="text-lg font-semibold text-white">
                    Москва, центр города
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm text-neutral-400">График работы</p>
                  <p className="text-lg font-semibold text-white">
                    Пн-Пт: 09:00 - 19:00
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-neutral-400 text-sm">
          <p>© 2024 ЛюксПро. Все права защищены. | Дизайн от <span className="text-white">MP.WebStudio</span></p>
        </div>
      </footer>
    </div>
  );
}
