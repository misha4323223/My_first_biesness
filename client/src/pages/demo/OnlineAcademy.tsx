import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, BookOpen, Code, Palette, TrendingUp, ArrowLeft, Play, CheckCircle2, X, Quote } from "lucide-react";
import { Link } from "wouter";
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
import certificateImg from "@assets/generated_images/course_completion_certificate.png";
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
    description: "Изучите основы и продвинутые концепции разработки на React. Вы научитесь создавать современные, отзывчивые интерфейсы с использованием самых популярных инструментов и библиотек в экосистеме JavaScript.",
    popular: true,
    syllabus: [
      { title: "Введение в React", topics: ["Что такое React?", "Настройка окружения", "JSX основы"] },
      { title: "Компоненты и Пропсы", topics: ["Функциональные компоненты", "Передача данных", "Типизация с PropTypes"] },
      { title: "Управление состоянием", topics: ["useState", "useEffect", "Жизненный цикл"] },
      { title: "Работа с API", topics: ["Fetch и Axios", "Обработка ошибок", "Загрузка данных"] }
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
    description: "Погрузитесь в мир дизайна интерфейсов. Этот курс охватывает все аспекты процесса проектирования — от создания вайрфреймов и прототипов до финального визуального дизайна в Figma.",
    syllabus: [
      { title: "Основы дизайна", topics: ["Теория цвета", "Типографика", "Композиция"] },
      { title: "Работа в Figma", topics: ["Инструменты", "Слои и группы", "Компоненты"] },
      { title: "Прототипирование", topics: ["Связи", "Анимация", "Тестирование"] }
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
    description: "Освойте Python для анализа данных. Вы научитесь работать с библиотеками Pandas, NumPy и Matplotlib для обработки больших данных, визуализации и извлечения ценных инсайтов.",
    syllabus: [
      { title: "Основы Python", topics: ["Синтаксис", "Типы данных", "Функции"] },
      { title: "Библиотека Pandas", topics: ["DataFrames", "Фильтрация", "Агрегация"] },
      { title: "Визуализация", topics: ["Matplotlib", "Seaborn", "Построение графиков"] }
    ]
  },
  {
    id: 4,
    title: "Маркетинг в социальных сетях",
    instructor: "Анна Козлова",
    level: "Начинающий",
    students: 734,
    rating: 4.6,
    reviews: 267,
    price: 1490,
    duration: "24 часа",
    image: dashboardImg,
    tags: ["Marketing", "Social Media", "SMM"],
    description: "Узнайте, как эффективно продвигать бренды в социальных сетях. Курс научит вас разрабатывать SMM-стратегии, создавать контент и настраивать таргетированную рекламу для привлечения клиентов.",
    syllabus: [
      { title: "Стратегия SMM", topics: ["Анализ конкурентов", "Целевая аудитория", "KPI"] },
      { title: "Контент-план", topics: ["Виды контента", "Сторителлинг", "Копирайтинг"] },
      { title: "Таргет", topics: ["Рекламный кабинет", "Настройка", "Аналитика"] }
    ]
  },
];

const testimonials = [
  {
    id: 1,
    name: "Алексей Волков",
    role: "Frontend Разработчик",
    text: "Курс по React превзошел все мои ожидания. Программа очень структурированная, а практические задания помогли собрать портфолио, с которым я нашел работу уже через месяц после окончания!",
    rating: 5,
    image: studentImg
  },
  {
    id: 2,
    name: "Елена Кузнецова",
    role: "UX Исследователь",
    text: "Мария Соколова — потрясающий преподаватель. Она объясняет сложные вещи простыми словами. Особенно понравился модуль по прототипированию в Figma.",
    rating: 5,
    image: instructorImg
  }
];

const faqs = [
  {
    question: "Как долго я буду иметь доступ к курсу?",
    answer: "После покупки вы получаете пожизненный доступ ко всем материалам курса, включая все будущие обновления."
  },
  {
    question: "Есть ли рассрочка оплаты?",
    answer: "Да, мы предоставляем беспроцентную рассрочку на 6 или 12 месяцев для курсов стоимостью выше 10 000 рублей."
  },
  {
    question: "Выдаете ли вы сертификат?",
    answer: "Да, после успешного выполнения всех практических заданий и итогового проекта вы получите именной сертификат."
  }
];

