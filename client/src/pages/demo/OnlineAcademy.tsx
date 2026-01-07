import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, Users, Clock, BookOpen, Code, Palette, TrendingUp, 
  ArrowLeft, Play, CheckCircle2, X, Quote, Layout, Search,
  GraduationCap, MessageSquare, Home, Briefcase
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiGoogle, SiYcombinator, SiAmazon, SiApple } from "react-icons/si";

import heroImg from "@assets/generated_images/online_course_platform_hero_image.png";
import instructorImg from "@assets/generated_images/online_course_instructor_portrait.png";
import studentImg from "@assets/generated_images/student_taking_online_course.png";
import dashboardImg from "@assets/generated_images/online_course_dashboard_interface.png";
import programmingImg from "@assets/generated_images/programming_course_code_editor.png";
import avatarsImg from "@assets/generated_images/student_avatars_for_live_stream.png";
import thumbnailsImg from "@assets/generated_images/micro-learning_video_thumbnails_for_programming.png";

const courses = [
  {
    id: 1,
    title: "Веб-разработка с React",
    instructor: "Иван Петров",
    level: "Средний",
    students: 1247,
    rating: 4.8,
    reviews: 456,
    price: 2990,
    duration: "40 часов",
    image: programmingImg,
    tags: ["React", "JavaScript", "Web"],
    description: "Изучите основы и продвинутые концепции разработки на React. Вы научитесь создавать современные, отзывчивые интерфейсы.",
    popular: true,
    syllabus: [
      { title: "Введение в React", topics: ["Что такое React?", "Настройка окружения", "JSX основы"] },
      { title: "Компоненты и Пропсы", topics: ["Функциональные компоненты", "Передача данных", "Типизация с PropTypes"] }
    ]
  },
  {
    id: 2,
    title: "Дизайн UI/UX",
    instructor: "Мария Соколова",
    level: "Начинающий",
    students: 892,
    rating: 4.9,
    reviews: 324,
    price: 1990,
    duration: "32 часа",
    image: dashboardImg,
    tags: ["Figma", "Design", "UI"],
    description: "Погрузитесь в мир дизайна интерфейсов. Охватывает все аспекты процесса проектирования — от вайрфреймов до Figma.",
    syllabus: [
      { title: "Основы дизайна", topics: ["Теория цвета", "Типографика", "Композиция"] }
    ]
  },
  {
    id: 3,
    title: "Python для аналитики",
    instructor: "Сергей Смирнов",
    level: "Продвинутый",
    students: 1543,
    rating: 4.7,
    reviews: 578,
    price: 3490,
    duration: "48 часов",
    image: programmingImg,
    tags: ["Python", "Data", "Analytics"],
    description: "Освойте Python для анализа данных. Работа с Pandas, NumPy и Matplotlib для обработки больших данных.",
    syllabus: [
      { title: "Основы Python", topics: ["Синтаксис", "Типы данных", "Функции"] }
    ]
  },
  {
    id: 4,
    title: "Маркетинг в соцсетях",
    instructor: "Анна Козлова",
    level: "Начинающий",
    students: 734,
    rating: 4.6,
    reviews: 267,
    price: 1490,
    duration: "24 часа",
    image: dashboardImg,
    tags: ["Marketing", "Social Media", "SMM"],
    description: "Узнайте, как эффективно продвигать бренды. SMM-стратегии, контент и таргетированная реклама.",
    syllabus: [
      { title: "Стратегия SMM", topics: ["Анализ конкурентов", "Целевая аудитория", "KPI"] }
    ]
  },
];

const instructors = [
  {
    id: 1,
    name: "Иван Петров",
    role: "Senior Frontend",
    rating: 4.8,
    image: instructorImg,
  },
  {
    id: 2,
    name: "Мария Соколова",
    role: "UX/UI Designer",
    rating: 4.9,
    image: studentImg,
  },
  {
    id: 3,
    name: "Сергей Смирнов",
    role: "Data Expert",
    rating: 4.7,
    image: instructorImg,
  },
];

const features = [
  { icon: BookOpen, title: "Контент", desc: "От экспертов" },
  { icon: Users, title: "Сообщество", desc: "Общайтесь" },
  { icon: CheckCircle2, title: "Сертификаты", desc: "Признанные" },
];

const benefits = [
  { title: "Свой темп", desc: "Когда удобно" },
  { title: "Практика", desc: "Реальные кейсы" },
  { title: "Поддержка", desc: "Чат 24/7" },
];

