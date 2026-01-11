import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { SiReact, SiNextdotjs, SiVuedotjs, SiTypescript, SiNodedotjs, SiPython, SiPostgresql, SiTailwindcss, SiTelegram, SiVk } from "react-icons/si";
import { Cloud, CreditCard, Server, Database, Truck, Building2, BarChart3, MapPin } from "lucide-react";
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

const programmingTech = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
];

const russianServices = [
  { name: "Яндекс Cloud", icon: Cloud, color: "#FC3F1D" },
  { name: "VK Cloud", icon: Server, color: "#0077FF" },
  { name: "ЮКасса", icon: CreditCard, color: "#00BFFF" },
  { name: "Робокасса", icon: CreditCard, color: "#F7931A" },
  { name: "Яндекс.Метрика", icon: BarChart3, color: "#FC3F1D" },
  { name: "1С", icon: Database, color: "#FFD700" },
  { name: "Битрикс24", icon: Building2, color: "#2FC7F7" },
  { name: "СДЭК", icon: Truck, color: "#00B33C" },
  { name: "DaData", icon: MapPin, color: "#FF6B35" },
  { name: "Telegram Bot", icon: SiTelegram, color: "#26A5E4" },
  { name: "VK API", icon: SiVk, color: "#0077FF" },
];

interface TechItem {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

function TechBadge({ tech }: { tech: TechItem }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm whitespace-nowrap"
      data-testid={`tech-${tech.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <tech.icon className="w-4 h-4 flex-shrink-0" style={{ color: tech.color }} />
      <span className="text-sm font-medium text-foreground">{tech.name}</span>
    </div>
  );
}

function MarqueeRow({ items, direction = "left", speed = 30, rowId }: { items: TechItem[]; direction?: "left" | "right"; speed?: number; rowId: string }) {
  const duplicatedItems = [...items, ...items, ...items];
  
  return (
    <div className={`relative overflow-hidden py-2 marquee-row-${rowId}`}>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div
        className="flex gap-4"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {duplicatedItems.map((tech, index) => (
          <TechBadge key={`${tech.name}-${index}`} tech={tech} />
        ))}
      </div>
      
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function ForceFieldEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 w-[2px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
          initial={{ 
            height: 0, 
            top: "20%",
            x: `${(i - 2.5) * 150}px`,
            opacity: 0 
          }}
          animate={{ 
            height: ["0%", "40%", "0%"],
            opacity: [0, 0.5, 0],
            top: ["20%", "30%", "40%"]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.5)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>
        {[...Array(4)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${100 + i * 300} 150 L ${200 + i * 300} 250`}
            stroke="url(#beam-grad)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, directionFactor(i) * 100]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear"
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const directionFactor = (i: number) => (i % 2 === 0 ? 1 : -1);

export function TechnologiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const line1 = "Инструменты и ";
  const line2 = "интеграции";

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>

      <ParticleBackground />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <div className="text-center mb-10">
          <SectionBadge>Технологии</SectionBadge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-4 tracking-tight flex flex-row items-center justify-center gap-2 whitespace-nowrap">
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
            className="text-muted-foreground text-base max-w-xl mx-auto"
          >
            Объединяем мощь современной разработки с популярными сервисами оплаты, логистики и облачными вычислениями для комплексной автоматизации.
          </motion.p>
        </div>

        <div className="relative">
          <ForceFieldEffect />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 relative z-10"
          >
            <MarqueeRow items={programmingTech} direction="left" speed={25} rowId="tech" />
            <MarqueeRow items={russianServices} direction="right" speed={35} rowId="services" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
