import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { useLocation } from "wouter";
import { ParticleBackground } from "./ParticleBackground";
import { useIsMobile } from "@/hooks/use-mobile";

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

import sweetDelightsImg from "@assets/image_1765623150824.webp";
import socksHeroImg from "@assets/generated_images/classic_socks_gift_box.webp";
import travelHeroImg from "@assets/generated_images/tropical_beach_travel_destination.webp";
import barberHeroImg from "@assets/generated_images/stylish_barbershop_interior.webp";
import foodHeroImg from "@assets/generated_images/asian_food_arrangement_table.webp";
import fitnessHeroImg from "@assets/generated_images/modern_gym_interior_purple.webp";
import cosmeticsHeroImg from "@assets/stock_images/cosmetics_skincare_p_2775c0e7.webp";
import streetwearHeroImg from "@assets/generated_images/streetwear_hero_banner_dark.webp";
import dentalHeroImg from "@assets/generated_images/dental_clinic_modern_reception.webp";
import renovationHeroImg from "@assets/generated_images/modern_living_room_renovation.webp";
import mpWebstudioImg from "@assets/generated_images/web_studio_portfolio_showcase.webp";
import photographerHeroImg from "@assets/generated_images/photographer_workspace_studio_aesthetic.webp";
import autoServiceHeroImg from "@assets/generated_images/modern_auto_service_garage_workshop_interior.webp";
import realEstateHeroImg from "@assets/generated_images/modern_luxury_real_estate_agency_office.webp";
import beautySalonHeroImg from "@assets/generated_images/modern_luxury_beauty_salon_interior.webp";
import onlineAcademyHeroImg from "@assets/generated_images/online_course_platform_hero_image.png";

interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  externalUrl?: string;
  badgeType: "concept" | "live";
  category: string;
  featured?: boolean;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 2,
    title: "Вкусдом",
    subtitle: "Доставка еды",
    description: "Концепт лендинга для доставки азиатской еды. Яркий дизайн, анимированное меню, корзина заказа.",
    tags: ["React", "Framer Motion", "Tailwind"],
    image: foodHeroImg,
    demoUrl: "/demo/food-delivery",
    badgeType: "concept",
    category: "Food",
  },
  {
    id: 3,
    title: "Фитнес клуб",
    subtitle: "Фитнес-студия",
    description: "Концепт сайта фитнес-студии. Тёмный стиль, расписание тренировок, тарифные планы.",
    tags: ["React", "Framer Motion", "Dark Theme"],
    image: fitnessHeroImg,
    demoUrl: "/demo/fitness",
    badgeType: "concept" as const,
    category: "Dark Theme",
  },
  {
    id: 4,
    title: "Natura",
    subtitle: "Интернет-магазин косметики",
    description: "Концепт интернет-магазина косметики. Минималистичный дизайн, каталог товаров, избранное и корзина.",
    tags: ["React", "E-commerce", "Minimalist"],
    image: cosmeticsHeroImg,
    demoUrl: "/demo/cosmetics",
    badgeType: "concept" as const,
    category: "E-commerce",
  },
  {
    id: 5,
    title: "Streetwear",
    subtitle: "Интернет-магазин одежды",
    description: "Концепт магазина российского стритвира. Тёмная тема, категории, бренды, корзина.",
    tags: ["React", "E-commerce", "Dark Theme"],
    image: streetwearHeroImg,
    demoUrl: "/demo/streetwear",
    badgeType: "concept" as const,
    category: "E-commerce",
  },
  {
    id: 6,
    title: "Sockstyle",
    subtitle: "Интернет-магазин носков",
    description: "Концепт магазина стильных мужских носков. Подарочные наборы, носки с надписями, спортивные.",
    tags: ["React", "E-commerce", "Light Theme"],
    image: socksHeroImg,
    demoUrl: "/demo/socks",
    badgeType: "concept" as const,
    category: "E-commerce",
  },
  {
    id: 7,
    title: "Дримтур",
    subtitle: "Туристическое агентство",
    description: "Концепт сайта туристического агентства. Популярные направления, горячие туры, бронирование.",
    tags: ["React", "Travel", "Booking"],
    image: travelHeroImg,
    demoUrl: "/demo/travel",
    badgeType: "concept" as const,
    category: "Booking",
  },
  {
    id: 8,
    title: "Barbershop",
    subtitle: "Барбершоп",
    description: "Концепт сайта барбершопа. Услуги, мастера, онлайн-запись, галерея работ.",
    tags: ["React", "Booking", "Dark Theme"],
    image: barberHeroImg,
    demoUrl: "/demo/barber",
    badgeType: "concept" as const,
    category: "Booking",
  },
  {
    id: 9,
    title: "Дентапро",
    subtitle: "Стоматологическая клиника",
    description: "Концепт сайта стоматологической клиники. Услуги, врачи, онлайн-запись, акции.",
    tags: ["React", "Medical", "Light Theme"],
    image: dentalHeroImg,
    demoUrl: "/demo/dental",
    badgeType: "concept" as const,
    category: "Medical",
  },
  {
    id: 10,
    title: "Ремонтмастер",
    subtitle: "Ремонт квартир",
    description: "Концепт сайта ремонта квартир. Портфолио работ, калькулятор стоимости, этапы работ.",
    tags: ["React", "Services", "Calculator"],
    image: renovationHeroImg,
    demoUrl: "/demo/renovation",
    badgeType: "concept" as const,
    category: "Services",
  },
  {
    id: 11,
    title: "Андрей Соколов",
    subtitle: "Сайт-визитка фотографа",
    description: "Концепт сайта-визитки фотографа. Минималистичный дизайн, портфолио, услуги, контакты.",
    tags: ["React", "Minimalist", "Portfolio"],
    image: photographerHeroImg,
    demoUrl: "/demo/photographer",
    badgeType: "concept" as const,
    category: "Portfolio",
  },
  {
    id: 12,
    title: "ТехноПро Сервис",
    subtitle: "Автосервис",
    description: "Концепт сайта автосервиса. Услуги, запись на обслуживание, прайс-лист, команда мастеров, отзывы клиентов.",
    tags: ["React", "Booking", "Services", "Dark Theme"],
    image: autoServiceHeroImg,
    demoUrl: "/demo/auto-service",
    badgeType: "concept" as const,
    category: "Services",
    featured: false,
  },
  {
    id: 13,
    title: "ЛюксПро",
    subtitle: "Агентство недвижимости",
    description: "Концепт сайта агенства недвижимости. Каталог объектов, профили агентов, система бронирования просмотров, портфолио сделок.",
    tags: ["React", "Real Estate", "Booking", "Premium"],
    image: realEstateHeroImg,
    demoUrl: "/demo/real-estate",
    badgeType: "concept" as const,
    category: "Services",
    featured: false,
  },
  {
    id: 14,
    title: "Лумина",
    subtitle: "Салон красоты",
    description: "Концепт сайта премиум салона красоты. Услуги (стрижка, окрашивание, маникюр), профили стилистов, онлайн-запись, галерея работ.",
    tags: ["React", "Booking", "Beauty", "Light Theme"],
    image: beautySalonHeroImg,
    demoUrl: "/demo/beauty-salon",
    badgeType: "concept" as const,
    category: "Beauty",
    featured: false,
  },
  {
    id: 15,
    title: "ОнлайнОкадемия",
    subtitle: "Платформа онлайн-курсов",
    description: "Концепт платформы для онлайн-обучения. Каталог курсов, профили инструкторов, система рейтинга, запись на курсы, сертификаты.",
    tags: ["React", "Education", "E-learning", "Course Platform"],
    image: onlineAcademyHeroImg,
    demoUrl: "/demo/online-academy",
    badgeType: "concept" as const,
    category: "Education",
    featured: false,
  },
];

