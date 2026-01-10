import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, ArrowRight, Check, ChevronDown, Plus, X, Mail, Phone } from "lucide-react";
import { SiTelegram, SiVk } from "react-icons/si";
import { ParticleBackground } from "./ParticleBackground";

import { SectionBadge } from "./SectionBadge";

interface FlyingLetterProps {
  letter: string;
  index: number;
  totalLetters: number;
  isGradient?: boolean;
  isInView: boolean;
}

function FlyingLetter({ letter, index, totalLetters, isGradient, isInView }: FlyingLetterProps) {
  const isAndroid = useMemo(() => {
    return /Android/i.test(navigator.userAgent);
  }, []);

  const startPosition = useMemo(() => {
    if (isAndroid) {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.2,
      };
    }
    const angle = (index / totalLetters) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 200 + Math.random() * 300;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 100,
      rotate: (Math.random() - 0.5) * 180,
      scale: 0.5 + Math.random() * 0.3,
    };
  }, [index, totalLetters, isAndroid]);

  const delay = index * 0.02;

  if (isAndroid) {
    return (
      <span
        className={`inline-block ${isGradient ? "bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" : ""}`}
      >
        {letter}
      </span>
    );
  }

  if (letter === " ") {
    return <span className="inline-block w-[0.3em]">&nbsp;</span>;
  }

  return (
    <motion.span
      className={`inline-block ${isGradient ? "bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" : ""}`}
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        rotate: startPosition.rotate,
        scale: startPosition.scale,
        opacity: 0,
        filter: isAndroid ? "blur(2px)" : "blur(6px)",
      }}
      animate={isInView ? {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      } : {}}
      transition={isAndroid ? {
        duration: 0.4,
        delay: delay,
        ease: "easeOut",
      } : {
        duration: 0.6,
        delay: delay,
        type: "spring",
        stiffness: 120,
        damping: 14,
      }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {letter}
    </motion.span>
  );
}

interface AnimatedTextProps {
  text: string;
  startIndex: number;
  isGradient?: boolean;
  isInView: boolean;
}

function AnimatedText({ text, startIndex, isGradient, isInView }: AnimatedTextProps) {
  const words = text.split(" ");
  let letterIndex = startIndex;

  return (
    <>
      {words.map((word, wordIdx) => {
        const wordStartIndex = letterIndex;
        letterIndex += word.length + 1;
        
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((letter, i) => (
              <FlyingLetter
                key={i}
                letter={letter}
                index={wordStartIndex + i}
                totalLetters={startIndex + text.length + 10}
                isGradient={isGradient}
                isInView={isInView}
              />
            ))}
            {wordIdx < words.length - 1 && <span className="inline-block w-[0.3em]">&nbsp;</span>}
          </span>
        );
      })}
    </>
  );
}

type ProjectType = "bizcard" | "landing" | "corporate" | "shop";

interface Feature {
  id: string;
  label: string;
  price: number;
  description?: string;
  availableFor: ProjectType[];
}

interface ProjectTypeConfig {
  value: ProjectType;
  label: string;
  basePrice: number;
  description: string;
  includes: string[];
}