const pricingPlans = [
  {
    name: "Базовый",
    price: "Бесплатно",
    desc: "Для ознакомления",
    features: ["Доступ к вводным урокам", "Сообщество студентов", "Мобильное приложение"],
    button: "Начать бесплатно",
    variant: "outline"
  },
  {
    name: "Профи",
    price: "4 990₽/мес",
    desc: "Самый популярный",
    features: ["Все курсы платформы", "Сертификаты", "Домашние задания", "Чат с куратором"],
    button: "Выбрать Профи",
    variant: "default",
    popular: true
  },
  {
    name: "VIP",
    price: "12 990₽/мес",
    desc: "Максимальный результат",
    features: ["Всё из тарифа Профи", "Личный ментор", "Помощь с трудоустройством", "Ревью кода 24/7"],
    button: "Стать VIP",
    variant: "outline"
  }
];

const instructors = [
  {
    id: 1,
    name: "Иван Петров",
    role: "Senior Frontend Developer",
    experience: "10 лет опыта",
    students: "3,500+ учеников",
    rating: 4.8,
    image: instructorImg,
  },
  {
    id: 2,
    name: "Мария Соколова",
    role: "UX/UI Designer",
    experience: "8 лет опыта",
    students: "2,100+ учеников",
    rating: 4.9,
    image: studentImg,
  },
  {
    id: 3,
    name: "Сергей Смирнов",
    role: "Data Science Expert",
    experience: "12 лет опыта",
    students: "4,200+ учеников",
    rating: 4.7,
    image: instructorImg,
  },
];

const features = [
  { icon: BookOpen, title: "Качественный контент", desc: "Курсы разработаны экспертами" },
  { icon: Users, title: "Сообщество", desc: "Пообщайтесь с другими учениками" },
  { icon: CheckCircle2, title: "Сертификаты", desc: "Получайте признанные сертификаты" },
];

const benefits = [
  { title: "Учитесь в своём темпе", desc: "Смотрите лекции когда удобно" },
  { title: "Практические проекты", desc: "Создавайте реальные проекты" },
  { title: "Поддержка сообщества", desc: "Помощь от опытных преподавателей" },
];