const microLessons = [
  { title: "Flexbox за 5 мин", duration: "5:20", views: "12k" },
  { title: "Секреты useEffect", duration: "8:45", views: "8k" },
  { title: "Z-index без боли", duration: "4:15", views: "15k" },
];

const pricingPlans = [
  {
    name: "Профи",
    price: "4 990₽/мес",
    desc: "Самый популярный",
    features: ["Все курсы", "Сертификаты", "ДЗ", "Чат"],
    button: "Выбрать Профи",
    variant: "default",
    popular: true
  },
  {
    name: "VIP",
    price: "12 990₽/мес",
    desc: "Максимальный результат",
    features: ["Всё из Профи", "Личный ментор", "Карьера"],
    button: "Стать VIP",
    variant: "outline"
  }
];

export default function OnlineAcademy() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [previewCourse, setPreviewCourse] = useState<number | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [enrollForm, setEnrollForm] = useState({ name: "", email: "", phone: "" });
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 56 });
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const coursesRef = useRef<HTMLElement>(null);
  const instructorsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useDocumentMeta({
    title: "ОнлайнОкадемия — Курсы будущего",
    description: "Профессиональное обучение программированию и дизайну",
  });

  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(c => c.tags.some(tag => tag.includes(selectedCategory)));

  const handleEnrollSubmit = () => {
    if (!enrollForm.name || !enrollForm.email) {
      toast({ title: "Ошибка", description: "Заполните данные", variant: "destructive" });
      return;
    }
    if (enrollingCourse) {
      setEnrolledCourses(prev => [...prev, enrollingCourse]);
      toast({ title: "Успешно!", description: "Вы записаны на курс" });
      setEnrollingCourse(null);
    }
  };

  const askAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Вопрос по обучению: ${aiQuery}` }),
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось получить ответ", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const [codeValue, setCodeValue] = useState("function greet() {\n  return 'Hello World';\n}");
  const [codeResult, setCodeResult] = useState("");

  const runCode = () => {
    try {
      // Simple evaluation for demo purposes
      if (codeValue.includes('return')) {
        const result = new Function(codeValue.includes('function') ? `return (${codeValue})()` : codeValue)();
        setCodeResult(String(result));
      } else {
        const result = eval(codeValue);
        setCodeResult(String(result));
      }
      toast({ title: "Код выполнен", description: "Результат отображен ниже" });
    } catch (e) {
      setCodeResult(`Ошибка: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const scrollTo = (ref: React.RefObject<HTMLElement>, tabName: string) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tabName);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-20 md:pb-0">
      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-blue-500/10 h-16 px-6 flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-500' : 'text-muted-foreground'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Главная</span>
        </button>
        <button 
          onClick={() => scrollTo(coursesRef, 'courses')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'courses' ? 'text-blue-500' : 'text-muted-foreground'}`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-medium">Курсы</span>
        </button>
        <button 
          onClick={() => setShowDashboard(true)}
          className={`flex flex-col items-center gap-1 transition-colors ${showDashboard ? 'text-blue-500' : 'text-muted-foreground'}`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center -mt-8 shadow-lg shadow-blue-500/20 border-4 border-white dark:border-[#0a0a0a]">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-medium">ЛК</span>
        </button>
        <button 
          onClick={() => scrollTo(instructorsRef, 'mentors')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'mentors' ? 'text-blue-500' : 'text-muted-foreground'}`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-medium">Менторы</span>
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-blue-500' : 'text-muted-foreground'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Поиск</span>
        </button>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden pt-4 pb-12 md:pb-32 px-4 md:px-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5">
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-14 relative z-50">
          <div className="flex items-center gap-3">
            <Link href="/#portfolio">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight">ОКАДЕМИЯ</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowDashboard(true)}>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </Button>
        </nav>

        <div className="max-w-7xl mx-auto mt-8 md:mt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold">
                <Clock className="w-3 h-3 mr-2" /> Скидка {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
              </Badge>
              <h1 className="text-4xl md:text-7xl font-bold leading-[1.1] mb-6">
                Твой путь в <span className="text-blue-500">IT</span> начинается здесь
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Освой востребованную профессию с нуля под руководством экспертов из топовых компаний.
              </p>
              <div className="flex gap-3">
                <Button size="lg" className="rounded-full px-8 bg-blue-500 hover:bg-blue-600 shadow-xl shadow-blue-500/20" onClick={() => instructorsRef.current?.scrollIntoView({ behavior: "smooth" })}>
                  Начать учиться
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 backdrop-blur-md hidden sm:flex">
                  О платформе
                </Button>
              </div>
            </motion.div>
            
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
              <img src={heroImg} className="relative z-10 w-full rounded-3xl shadow-2xl border border-white/10" alt="Platform" />
            </div>
          </div>
        </div>
      </header>

      {/* Features - Horizontal Scroll on Mobile */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar -mx-4 px-4 pb-4 md:overflow-visible md:px-0">
          <div className="flex md:grid md:grid-cols-3 gap-4 min-w-[600px] md:min-w-0">
            {features.map((f, i) => (
              <Card key={i} className="flex-1 p-6 bg-white/50 dark:bg-white/5 backdrop-blur-xl border-blue-500/10 hover-elevate group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <f.icon className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section ref={coursesRef as any} className="py-16 md:py-24 px-4 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Популярные курсы</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {["all", "Web", "Design", "Data"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border border-blue-500/10 hover-elevate'}`}
                  >
                    {cat === 'all' ? 'Все' : cat}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2">Все направления <ArrowLeft className="w-4 h-4 rotate-180" /></Button>
          </div>

          <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 pb-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:px-0">
            {filteredCourses.map((c) => (
              <Card key={c.id} className="min-w-[280px] md:min-w-0 group overflow-hidden bg-white dark:bg-white/5 border-blue-500/5 hover-elevate flex flex-col h-full rounded-3xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={c.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 text-foreground backdrop-blur-md border-0 font-bold">{c.level}</Badge>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{c.rating}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors leading-tight">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{c.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-blue-500/5">
                    <span className="font-bold text-blue-500">{c.price.toLocaleString()}₽</span>
                    <Button size="sm" variant="outline" className="rounded-full px-4 h-8 text-[11px]" onClick={() => setPreviewCourse(c.id)}>Подробнее</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section - Special Visual for Mobile */}
      <section className="py-16 md:py-24 px-4 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Card className="p-6 md:p-12 rounded-[2rem] bg-black text-white overflow-hidden border-white/5 shadow-2xl">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mb-6 animate-pulse">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">ИИ-наставник в кармане</h2>
              <p className="text-neutral-400 mb-8 max-w-lg">Задай любой вопрос по коду или дизайну. Наш ИИ ответит мгновенно и поможет разобраться.</p>
              
              <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
                <Input 
                  value={aiQuery} 
                  onChange={e => setAiQuery(e.target.value)} 
                  placeholder="Как работает useEffect?"
                  className="bg-white/10 border-white/10 h-12 rounded-full px-6 focus:bg-white/20"
                />
                <Button onClick={askAi} disabled={isAiLoading} className="h-12 rounded-full px-8 bg-blue-500 hover:bg-blue-600">
                  {isAiLoading ? "..." : "Спросить"}
                </Button>
              </div>
              
              {aiResponse && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-left p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-full">
                  <p className="text-sm text-blue-300 font-bold mb-2 uppercase tracking-widest">Ответ:</p>
                  <p className="text-neutral-200 leading-relaxed text-sm md:text-base">{aiResponse}</p>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Mentors Section */}
      <section ref={instructorsRef as any} className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Топовые наставники</h2>
        <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 pb-8 md:grid md:grid-cols-3 md:gap-8 md:px-0">
          {instructors.map(inst => (
            <Card key={inst.id} className="min-w-[280px] p-6 text-center bg-white dark:bg-white/5 border-blue-500/5 hover-elevate">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-500/10 ring-8 ring-blue-500/5">
                <img src={inst.image} className="w-full h-full object-cover" alt={inst.name} />
              </div>
              <h3 className="font-bold text-lg mb-1">{inst.name}</h3>
              <p className="text-sm text-blue-500 font-medium mb-4">{inst.role}</p>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{inst.rating} (500+ отзывов)</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-32 px-4 bg-neutral-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Выбери свой формат</h2>
          <p className="text-neutral-400">Начни менять карьеру прямо сейчас</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, i) => (
            <Card key={i} className={`p-8 md:p-12 rounded-[2.5rem] bg-neutral-800/50 border-white/5 relative group hover-elevate ${plan.popular ? 'border-blue-500/30' : ''}`}>
              {plan.popular && <Badge className="absolute top-6 right-6 bg-blue-500">POPULAR</Badge>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6 text-blue-400">{plan.price}</div>
              <p className="text-neutral-400 text-sm mb-8">{plan.desc}</p>
              <div className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" variant={plan.variant as any} className={`w-full rounded-full h-14 font-bold ${plan.popular ? 'bg-blue-500 hover:bg-blue-600 border-0' : 'text-white border-white/20'}`}>
                {plan.button}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Code Editor Section */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-blue-500 border-blue-500/20">Интерактив</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Попробуй написать код сам</h2>
            <p className="text-muted-foreground">Начни программировать прямо в браузере. Это проще, чем кажется!</p>
          </div>
          
          <Card className="overflow-hidden border-blue-500/10 shadow-2xl rounded-3xl">
            <div className="bg-[#1e1e1e] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest">index.js</div>
              <Button size="sm" onClick={runCode} className="h-7 px-4 rounded-full bg-blue-500 hover:bg-blue-600 text-[10px] font-bold">
                <Play className="w-3 h-3 mr-1.5 fill-white" /> ЗАПУСТИТЬ
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#1e1e1e]">
              <div className="border-r border-white/5 p-4 min-h-[200px]">
                <textarea
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                  className="w-full h-full bg-transparent text-blue-300 font-mono text-sm outline-none resize-none spellcheck-false"
                  placeholder="// Пиши свой код здесь..."
                />
              </div>
              <div className="p-4 bg-black/40 min-h-[100px] md:min-h-0">
                <div className="text-[10px] text-white/20 font-mono mb-2 uppercase">Результат:</div>
                <div className="font-mono text-sm text-green-400 break-all">
                  {codeResult || "> Готов к выполнению..."}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black text-neutral-500 text-center text-sm border-t border-white/5">
        <div className="flex items-center justify-center gap-2 text-white mb-6">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <span className="font-bold">ОКАДЕМИЯ</span>
        </div>
        <p className="max-w-md mx-auto mb-8 leading-relaxed">Платформа современного образования. Обучаем созданию продуктов, которые меняют мир.</p>
        <div className="pt-8 border-t border-white/5">
          © 2026 ОнлайнОкадемия. Дизайн от MP.WebStudio
        </div>
      </footer>

      {/* Modals remain similarly optimized */}
      <Dialog open={previewCourse !== null} onOpenChange={() => setPreviewCourse(null)}>
        <DialogContent className="max-w-xl p-0 overflow-y-auto max-h-[90vh] border-0 bg-white dark:bg-[#0a0a0a] rounded-[2rem] no-scrollbar">
          {previewCourse && (
            <div className="flex flex-col min-h-full">
              <div className="relative h-48 md:h-64 shrink-0">
                <img src={courses.find(c => c.id === previewCourse)?.image} className="w-full h-full object-cover" alt="Course" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{courses.find(c => c.id === previewCourse)?.title}</h3>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h4 className="font-bold mb-4 uppercase text-[10px] tracking-[0.2em] text-blue-500">Программа</h4>
                <div className="space-y-4">
                  {courses.find(c => c.id === previewCourse)?.syllabus.map((m, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-blue-500/5">
                      <p className="text-xs font-bold mb-1 opacity-50">Модуль {i+1}</p>
                      <h5 className="font-bold mb-2">{m.title}</h5>
                      <div className="flex flex-wrap gap-2">
                        {m.topics.map((t, j) => <Badge key={j} variant="outline" className="text-[10px] border-blue-500/10">{t}</Badge>)}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-8 rounded-full h-12 bg-blue-500" onClick={() => { setPreviewCourse(null); setEnrollingCourse(previewCourse); }}>
                  Записаться на курс
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-[90vh] border-0 bg-neutral-50 dark:bg-[#0a0a0a] rounded-[2rem] no-scrollbar">
          <div className="p-6 md:p-12">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-neutral-50/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-10 py-2">
              <h2 className="text-2xl md:text-3xl font-bold">Личный кабинет</h2>
              <Button size="icon" variant="ghost" onClick={() => setShowDashboard(false)}><X className="w-6 h-6"/></Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white dark:bg-white/5 border-blue-500/5 rounded-3xl">
                <h3 className="font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/> Прогресс обучения</h3>
                <div className="space-y-6">
                  {["React Dev", "UX Design"].map((n, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium"><span>{n}</span><span className="text-blue-500">{60+i*20}%</span></div>
                      <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${60+i*20}%` }} className="h-full bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6 bg-blue-500 text-white rounded-3xl">
                <h3 className="font-bold mb-4">Твои бонусы</h3>
                <p className="text-sm text-blue-100 mb-6">У тебя 2 500 накопленных баллов. Обменяй их на новые курсы!</p>
                <Button className="w-full rounded-full bg-white text-blue-500 hover:bg-neutral-100 border-0 font-bold">Магазин бонусов</Button>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