const projectTypes: ProjectTypeConfig[] = [
  {
    value: "bizcard",
    label: "Сайт-визитка",
    basePrice: 45000,
    description: "Компактный сайт о вас или компании",
    includes: [
      "Адаптивный дизайн (мобильный + ПК)",
      "Одна страница",
      "Контактная информация",
      "Базовый дизайн",
      "SEO-основа",
      "Хостинг включён",
      "Форма обратной связи",
    ],
  },
  {
    value: "landing",
    label: "Лендинг",
    basePrice: 75000,
    description: "Одностраничный продающий сайт",
    includes: [
      "Адаптивный дизайн (мобильный + ПК)",
      "До 7 секций",
      "Форма обратной связи",
      "Базовые анимации",
      "SEO-основа",
      "Хостинг включён",
      "Система аналитики",
      "Виджеты мессенджеров (WhatsApp, Telegram)",
      "Email-уведомления",
    ],
  },
  {
    value: "corporate",
    label: "Корпоративный сайт",
    basePrice: 140000,
    description: "Многостраничный сайт компании со всеми необходимыми инструментами",
    includes: [
      "Всё из лендинга",
      "До 10 страниц",
      "Навигация между страницами",
      "Единый шаблон дизайна",
      "Страница контактов с картой",
      "Галерея / Портфолио",
      "Блог / Новости",
      "Система аналитики",
    ],
  },
  {
    value: "shop",
    label: "Интернет-магазин",
    basePrice: 200000,
    description: "Полнофункциональный магазин со всеми инструментами",
    includes: [
      "Всё из корпоративного сайта",
      "Каталог товаров",
      "Карточки товаров",
      "Корзина покупок",
      "Оформление заказа",
      "Категории товаров",
      "Онлайн-оплата (платёжные системы)",
      "Интеграция доставки",
      "Фильтры и сортировка товаров",
      "Личные кабинеты клиентов",
      "Email-уведомления",
      "Поиск по сайту",
      "Блог / Новости",
      "Админ-панель",
      "Система аутентификации (для админки)",
      "Система аналитики",
    ],
  },
];

const features: Feature[] = [
  { id: "extra_pages_bizcard", label: "Доп. страницы (3 шт)", price: 8000, description: "Сверх базовых", availableFor: ["bizcard"] },
  { id: "map", label: "Карта с адресом", price: 5000, description: "Интерактивная карта", availableFor: ["bizcard"] },
  { id: "calculator", label: "Калькулятор стоимости", price: 12000, description: "Интерактивный расчёт", availableFor: ["landing", "corporate", "shop"] },
  { id: "gallery", label: "Галерея / Портфолио", price: 10000, description: "Слайдер с лайтбоксом", availableFor: ["bizcard", "landing", "shop"] },
  { id: "messengers", label: "Виджеты мессенджеров", price: 7000, description: "WhatsApp, Telegram", availableFor: ["bizcard", "corporate", "shop"] },
  { id: "email_notify", label: "Email-уведомления", price: 10000, description: "Письма о заявках", availableFor: ["corporate"] },
  { id: "telegram_notify", label: "Telegram-уведомления", price: 12000, description: "Заявки в Telegram-бот", availableFor: ["landing", "corporate", "shop"] },
  { id: "animations", label: "Продвинутые анимации", price: 20000, description: "Параллакс, 3D-эффекты", availableFor: ["bizcard", "landing", "corporate", "shop"] },
  { id: "chat_widget", label: "Чат-виджет поддержки", price: 7000, description: "Онлайн-чат с клиентами", availableFor: ["bizcard", "landing", "corporate", "shop"] },
  { id: "popup", label: "Pop-up окна", price: 7000, description: "При выходе, по таймеру", availableFor: ["landing", "corporate", "shop"] },
  { id: "countdown", label: "Таймер акции", price: 5000, description: "Обратный отсчёт", availableFor: ["landing", "corporate", "shop"] },
  { id: "multilang", label: "Мультиязычность", price: 30000, description: "2+ языка", availableFor: ["bizcard", "landing", "corporate", "shop"] },
  { id: "extra_sections", label: "Доп. секции (5 шт)", price: 12000, description: "Сверх базовых", availableFor: ["landing"] },
  { id: "extra_pages", label: "Доп. страницы (5 шт)", price: 20000, description: "Сверх базовых", availableFor: ["corporate"] },
  { id: "blog", label: "Блог / Новости", price: 35000, description: "Раздел статей", availableFor: [] },
  { id: "search", label: "Поиск по сайту", price: 15000, description: "Умный поиск", availableFor: ["corporate"] },
  { id: "team", label: "Страница команды", price: 10000, description: "Карточки сотрудников", availableFor: ["corporate"] },
  { id: "booking", label: "Онлайн-запись", price: 35000, description: "Календарь бронирования", availableFor: ["landing", "corporate"] },
  { id: "payment", label: "Онлайн-оплата", price: 35000, description: "Платёжные системы", availableFor: ["landing", "corporate"] },
  { id: "crm", label: "Интеграция CRM", price: 45000, description: "Синхронизация с CRM-системой", availableFor: ["landing", "corporate", "shop"] },
  { id: "filters", label: "Фильтры и сортировка", price: 20000, description: "По параметрам товаров", availableFor: [] },
  { id: "favorites", label: "Избранное", price: 10000, description: "Сохранение товаров", availableFor: ["shop"] },
  { id: "customer_accounts", label: "Личные кабинеты клиентов", price: 20000, description: "История заказов, сохранённые адреса", availableFor: [] },
  { id: "telegram_shop", label: "Telegram-магазин", price: 50000, description: "Мини-приложение", availableFor: ["shop"] },
  { id: "delivery", label: "Интеграция доставки", price: 30000, description: "Служба логистики", availableFor: [] },
  { id: "ai_integration", label: "Интеграция ИИ", price: 60000, description: "Чат-бот, рекомендации товаров", availableFor: ["corporate", "shop"] },
  { id: "custom", label: "Другое / Индивидуальная функция", price: 0, description: "Обсудим отдельно", availableFor: ["bizcard", "landing", "corporate", "shop"] },
  { id: "exclusive_design", label: "Эксклюзивный дизайн", price: 30000, description: "Уникальный кастомный дизайн", availableFor: ["bizcard", "landing", "corporate", "shop"] },
];