export default function OnlineAcademy() {
  const { toast } = useToast();
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
  const coursesRef = useRef<HTMLElement>(null);

  const studentProgress = [
    { title: "Веб-разработка с React", progress: 65, status: "В процессе", icon: Code },
    { title: "Дизайн UI/UX", progress: 100, status: "Завершен", icon: Palette },
    { title: "Python для аналитики", progress: 12, status: "В процессе", icon: TrendingUp },
  ];

  const careerRoadmap = [
    { name: "Основы JS", completed: true },
    { name: "React Basics", completed: true },
    { name: "State Management", completed: false },
    { name: "Next.js & SSR", completed: false },
    { name: "Финальный проект", completed: false },
  ];

  const microLessons = [
    { title: "Flexbox за 5 минут", duration: "5:20", views: "12k" },
    { title: "Секреты useEffect", duration: "8:45", views: "8k" },
    { title: "Z-index без боли", duration: "4:15", views: "15k" },
  ];

  const upcomingEvents = [
    { title: "Воркшоп по React Server Components", date: "Сегодня, 19:00", type: "Live" },
    { title: "Разбор портфолио с дизайнером", date: "Завтра, 15:00", type: "Webinar" },
  ];

  const achievements = [
    { title: "Первые шаги", desc: "Завершил первый урок", icon: Star, color: "text-yellow-500" },
    { title: "Код-мастер", desc: "10 дней подряд без пропусков", icon: CheckCircle2, color: "text-green-500" },
    { title: "Помощник", desc: "Ответил на 5 вопросов в чате", icon: Users, color: "text-blue-500" },
  ];

  const askAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Вопрос по обучению в ОнлайнОкадемии: ${aiQuery}` }),
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось получить ответ от ИИ", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

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
    title: "ОнлайнОкадемия — Онлайн-курсы по программированию и дизайну",
    description: "Научитесь веб-разработке, дизайну UI/UX, Python и маркетингу. Курсы от экспертов. Сертификаты.",
    keywords: "онлайн-курсы, программирование, веб-разработка, дизайн, Python, React",
    ogTitle: "ОнлайнОкадемия — Онлайн образование",
    ogDescription: "Лучшие онлайн-курсы по программированию и дизайну",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/online-academy",
    canonical: "https://mp-webstudio.ru/demo/online-academy"
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "ОнлайнОкадемия", url: "https://mp-webstudio.ru/demo/online-academy" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["all", "Web", "Design", "Data", "Marketing"];
  
  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(c => c.tags.some(tag => tag.includes(selectedCategory)));

  const handleEnrollClick = (courseId: number) => {
    setEnrollingCourse(courseId);
    setEnrollForm({ name: "", email: "", phone: "" });
  };

  const handleEnrollSubmit = () => {
    const isAlreadyEnrolled = enrollingCourse && enrolledCourses.includes(enrollingCourse);
    
    if (isAlreadyEnrolled) {
      setEnrolledCourses(prev => prev.filter(id => id !== enrollingCourse));
      toast({
        title: "Готово",
        description: "Вы отписались от курса",
      });
      setEnrollingCourse(null);
      return;
    }
    
    if (!enrollForm.name || !enrollForm.email || !enrollForm.phone) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    if (enrollingCourse) {
      setEnrolledCourses(prev => [...prev, enrollingCourse]);
      const course = courses.find(c => c.id === enrollingCourse);
      toast({
        title: "Успешно!",
        description: `Вы записались на курс "${course?.title}"!`,
      });
      setEnrollingCourse(null);
    }
  };

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <img 
          src={heroImg} 
          alt="Обучение" 
          className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-10 md:opacity-20 pointer-events-none"
        />
        
        <nav className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/#portfolio">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 bg-blue-100/60 dark:bg-white/10 border border-blue-200 dark:border-white/20"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold truncate">ОнлайнОкадемия</span>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 md:pt-20 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center md:text-left"
          >
            <Badge className="mb-4 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 border-0 inline-flex items-center gap-2 mx-auto md:mx-0">
              <Clock className="w-3 h-3" />
              Скидка 50% через {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Онлайн-курсы от экспертов
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
              Учитесь в своём темпе. Получайте сертификаты. Развивайте навыки для карьеры мечты.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" variant="default" onClick={scrollToCourses} className="w-full sm:w-auto" data-testid="button-browse-courses">
                Смотреть курсы
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowDashboard(true)} 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-blue-500/50 text-blue-600 dark:text-blue-400"
                data-testid="button-my-dashboard"
              >
                Личный кабинет
              </Button>
            </div>

            <div className="mt-8 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 overflow-hidden relative">
                      <img 
                        src={avatarsImg} 
                        alt="user" 
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ 
                          objectPosition: `${(i-1) * 33}% 0%`,
                          transform: "scale(3)"
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-medium text-center sm:text-left">
                  <span className="text-blue-500 font-bold">● В эфире:</span> 1,240 студентов учатся сейчас
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features banner */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20"
              >
                <feature.icon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{feature.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Micro Learning */}
      <section className="py-12 sm:py-16 bg-blue-50/30 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="text-center sm:text-left">
              <Badge variant="outline" className="mb-2 text-blue-500 border-blue-500/30 uppercase tracking-wider text-[10px]">Micro-Learning</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">Короткие уроки</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Освойте навык за чашкой кофе</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex items-center gap-2">
              Все видео <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {microLessons.map((lesson, i) => (
              <Card key={i} className="group overflow-hidden hover-elevate cursor-pointer border-blue-500/10">
                <div className="relative aspect-video">
                  <img src={thumbnailsImg} alt={lesson.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                  <Badge className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md border-0">{lesson.duration}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-blue-500 transition-colors text-sm sm:text-base">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground">{lesson.views} просмотров</p>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 sm:hidden">Все видео</Button>
        </div>
      </section>

      {/* Main Courses */}
      <section ref={coursesRef as any} className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Наши направления</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full px-4"
              >
                {cat === "all" ? "Все" : cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex"
            >
              <Card className="overflow-hidden hover-elevate border-blue-500/10 flex flex-col w-full group">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {course.popular && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 border-0">Популярный</Badge>
                    )}
                    <Badge className="bg-white/90 dark:bg-neutral-900/90 text-foreground backdrop-blur-sm border-0">
                      {course.level}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{course.rating}</span>
                    <span className="text-xs text-muted-foreground">({course.reviews} отзывов)</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{course.students} учеников</span>
                      </div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {course.price.toLocaleString()}₽
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPreviewCourse(course.id)}>
                        Программа
                      </Button>
                      <Button variant="default" size="sm" onClick={() => handleEnrollClick(course.id)}>
                        {enrolledCourses.includes(course.id) ? "Записан" : "Записаться"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Assistant - Compact for mobile */}
      <section className="py-12 sm:py-16 bg-neutral-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">AI Mentor 2.0</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Твой персональный ИИ-наставник</h2>
          <p className="text-neutral-400 mb-8 max-w-lg mx-auto text-sm sm:text-base">
            Задай любой вопрос по курсам или технологиям. Наш ИИ поможет разобраться в сложных темах 24/7.
          </p>
          
          <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Например: Чем отличается Redux от Context API?"
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 text-sm h-11"
                onKeyDown={(e) => e.key === 'Enter' && askAi()}
              />
              <Button onClick={askAi} disabled={isAiLoading} className="bg-blue-600 hover:bg-blue-700 h-11 px-6">
                {isAiLoading ? "Думаю..." : "Спросить"}
              </Button>
            </div>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Code className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Mentor response</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-200">{aiResponse}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">Твои наставники</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <Card key={inst.id} className="p-6 text-center hover-elevate border-blue-500/5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-50">
                <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold mb-1">{inst.name}</h3>
              <p className="text-sm text-blue-500 font-medium mb-3">{inst.role}</p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {inst.rating}
                </div>
                <div>{inst.students}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">Отзывы студентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6 relative overflow-hidden border-blue-500/10">
                <Quote className="absolute -top-2 -right-2 w-24 h-24 text-blue-500/5" />
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-sm sm:text-base">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base italic leading-relaxed text-muted-foreground">"{t.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Compact cards */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Тарифные планы</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Выберите подходящий формат обучения</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`p-6 sm:p-8 flex flex-col h-full border-blue-500/10 ${plan.popular ? 'ring-2 ring-blue-500 relative' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">Популярный</Badge>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-2xl sm:text-3xl font-bold mb-2">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button variant={plan.variant as any} className="w-full">
                {plan.button}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">Частые вопросы</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-blue-500/10">
                <AccordionTrigger className="text-sm sm:text-base hover:text-blue-500 text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 text-center max-w-4xl mx-auto px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Готовы начать обучение?</h2>
        <p className="text-lg text-muted-foreground mb-8">Присоединяйтесь к 10,000+ студентов и начните менять свою жизнь сегодня.</p>
        <Button size="lg" className="px-10 h-14 text-lg bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={scrollToCourses}>
          Выбрать курс сейчас
        </Button>
      </section>

      <footer className="bg-neutral-900 text-neutral-400 py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">ОнлайнОкадемия</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">Современная платформа для обучения технологиям и дизайну. Только практика от лучших экспертов.</p>
            <div className="flex gap-4">
              <Button size="icon" variant="ghost" className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/10">
                <SiGoogle className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/10">
                <SiYcombinator className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/10">
                <SiApple className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Курсы</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Веб-разработка</li>
              <li className="hover:text-white cursor-pointer transition-colors">Дизайн UI/UX</li>
              <li className="hover:text-white cursor-pointer transition-colors">Python & Data</li>
              <li className="hover:text-white cursor-pointer transition-colors">Маркетинг</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Платформа</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">О нас</li>
              <li className="hover:text-white cursor-pointer transition-colors">Наставники</li>
              <li className="hover:text-white cursor-pointer transition-colors">Для бизнеса</li>
              <li className="hover:text-white cursor-pointer transition-colors">Партнерская программа</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Контакты</h4>
            <p className="text-sm mb-4">Есть вопросы? Мы на связи 24/7</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 text-xs py-2">Написать в чат</Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 ОнлайнОкадемия. Дизайн от MP.WebStudio</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Политика конфиденциальности</span>
            <span className="hover:text-white cursor-pointer">Оферта</span>
          </div>
        </div>
      </footer>

      {/* Program Modal - Optimized for mobile */}
      <Dialog open={previewCourse !== null} onOpenChange={(open) => !open && setPreviewCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl bg-white dark:bg-neutral-950 sm:max-h-[85vh]">
          {previewCourse && (
            <div className="flex flex-col">
              <div className="relative h-40 sm:h-52 shrink-0">
                <img 
                  src={courses.find(c => c.id === previewCourse)?.image} 
                  className="w-full h-full object-cover" 
                  alt="Курс" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setPreviewCourse(null)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 backdrop-blur-md rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="absolute bottom-4 left-6 text-white">
                  <Badge className="bg-blue-500 mb-2">{courses.find(c => c.id === previewCourse)?.tags[0]}</Badge>
                  <h3 className="text-xl sm:text-2xl font-bold">{courses.find(c => c.id === previewCourse)?.title}</h3>
                </div>
              </div>
              
              <div className="p-4 sm:p-8">
                <div className="flex flex-wrap gap-4 sm:gap-8 mb-6 text-xs sm:text-sm text-muted-foreground border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{courses.find(c => c.id === previewCourse)?.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{courses.find(c => c.id === previewCourse)?.syllabus.length} модулей</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{courses.find(c => c.id === previewCourse)?.students} студентов</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold mb-3 text-sm sm:text-base">Программа обучения</h4>
                    <div className="space-y-3">
                      {courses.find(c => c.id === previewCourse)?.syllabus.map((module, idx) => (
                        <div key={idx} className="p-3 sm:p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-blue-500/5 group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Модуль {idx + 1}</span>
                          </div>
                          <h5 className="font-bold mb-2 group-hover:text-blue-500 transition-colors text-sm sm:text-base">{module.title}</h5>
                          <ul className="space-y-1">
                            {module.topics.map((topic, i) => (
                              <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                                <Play className="w-3 h-3 text-blue-500/50" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4">
                  <Button className="w-full sm:flex-1 h-12" onClick={() => {
                    setPreviewCourse(null);
                    handleEnrollClick(previewCourse);
                  }}>
                    Записаться на курс
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enroll Modal - Optimized for mobile */}
      <Dialog open={enrollingCourse !== null} onOpenChange={(open) => !open && setEnrollingCourse(null)}>
        <DialogContent className="max-w-md p-0 border-0 overflow-hidden bg-white dark:bg-neutral-950 rounded-2xl">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                {enrolledCourses.includes(enrollingCourse || 0) ? "Управление подпиской" : "Запись на курс"}
              </h2>
              <Button size="icon" variant="ghost" onClick={() => setEnrollingCourse(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 border border-blue-100 dark:border-blue-900/30">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1 text-sm sm:text-base">
                {courses.find(c => c.id === enrollingCourse)?.title}
              </h4>
              <p className="text-xs text-blue-500">Стоимость: {courses.find(c => c.id === enrollingCourse)?.price}₽</p>
            </div>

            {enrolledCourses.includes(enrollingCourse || 0) ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <p className="text-sm font-medium text-green-600">Вы уже записаны на этот курс!</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => { setEnrollingCourse(null); setShowDashboard(true); }} className="h-12 bg-blue-600 hover:bg-blue-700">
                    Перейти к обучению
                  </Button>
                  <Button variant="ghost" onClick={handleEnrollSubmit} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Отказаться от курса
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Ваше имя</Label>
                  <Input 
                    value={enrollForm.name}
                    onChange={e => setEnrollForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Александр Иванов"
                    className="h-11 border-neutral-200 dark:border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Email</Label>
                  <Input 
                    type="email"
                    value={enrollForm.email}
                    onChange={e => setEnrollForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="alex@example.com"
                    className="h-11 border-neutral-200 dark:border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Телефон</Label>
                  <Input 
                    type="tel"
                    value={enrollForm.phone}
                    onChange={e => setEnrollForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (900) 000-00-00"
                    className="h-11 border-neutral-200 dark:border-neutral-800"
                  />
                </div>
                <div className="pt-4">
                  <Button onClick={handleEnrollSubmit} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                    Оформить запись
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой обработки персональных данных.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dashboard Drawer/Dialog - Optimized for mobile */}
      <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-neutral-50 dark:bg-neutral-950 sm:max-h-[85vh]">
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">АИ</div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Личный кабинет</h3>
                  <p className="text-xs text-muted-foreground">Александр Иванов</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowDashboard(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 sm:p-6 border-blue-500/10">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="w-4 h-4 text-blue-500" /> Текущие курсы
                  </h4>
                  <div className="space-y-5">
                    {studentProgress.map((course, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium truncate pr-2">{course.title}</span>
                          <span className="text-blue-500 font-bold">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 border-blue-500/10">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Star className="w-4 h-4 text-yellow-500" /> Достижения
                  </h4>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {achievements.map((ach, idx) => (
                      <div key={idx} className="text-center group">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-2 ${ach.color} transition-transform group-hover:scale-110`}>
                          <ach.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-[10px] font-bold line-clamp-1">{ach.title}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Roadmap & Events */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-bold text-sm sm:text-base">Твой план карьеры: Frontend Developer</h4>
                  <div className="relative flex flex-col gap-3">
                    {careerRoadmap.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4 relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${step.completed ? 'bg-green-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}`}>
                          {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className={`flex-1 p-3 rounded-lg border text-xs sm:text-sm font-medium ${step.completed ? 'bg-green-50 dark:bg-green-900/10 border-green-500/20' : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-white/5'}`}>
                          {step.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm sm:text-base">События</h4>
                  {upcomingEvents.map((event, idx) => (
                    <Card key={idx} className="p-4 border-blue-500/5 hover:border-blue-500/20 transition-colors">
                      <Badge variant="outline" className="mb-2 text-[10px] uppercase border-blue-500/30 text-blue-500">{event.type}</Badge>
                      <h5 className="font-bold text-xs sm:text-sm mb-1">{event.title}</h5>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full text-xs h-10">Календарь</Button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 mt-auto border-t bg-white dark:bg-neutral-900 flex justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90">
              <Button onClick={() => setShowDashboard(false)} className="w-full sm:w-auto">Закрыть</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