// Позиции звёзд в созвездии (в процентах)
const starPositions = [
  { x: 50, y: 5 },    // 0 - MP.WebStudio - главная звезда (центр самый верх)
  { x: 43, y: 18 },   // 1 - центр верх
  { x: 5, y: 12 },   // 2 - Вкусдом (Доставка еды)
  { x: 70, y: 12 },   // 3 - правый верх
  { x: 9, y: 28 },   // 4 - Natura (Интернет-магазин косметики)
  { x: 67, y: 28 },   // 5 - правый центр
  { x: 7, y: 44 },   // 6 - левый низ
  { x: 38, y: 40 },   // 7 - центр
  { x: 77, y: 44 },   // 8 - правый
  { x: 10, y: 60 },   // 9 - левый низ
  { x: 60, y: 60 },   // 10 - Ремонтмастер (Ремонт квартир)
  { x: 45, y: 92 },   // 11 - центр низ (Фотограф)
  { x: 25, y: 76 },   // 12 - ТехноПро Сервис (автосервис)
  { x: 56, y: 76 },   // 13 - ЛюксПро (агенство недвижимости)
  { x: 43, y: 28 },   // 14 - Лумина (салон красоты)
  { x: 43, y: 68 },   // 15 - ОнлайнОкадемия (платформа курсов)
];

const mobileStarPositions = [
  { x: 15, y: 5 },    // 0
  { x: 57, y: 8 },    // 1 - фитнес студия
  { x: 10, y: 18 },   // 2 - Вкусдом (Доставка еды)
  { x: 66, y: 18 },   // 3 - Streetwear (Интернет-магазин одежды)
  { x: 20, y: 32 },   // 4 - socks (Интернет-магазин носков)
  { x: 60, y: 35 },   // 5 - Туристическое агентство
  { x: 15, y: 48 },   // 6
  { x: 40, y: 42 },   // 7 - Стоматологическая клиника
  { x: 65, y: 50 },   // 8 - Ремонт квартир
  { x: 32, y: 58 },   // 9 - Сайт-визитка фотографа
  { x: 61, y: 62 },   // 10 - Автосервис
  { x: 25, y: 85 },   // 11 - Агентство недвижимости
  { x: 15, y: 71 },   // 12 - Салон красоты
  { x: 45, y: 76 },   // 13 - Платформа онлайн-курсов
  { x: 40, y: 28 },   // 14
  { x: 60, y: 45 },   // 15
];

// Связи между проектами по категориям
const connections: [number, number][] = [
  [2, 3], 
  [2, 4], [2, 5], [2, 6], // E-commerce/Food связи (Вкусдом -> Natura, Streetwear, Sockstyle)
  [4, 5], [4, 6], [5, 6],
  [3, 5], [3, 8], // Dark Theme связи (Фитнес клуб, Streetwear, Barbershop)
  [7, 8], // Booking связи (Дримтур, Barbershop)
  [9, 11], [10, 11], // Фотограф связи с соседними
  [8, 12], [10, 12], // Автосервис связи (Services - Barbershop, Ремонтмастер)
  [12, 13], [11, 13], // ЛюксПро связи (рядом с Автосервисом и Фотографом)
  [8, 14], [11, 14], // Лумина (салон красоты) связи - Booking сервисы
  [15, 3], [15, 12], // ОнлайнОкадемия связи (с сервисами и образованием)
];