type CalculatorFormData = {
  name: string;
  phone: string;
  email: string;
  description: string;
};

export function CalculatorSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projectType, setProjectType] = useState<ProjectType>("bizcard");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [expandedType, setExpandedType] = useState<ProjectType | null>(null);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const { toast } = useToast();

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(z.object({
      name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
      phone: z.string().min(10, "Введите корректный номер телефона"),
      email: z.string().email("Введите корректный email"),
      description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
    })),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CalculatorFormData) => {
      const currentProjectType = projectTypes.find((p) => p.value === projectType)!;
      const currentBasePrice = currentProjectType?.basePrice || 0;
      
      const currentFeaturesPrice = selectedFeatures.reduce((sum, featureId) => {
        const feature = features.find((f) => f.id === featureId);
        if (feature && feature.availableFor.includes(projectType)) {
          return sum + feature.price;
        }
        return sum;
      }, 0);
      
      const currentTotalPrice = currentBasePrice + currentFeaturesPrice;

      const selectedFeaturesList = selectedFeatures
        .map((fId) => {
          const feature = features.find((f) => f.id === fId);
          return feature ? `${feature.label} (+${feature.price} ₽)` : null;
        })
        .filter(Boolean);

      const response = await apiRequest("POST", "/api/send-calculator-order", {
        ...data,
        projectType,
        selectedFeatures: selectedFeaturesList,
        basePrice: currentBasePrice,
        totalPrice: currentTotalPrice,
      });
      return response.json();
    },
    onSuccess: () => {
      setOpenOrderModal(false);
      form.reset();
      toast({
        title: "Заказ отправлен!",
        description: "Мы получили вашу заявку и свяжемся с вами вскоре.",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заказ. Попробуйте позже.",
        variant: "destructive",
      });
    },
  });

  const currentProjectType = projectTypes.find((p) => p.value === projectType);
  const basePrice = currentProjectType?.basePrice || 0;

  const getAvailableFeatures = (type: ProjectType) => {
    return features.filter((f) => f.availableFor.includes(type));
  };

  const featuresPrice = selectedFeatures.reduce((sum, featureId) => {
    const feature = features.find((f) => f.id === featureId);
    if (feature && feature.availableFor.includes(projectType)) {
      return sum + feature.price;
    }
    return sum;
  }, 0);

  const totalPrice = basePrice + featuresPrice;

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleProjectTypeChange = (value: ProjectType) => {
    setProjectType(value);
    setExpandedType(value);
    setSelectedFeatures((prev) =>
      prev.filter((featureId) => {
        const feature = features.find((f) => f.id === featureId);
        return feature?.availableFor.includes(value);
      })
    );
  };

  const toggleExpanded = (type: ProjectType) => {
    setExpandedType(expandedType === type ? null : type);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const getSelectedCountForType = (type: ProjectType) => {
    return selectedFeatures.filter((fId) => {
      const feature = features.find((f) => f.id === fId);
      return feature?.availableFor.includes(type);
    }).length;
  };

  const line1 = "Готовы ";
  const line2 = "начать проект?";

  return (
    <section id="calculator" className="py-24 md:py-32 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>

      <ParticleBackground />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="absolute top-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <div className="text-center mb-12 px-4">
          <SectionBadge>Расчёт стоимости / Контакты</SectionBadge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-4 tracking-tight flex flex-row items-center justify-center gap-2 whitespace-nowrap overflow-visible scanline-header">
            <span className="neural-interface py-1">
              <AnimatedText text={line1} startIndex={0} isInView={isInView} />
            </span>
            <span className="neural-interface font-bold py-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              <AnimatedText text={line2} startIndex={line1.length} isGradient isInView={isInView} />
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
          >
            Выберите тип сайта и добавьте нужные функции — цена рассчитается автоматически
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="p-6 bg-background/30 border-border/40 backdrop-blur-xl relative overflow-hidden group/main">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full" />
                Выберите основу проекта
              </h3>
              <RadioGroup
                value={projectType}
                onValueChange={(value) => handleProjectTypeChange(value as ProjectType)}
                className="space-y-4"
              >
                {projectTypes.map((type) => {
                  const typeFeatures = getAvailableFeatures(type.value);
                  const selectedCount = getSelectedCountForType(type.value);
                  const isExpanded = expandedType === type.value;
                  const isSelected = projectType === type.value;

                  return (
                    <div key={type.value} className="relative">
                      <RadioGroupItem
                        value={type.value}
                        id={type.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={type.value}
                        className={`flex flex-col p-5 rounded-xl border transition-all duration-500 cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_30px_rgba(56,189,248,0.1)]"
                            : "border-border/30 bg-card/20 hover:border-border/60 hover:bg-card/30"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="active-border"
                            className="absolute inset-0 border-2 border-cyan-400/30 rounded-xl"
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 relative z-10">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className={`font-bold text-lg tracking-tight transition-colors ${isSelected ? "text-cyan-400" : "text-foreground"}`}>
                                {type.label}
                              </span>
                              <div className="h-px w-8 bg-border/50 hidden sm:block" />
                              <span className="text-sm font-mono font-bold text-purple-400">
                                {formatPrice(type.basePrice)} ₽
                              </span>
                              {selectedCount > 0 && isSelected && (
                                <motion.span 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/30"
                                >
                                  +{selectedCount} модуля
                                </motion.span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-medium">{type.description}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                              {type.includes.map((item, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                  <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(56,189,248,0.8)]" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          {isSelected && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleExpanded(type.value); }}
                              className="shrink-0 gap-2 bg-background/40 hover:bg-background/60 border border-border/40 rounded-lg h-10 px-4"
                            >
                              <Plus className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? "rotate-45" : ""}`} />
                              <span className="text-xs font-bold uppercase tracking-widest">Опции</span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} />
                            </Button>
                          )}
                        </div>
                      </Label>

                      <AnimatePresence>
                        {isExpanded && isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-primary/[0.03] border border-primary/20 border-t-0 rounded-b-xl">
                              <p className="text-sm text-muted-foreground mb-5 font-medium flex items-center gap-2 px-1">
                                <Plus className="w-4 h-4 text-primary animate-pulse" />
                                <span className="tracking-tight">Дополнительные модули и функции:</span>
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                {typeFeatures.map((feature, idx) => {
                                  const isFeatureSelected = selectedFeatures.includes(feature.id);
                                  return (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.05 }}
                                      key={feature.id}
                                      onClick={(e) => { e.stopPropagation(); toggleFeature(feature.id); }}
                                      className={`group relative p-5 rounded-xl border transition-all duration-300 cursor-pointer hover-elevate overflow-visible select-none ${
                                        isFeatureSelected
                                          ? "border-primary bg-primary/10 shadow-[0_0_25px_rgba(56,189,248,0.15)] ring-1 ring-primary/20"
                                          : "border-border/40 bg-card/40 hover:border-primary/40 hover:bg-card/60"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1 min-w-0">
                                          <span className={`text-sm font-bold block truncate transition-colors duration-300 ${isFeatureSelected ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}>
                                            {feature.label}
                                          </span>
                                          {feature.description && (
                                            <p className="text-[12px] text-muted-foreground leading-relaxed mt-1.5 line-clamp-2 font-medium">
                                              {feature.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-500 ${
                                          isFeatureSelected 
                                            ? "bg-primary border-primary rotate-0 scale-110 shadow-[0_0_15px_rgba(56,189,248,0.6)]" 
                                            : "border-muted-foreground/30 group-hover:border-primary/50 -rotate-12 group-hover:rotate-0"
                                        }`}>
                                          <AnimatePresence mode="wait">
                                            {isFeatureSelected ? (
                                              <motion.div
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                                key="check"
                                              >
                                                <Check className="w-3.5 h-3.5 text-primary-foreground stroke-[3]" />
                                              </motion.div>
                                            ) : (
                                              <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key="plus"
                                              >
                                                <Plus className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary/70" />
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>
                                      <div className={`flex items-center justify-between mt-3 pt-3 border-t transition-colors duration-300 ${isFeatureSelected ? "border-primary/20" : "border-border/10"}`}>
                                        <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60 font-bold">Стоимость модуля</span>
                                        <span className={`text-xs font-mono font-black transition-colors duration-300 ${isFeatureSelected ? "text-primary" : "text-primary/70 group-hover:text-primary"}`}>
                                          +{formatPrice(feature.price)} ₽
                                        </span>
                                      </div>
                                      
                                      {/* Декоративный эффект свечения при наведении */}
                                      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </RadioGroup>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:h-full flex flex-col gap-6"
          >
            <Card className="p-8 bg-background/40 border-cyan-500/20 backdrop-blur-2xl sticky top-24 overflow-hidden group/price">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px] group-hover/price:bg-cyan-500/30 transition-colors duration-700" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">Итоговый расчёт</h3>
                  <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 to-transparent rounded-full mt-1" />
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">База: {currentProjectType?.label}</span>
                  <span className="font-mono font-bold text-foreground">{formatPrice(basePrice)} ₽</span>
                </div>
                
                <div className="px-2 space-y-3">
                  {selectedFeatures.length > 0 ? (
                    selectedFeatures.map((featureId) => {
                      const feature = features.find((f) => f.id === featureId);
                      if (!feature || !feature.availableFor.includes(projectType)) return null;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={featureId} 
                          className="flex justify-between text-[13px] items-center"
                        >
                          <span className="text-muted-foreground/80 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-purple-400" />
                            {feature.label}
                          </span>
                          <span className="font-mono text-purple-400">+{formatPrice(feature.price)} ₽</span>
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="text-[12px] text-muted-foreground/40 italic px-1">Дополнительные модули не выбраны</p>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-6" />
                
                <div className="bg-background/40 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Общая сумма</span>
                    <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-bold uppercase">Ready to start</div>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                      {formatPrice(totalPrice)}
                    </span>
                    <span className="text-sm font-bold text-foreground/60 ml-1">₽</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <Button
                  onClick={() => setOpenOrderModal(true)}
                  className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold uppercase tracking-widest border-0 shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:shadow-[0_0_35px_rgba(56,189,248,0.4)] transition-all duration-500 group/btn"
                >
                  <span className="flex items-center gap-2">
                    Получить консультацию
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <a href="/order" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-cyan-500/30 hover:border-cyan-500/60 bg-transparent text-xs font-black uppercase tracking-[0.3em] hover:bg-cyan-500/5 transition-all duration-500"
                  >
                    Заказать проект
                  </Button>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex gap-4">
                  <SiTelegram className="w-4 h-4" />
                  <SiVk className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono tracking-tighter uppercase">Neural Engine v2.0</span>
              </div>
            </Card>

            <div className="p-6 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-xl group/contacts">
              <h4 className="font-bold mb-5 text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                Свяжитесь с нами
              </h4>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group/item">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover/item:bg-cyan-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email</div>
                    <a href="mailto:mpwebstudio1@gmail.com" className="text-sm text-foreground font-medium hover:text-cyan-400 transition-colors">
                      mpwebstudio1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group/item">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover/item:bg-purple-500/20 transition-colors">
                    <Phone className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Телефон</div>
                    <a href="tel:+79531814136" className="text-sm text-foreground font-medium hover:text-purple-400 transition-colors">
                      +7 (953) 181-41-36
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/40 border border-white/5">
                <h5 className="font-bold mb-4 text-xs uppercase tracking-widest text-muted-foreground/70">Наши сообщества</h5>
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://t.me/MPWebStudio_ru" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="w-full gap-2 h-10 border-cyan-500/20 hover:border-cyan-500/50 text-xs px-2"
                    >
                      <SiTelegram className="w-4 h-4 text-cyan-400" />
                      <span>Telegram</span>
                    </Button>
                  </a>
                  <a href="https://vk.com/mp.webstudio" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="w-full gap-2 h-10 border-purple-500/20 hover:border-purple-500/50 text-xs px-2"
                    >
                      <SiVk className="w-4 h-4 text-purple-400" />
                      <span>ВКонтакте</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={openOrderModal} onOpenChange={setOpenOrderModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-order-modal">
          <DialogHeader>
            <DialogTitle>Оформить заказ</DialogTitle>
            <DialogDescription>
              Заполните форму ниже, чтобы отправить заказ. Слева указаны выбранные услуги и итоговая стоимость.
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-card/50 rounded-md border border-border">
                <h3 className="font-bold mb-3 text-sm">Состав заказа</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {projectTypes.find((p) => p.value === projectType)?.label}
                    </span>
                    <span className="font-mono">{formatPrice(basePrice)} ₽</span>
                  </div>
                  {selectedFeatures.length > 0 && (
                    <>
                      <div className="h-px bg-border" />
                      {selectedFeatures.map((featureId) => {
                        const feature = features.find((f) => f.id === featureId);
                        if (!feature || !feature.availableFor.includes(projectType)) return null;
                        return (
                          <div key={featureId} className="flex justify-between">
                            <span className="text-muted-foreground truncate mr-2">{feature.label}</span>
                            <span className="font-mono whitespace-nowrap">+{formatPrice(feature.price)} ₽</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                  <div className="h-px bg-border" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Итого:</span>
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {formatPrice(totalPrice)} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ваше имя *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Иван Иванов"
                          {...field}
                          className="bg-background/50"
                          data-testid="input-order-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+7 (999) 123-45-67"
                          {...field}
                          className="bg-background/50"
                          data-testid="input-order-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ivan@example.com"
                          {...field}
                          className="bg-background/50"
                          data-testid="input-order-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание проекта *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Расскажите о вашем проекте..."
                          rows={4}
                          {...field}
                          className="bg-background/50 resize-none"
                          data-testid="input-order-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0"
                  disabled={mutation.isPending}
                  data-testid="button-submit-order"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Отправляем...
                    </span>
                  ) : (
                    "Заказать"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
