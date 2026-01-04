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
    description: "Научитесь веб-разработке, дизайну UI/UX, Python и маркетингу. Курсы от опытных преподавателей. Сертификаты после завершения.",
    keywords: "онлайн-курсы, программирование, веб-разработка, дизайн, Python, React, обучение",
    ogTitle: "ОнлайнОкадемия — Онлайн образование | Дизайн от MP.WebStudio",
    ogDescription: "Лучшие онлайн-курсы по программированию и дизайну для начинающих и профессионалов",
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
    
    // Отписка - без валидации
    if (isAlreadyEnrolled) {
      setEnrolledCourses(prev => prev.filter(id => id !== enrollingCourse));
      toast({
        title: "Готово",
        description: "Вы отписались от курса",
      });
      setEnrollingCourse(null);
      return;
    }
    
    // Новая запись - требуется валидация
    if (!enrollForm.name || !enrollForm.email || !enrollForm.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    if (enrollingCourse) {
      setEnrolledCourses(prev => [...prev, enrollingCourse]);
      const course = courses.find(c => c.id === enrollingCourse);
      toast({
        title: "Успешно!",
        description: `Вы записались на курс "${course?.title}"! На указанный email отправлено подтверждение.`,
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
          alt="Онлайн обучение" 
          className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-20 pointer-events-none"
        />
        
        <nav className="relative z-50 max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/#portfolio">
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-blue-100/60 dark:bg-white/10 border border-blue-200 dark:border-white/20 hover:bg-blue-100/80 dark:hover:bg-white/20"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">ОнлайнОкадемия</span>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 border-0 flex items-center gap-2 w-fit">
              <Clock className="w-3 h-3" />
              Скидка 50% закончится через {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Онлайн-курсы от экспертов индустрии
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Учитесь в своём темпе. Получайте сертификаты. Развивайте навыки для карьеры вашей мечты.
            </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="default" onClick={scrollToCourses} data-testid="button-browse-courses">
                    Смотреть курсы
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => setShowDashboard(true)} 
                    className="bg-white/10 backdrop-blur-md border-blue-500/50 text-blue-600 dark:text-blue-400"
                    data-testid="button-my-dashboard"
                  >
                    Моё обучение (Личный кабинет)
                  </Button>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 overflow-hidden relative">
                          <img 
                            src={avatarsImg} 
                            alt={`user ${i}`} 
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ 
                              objectPosition: `${(i-1) * 33}% 0%`,
                              transform: "scale(3)" // Focusing on individual faces from the group shot
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-medium">
                      <span className="text-blue-500">● Живой эфир:</span> 1,240 студентов изучают React прямо сейчас
                    </p>
                  </div>
                </div>
              </motion.div>
        </div>

        {/* Features banner */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-12">
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20"
              >
                <feature.icon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Micro Learning */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Микро-обучение</h2>
              <p className="text-muted-foreground">Короткие уроки для быстрого погружения</p>
            </div>
            <Button variant="ghost" className="text-blue-500">Все уроки</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {microLessons.map((lesson, i) => (
              <Card key={i} className="p-4 hover-elevate cursor-pointer border-blue-500/10">
                <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800 mb-4 flex items-center justify-center relative group">
                  <Play className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  <Badge className="absolute bottom-2 right-2 bg-black/60">{lesson.duration}</Badge>
                </div>
                <h4 className="font-bold mb-1">{lesson.title}</h4>
                <p className="text-xs text-muted-foreground">{lesson.views} просмотров</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section ref={coursesRef} className="py-16 bg-muted/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Популярные курсы</h2>
            <p className="text-lg text-muted-foreground mb-6">Выберите курс и начните обучение прямо сейчас</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`filter-${cat}`}
                >
                  {cat === "all" ? "Все курсы" : cat}
                </Button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                data-testid={`course-card-${course.id}`}
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden h-40">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    {course.popular && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
                        Осталось 4 места
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={() => setPreviewCourse(course.id)}
                      data-testid={`button-play-${course.id}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-blue-500 ml-1" />
                      </div>
                    </motion.button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {course.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="block">
                        <strong>{course.instructor}</strong>
                      </span>
                      <span className="text-xs">{course.level}</span>
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {course.rating} ({course.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {course.price}₽
                      </span>
                      <Button 
                        size="sm"
                        variant={enrolledCourses.includes(course.id) ? "secondary" : "default"}
                        onClick={() => handleEnrollClick(course.id)}
                        data-testid={`button-enroll-${course.id}`}
                      >
                        {enrolledCourses.includes(course.id) ? "Отписаться" : "Записаться"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 border-y bg-muted/30 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
            Наши выпускники работают в крупнейших компаниях
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            <SiGoogle className="w-10 h-10" />
            <SiApple className="w-10 h-10" />
            <SiAmazon className="w-10 h-10" />
            <SiYcombinator className="w-10 h-10" />
            <div className="text-2xl font-bold">Яндекс</div>
            <div className="text-2xl font-bold">СБЕР</div>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Наши преподаватели</h2>
          <p className="text-lg text-muted-foreground">Учитесь у лучших специалистов индустрии</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
              data-testid={`instructor-card-${instructor.id}`}
            >
              <img 
                src={instructor.image} 
                alt={instructor.name}
                className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100 dark:border-blue-900/30"
              />
              <h3 className="text-xl font-semibold mb-1">{instructor.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">
                {instructor.role}
              </p>
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <p>{instructor.experience}</p>
                <p>{instructor.students}</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(instructor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
                <span className="text-sm ml-2 text-muted-foreground">{instructor.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-muted/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Тарифные планы</h2>
            <p className="text-lg text-muted-foreground">Выберите подходящий формат обучения для ваших целей</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`relative p-8 flex flex-col hover-elevate transition-all ${plan.popular ? 'border-blue-500 shadow-xl scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">Популярный</Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.variant as any} 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: `Выбран тариф "${plan.name}"`,
                      description: "В демо-режиме выбор тарифа открывает форму записи.",
                    });
                    handleEnrollClick(1);
                  }}
                >
                  {plan.button}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Отзывы студентов</h2>
          <p className="text-lg text-muted-foreground">Истории успеха наших выпускников</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testi) => (
            <Card key={testi.id} className="p-8 hover-elevate transition-all">
              <Quote className="w-10 h-10 text-blue-500/20 mb-4" />
              <p className="text-lg italic mb-6">"{testi.text}"</p>
              <div className="flex items-center gap-4">
                <img src={testi.image} alt={testi.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold">{testi.name}</h4>
                  <p className="text-sm text-muted-foreground">{testi.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 bg-blue-600 text-white border-0 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all" />
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Интеллектуальный помощник
              </h3>
              <p className="text-blue-100 mb-6">
                Задайте любой вопрос о наших курсах. GigaChat проанализирует базу знаний и ответит в реальном времени.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    placeholder="Например: Поможете ли вы с трудоустройством?" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-12"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askAi()}
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-1 top-1 text-white hover:bg-white/20"
                    onClick={askAi}
                    disabled={isAiLoading}
                  >
                    <TrendingUp className={`w-4 h-4 ${isAiLoading ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                
                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/10 rounded-lg border border-white/20 text-sm italic"
                  >
                    <strong>AI:</strong> {aiResponse}
                  </motion.div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-purple-600 text-white border-0 shadow-xl overflow-hidden">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Геймификация
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {achievements.map((ach) => (
                  <div key={ach.title} className="bg-white/10 p-2 rounded-lg text-center group hover:bg-white/20 transition-colors cursor-help">
                    <ach.icon className={`w-6 h-6 mx-auto mb-1 ${ach.color}`} />
                    <p className="text-[10px] font-bold uppercase tracking-tighter">{ach.title}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Preview Dialog */}
      <Dialog open={previewCourse !== null} onOpenChange={(open) => !open && setPreviewCourse(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden" data-testid="dialog-preview-course">
          {previewCourse !== null && (
            <div className="flex flex-col">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-sm">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Превью курса: {courses.find(c => c.id === previewCourse)?.title}</h3>
                  <p className="text-white/70">Начните обучение с бесплатного ознакомительного урока</p>
                </div>
                <DialogClose className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
                  <X className="w-5 h-5" />
                </DialogClose>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl">Программа обучения</DialogTitle>
                </DialogHeader>
                <Accordion type="single" collapsible className="w-full">
                  {courses.find(c => c.id === previewCourse)?.syllabus?.map((module, i) => (
                    <AccordionItem key={i} value={`module-${i}`}>
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center border-blue-200">
                            {i + 1}
                          </Badge>
                          <span className="font-semibold">{module.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3 pl-12">
                          {module.topics.map((topic, j) => (
                            <li key={j} className="flex flex-col gap-2 p-3 rounded-lg border border-blue-500/5 bg-blue-50/30 dark:bg-blue-900/10">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Play className="w-3 h-3 text-blue-500" />
                                {topic}
                                <span className="ml-auto text-xs opacity-50">15:00</span>
                              </div>
                              {/* Sandbox integration */}
                              <div className="mt-2 p-3 rounded bg-neutral-900 text-xs font-mono text-blue-300 border border-white/5">
                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5 opacity-60">
                                  <span>interactive_sandbox.js</span>
                                  <Badge variant="outline" className="h-4 text-[9px] border-blue-500/30 text-blue-400">EDITABLE</Badge>
                                </div>
                                <div className="space-y-1">
                                  <p><span className="text-purple-400">function</span> <span className="text-yellow-300">solveProblem</span>() {'{'}</p>
                                  <p className="pl-4 text-neutral-500">// Напишите решение здесь</p>
                                  <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-green-300">"Success!"</span>;</p>
                                  <p>{'}'}</p>
                                </div>
                                <Button size="sm" className="mt-3 h-7 bg-blue-600 hover:bg-blue-700 text-[10px] w-full">Запустить код</Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                  <Button variant="outline" onClick={() => setPreviewCourse(null)}>Закрыть</Button>
                  <Button onClick={() => {
                    const id = previewCourse;
                    setPreviewCourse(null);
                    handleEnrollClick(id);
                  }}>Записаться на курс</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4">Начните обучение прямо сейчас</h2>
            <p className="text-lg text-white/90 mb-8">
              Присоединитесь к тысячам студентов, которые уже развивают свои навыки
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={scrollToCourses}
              data-testid="button-start-learning"
            >
              Выбрать курс
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-bold">ОнлайнОкадемия</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Платформа для обучения в интернете
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Курсы</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Программирование</a></li>
              <li><a href="#" className="hover:text-foreground">Дизайн</a></li>
              <li><a href="#" className="hover:text-foreground">Маркетинг</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">О нас</a></li>
              <li><a href="#" className="hover:text-foreground">Контакты</a></li>
              <li><a href="#" className="hover:text-foreground">Блог</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground">Помощь</a></li>
              <li><a href="#" className="hover:text-foreground">Условия</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 ОнлайнОкадемия. Все права защищены.</p>
        </div>
      </footer>

      {/* Enroll Form Modal */}
      <Dialog open={enrollingCourse !== null} onOpenChange={(open) => !open && setEnrollingCourse(null)}>
        <DialogContent data-testid="dialog-enroll-form">
          <DialogHeader>
            <DialogTitle>
              {enrollingCourse !== null && enrolledCourses.includes(enrollingCourse) ? "Отписаться от курса?" : "Записаться на курс"}
            </DialogTitle>
          </DialogHeader>
          {enrollingCourse !== null && (() => {
            const course = courses.find(c => c.id === enrollingCourse);
            const isEnrolled = enrolledCourses.includes(enrollingCourse);
            return course ? (
              <div className="space-y-4">
                {!isEnrolled && (
                  <>
                    <p className="text-muted-foreground">
                      Заполните форму, чтобы начать обучение на курсе <strong>{course.title}</strong>
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Ваше имя</Label>
                        <Input
                          id="name"
                          placeholder="Иван Петров"
                          value={enrollForm.name}
                          onChange={(e) => setEnrollForm({...enrollForm, name: e.target.value})}
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ivan@example.com"
                          value={enrollForm.email}
                          onChange={(e) => setEnrollForm({...enrollForm, email: e.target.value})}
                          data-testid="input-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          placeholder="+7 (999) 999-99-99"
                          value={enrollForm.phone}
                          onChange={(e) => setEnrollForm({...enrollForm, phone: e.target.value})}
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                  </>
                )}
                {isEnrolled && (
                  <p className="text-muted-foreground">
                    Вы уже записаны на этот курс. Нажмите "Отписаться", если хотите удалить регистрацию.
                  </p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setEnrollingCourse(null)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant={isEnrolled ? "destructive" : "default"}
                    onClick={handleEnrollSubmit}
                    data-testid="button-submit-enroll"
                  >
                    {isEnrolled ? "Отписаться" : "Записаться"}
                  </Button>
                </div>
              </div>
            ) : null;
          })()}
        </DialogContent>
      </Dialog>

      {/* Student Dashboard Dialog */}
      <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Личный кабинет студента</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Мой прогресс
              </h3>
              <div className="grid gap-4">
                {studentProgress.map((item) => (
                  <Card key={item.title} className="p-4 hover-elevate transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.status}</p>
                      </div>
                      <span className="font-bold">{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Расписание
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="p-3 bg-muted/50 rounded-lg border border-border">
                      <Badge variant="secondary" className="mb-2">{event.type}</Badge>
                      <h4 className="text-sm font-bold leading-tight mb-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Награды
                </h3>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((ach) => (
                    <div key={ach.title} title={ach.desc} className="p-2 bg-muted rounded-full hover:bg-muted-foreground/10 transition-colors">
                      <ach.icon className={`w-5 h-5 ${ach.color}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex justify-end">
            <Button onClick={() => setShowDashboard(false)}>Вернуться на главную</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