function Nebulae() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          left: "10%",
          top: "20%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          right: "5%",
          top: "40%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
        }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          left: "40%",
          bottom: "10%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function ShootingStars() {
  const isMobile = useIsMobile();
  const shootingStarsCount = isMobile ? 1 : 3;
  
  const shootingStars = useMemo(() => 
    Array.from({ length: shootingStarsCount }, (_, i) => ({
      id: i,
      startX: 10 + Math.random() * 30,
      startY: 5 + Math.random() * 20,
      duration: 2 + Math.random() * 2,
      delay: i * 4 + Math.random() * 3,
    })), [shootingStarsCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, 300],
            y: [0, 200],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: isMobile ? 15 : 8,
            ease: "easeOut",
          }}
        >
          <div 
            className="w-1 h-1 bg-white rounded-full"
            style={{
              boxShadow: "0 0 6px #fff, -20px 0 15px rgba(255,255,255,0.5), -40px 0 10px rgba(255,255,255,0.3), -60px 0 5px rgba(255,255,255,0.1)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function StarParticles() {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 20 : 60;
  
  const particles = useMemo(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })), [particleCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={isMobile ? {
            opacity: [0.3, 0.6, 0.3],
          } : {
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ConstellationLines({ hoveredId }: { hoveredId: number | null }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.15)" />
          <stop offset="50%" stopColor="rgba(168, 85, 247, 0.3)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.15)" />
        </linearGradient>
        <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
          <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.4)" />
        </linearGradient>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
        </linearGradient>
      </defs>
      {connections.map(([from, to], index) => {
        const isActive = hoveredId !== null && (from === hoveredId || to === hoveredId);
        const positions = useIsMobile() ? mobileStarPositions : starPositions;
        return (
          <g key={index}>
            <motion.line
              x1={`${positions[from].x}%`}
              y1={`${positions[from].y}%`}
              x2={`${positions[to].x}%`}
              y2={`${positions[to].y}%`}
              stroke={isActive ? "url(#lineGradientActive)" : "url(#lineGradient)"}
              strokeWidth={isActive ? 1.5 : 0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 1.5, delay: index * 0.05 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function StarNode({ 
  item, 
  position, 
  index,
  isHovered,
  onHover,
  onClick,
}: { 
  item: typeof portfolioItems[0];
  position: { x: number; y: number };
  index: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  onClick: () => void;
}) {
  const isMobile = useIsMobile();
  const starSize = item.badgeType === "live" ? 6 : 4;
  const glowColor = item.badgeType === "live" ? "rgba(34, 197, 94, 0.4)" : "rgba(168, 85, 247, 0.4)";
  const coreColor = item.badgeType === "live" ? "#4ade80" : "#c084fc";
  
  return (
    <motion.div
      className="absolute flex items-center justify-center p-8 -m-8 group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isHovered ? 50 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && onHover(index)}
      onMouseLeave={() => !isMobile && onHover(null)}
      onClick={onClick}
      data-testid={`star-${item.id}`}
    >
      {/* Диффузное свечение (небула вокруг звезды) */}
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{
          width: starSize * 15,
          height: starSize * 15,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
        animate={isMobile ? {
          opacity: [0.4, 0.5, 0.4],
        } : {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Острое свечение (лучи) - скрываем на мобильных */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute w-[2px] h-full bg-white/40 blur-[1px]"
            style={{
              left: "50%",
              top: "50%",
              height: starSize * 6,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute h-[2px] w-full bg-white/40 blur-[1px]"
            style={{
              left: "50%",
              top: "50%",
              width: starSize * 6,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {/* Ядро звезды - многослойное */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={isMobile ? {} : {
          scale: isHovered ? 1.4 : 1,
        }}
      >
        {/* Внешнее мерцающее ядро */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: starSize * 2,
            height: starSize * 2,
            background: coreColor,
            filter: "blur(2px)",
          }}
          animate={isMobile ? {} : {
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Центральная точка */}
        <div
          className="relative rounded-full bg-white"
          style={{
            width: starSize,
            height: starSize,
            boxShadow: isMobile ? `0 0 ${starSize}px white` : `0 0 ${starSize * 2}px white`,
          }}
        />
      </motion.div>

      {/* Подпись под звездой */}
      <motion.div 
        className="absolute whitespace-nowrap pointer-events-none text-center px-2"
        style={{
          top: starSize * 2 + (isMobile ? 12 : 15),
          left: "50%",
          transform: "translateX(-50%)",
        }}
        animate={{
          opacity: isHovered || isMobile ? 1 : 0.4,
          y: isHovered ? 5 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[7px] sm:text-[10px] md:text-[12px] text-white font-light tracking-[0.05em] sm:tracking-[0.15em] uppercase transition-all duration-300 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] max-w-[80px] sm:max-w-none break-words">
          {item.subtitle}
        </p>
        <motion.div 
          className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mt-1 mx-auto"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : (isMobile ? "40%" : "0%") }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Превью при наведении */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute pointer-events-none"
            style={{ 
              top: position.y > 70 ? "auto" : starSize + 15,
              bottom: position.y > 70 ? starSize + 15 : "auto",
              right: position.x >= 50 ? 0 : "auto",
              left: position.x < 50 ? 0 : "auto",
              zIndex: 100,
            }}
            initial={{ opacity: 0, y: position.y > 70 ? 10 : -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position.y > 70 ? 10 : -10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="relative w-44 rounded-lg overflow-hidden shadow-2xl border border-white/20 bg-black/50 backdrop-blur-sm">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-24 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-[10px] text-white/70">{item.subtitle}</p>
                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
              </div>
              {item.badgeType === "live" && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectCard({ 
  item, 
  onClose,
  onNavigate,
}: { 
  item: PortfolioItem;
  onClose: () => void;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <motion.div
        layoutId={`star-${item.id}`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg overflow-hidden shadow-2xl"
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-0.5 leading-tight">
              {item.title}
            </h2>
            <p className="text-primary font-mono text-[10px] tracking-wider uppercase">
              {item.subtitle}
            </p>
          </div>
        </div>
        
        <div className="p-5 md:p-6">
          <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
            {item.description}
          </p>
          
          <div className="mb-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-primary font-semibold block mb-1 uppercase tracking-wider">Обзор демо-версии</span>
              Данный сайт представлен в качестве примера реализации. Мы специализируемся на разработке масштабируемых систем. Нужен более сложный функционал (оплата, аналитика, боты)? Мы внедрим это в кратчайшие сроки.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 h-10 text-sm font-semibold shadow-lg shadow-cyan-500/20"
              onClick={onNavigate}
            >
              {item.externalUrl ? "Перейти на сайт" : "Запустить демо"} 
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/5 h-10 text-sm"
              onClick={onClose}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [, setLocation] = useLocation();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);

  const handleItemClick = (item: typeof portfolioItems[0]) => {
    setSelectedItem(item);
  };

  const handleNavigate = () => {
    if (selectedItem) {
      if (selectedItem.externalUrl) {
        window.open(selectedItem.externalUrl, "_blank", "noopener,noreferrer");
      } else if (selectedItem.demoUrl) {
        setLocation(selectedItem.demoUrl);
      }
      setSelectedItem(null);
    }
  };

  const line1 = "Галактика ";
  const line2 = "наших проектов и концепций";

  const isMobile = useIsMobile();
  const currentPositions = isMobile ? mobileStarPositions : starPositions;

  return (
    <section id="portfolio" className="relative overflow-hidden bg-[#0a0a0a]" style={{ height: isMobile ? "auto" : "100vh", minHeight: isMobile ? "750px" : "800px" }}>
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

      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />

      <div className="relative z-10 h-full flex flex-col pt-12" ref={ref}>
        <div className="text-center mb-8 max-w-7xl mx-auto px-6">
          <SectionBadge>Портфолио</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <AnimatedText text={line1} startIndex={0} isInView={isInView} />
            <AnimatedText text={line2} startIndex={line1.length} isGradient isInView={isInView} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            В нашей веб-студии вы можете заказать сайт под ключ или купить готовое решение. 
            Каждая звезда — это демо концепция: от интернет-магазинов и лендингов до сложных корпоративных систем. 
            Мы создаем сайты с нуля, чтобы они работали на ваш бизнес.
          </motion.p>
        </div>

        {/* Созвездие */}
        <div 
          className="relative w-full overflow-hidden flex-1 bg-transparent min-h-[550px] md:min-h-0 pb-6"
        >
          <Nebulae />
          <StarParticles />
          <ShootingStars />
          <ConstellationLines hoveredId={hoveredId} />
          
          {portfolioItems.map((item, index) => (
            <StarNode
              key={item.id}
              item={item}
              position={currentPositions[index]}
              index={index}
              isHovered={hoveredId === index}
              onHover={setHoveredId}
              onClick={() => handleItemClick(item)}
            />
          ))}

        </div>
      </div>

      {/* Модальное окно проекта */}
      <AnimatePresence>
        {selectedItem && (
          <ProjectCard
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
