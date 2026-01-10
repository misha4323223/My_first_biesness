import { motion, useInView } from "framer-motion";
import { useRef, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Globe, ShoppingCart, Gauge, Palette, Code, FileText, Rocket, Zap, Layout, ShieldCheck } from "lucide-react";
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

const services = [
  {
    icon: FileText,
    title: "Сайт-визитка",
    description: "Компактный одностраничный сайт для представления компании или специалиста.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Rocket,
    title: "Лендинг",
    description: "Одностраничный продающий сайт с фокусом на конверсию и результат.",
    color: "from-green-500 to-cyan-500",
  },
  {
    icon: Globe,
    title: "Корпоративные сайты",
    description: "Сайты, которые формируют доверие к бренду и привлекают клиентов.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ShoppingCart,
    title: "Интернет-магазины",
    description: "E-commerce с каталогом, корзиной и оплатой онлайн.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Palette,
    title: "UI/UX Дизайн",
    description: "Интуитивные и красивые интерфейсы для ваших продуктов.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Gauge,
    title: "Оптимизация",
    description: "Ускорение, SEO и повышение конверсии сайтов.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Техподдержка",
    description: "Обновления, развитие и бесперебойная работа проектов.",
    color: "from-indigo-500 to-purple-500",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [flippedIndexes, setFlippedIndexes] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const line1 = "Купить сайт ";
  const line2 = "под ключ";

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden bg-[#0a0a0a]">
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

      <div className="absolute top-1/4 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <div className="text-center mb-12 px-4">
          <SectionBadge>Услуги</SectionBadge>
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
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            Полный спектр услуг для создания и развития вашего присутствия в интернете
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6">
          {services.map((service, index) => {
            let gridClasses = "";
            if (index === 0) gridClasses = "col-span-2 md:col-span-8";
            else if (index === 1) gridClasses = "col-span-1 md:col-span-4";
            else if (index === 2) gridClasses = "col-span-1 md:col-span-4";
            else if (index === 3) gridClasses = "col-span-2 md:col-span-8";
            else if (index === 4) gridClasses = "col-span-1 md:col-span-4";
            else if (index === 5) gridClasses = "col-span-1 md:col-span-4";
            else if (index === 6) gridClasses = "col-span-2 md:col-span-4";
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className={`${gridClasses} group/flip relative h-[180px] md:h-[280px]`}
                style={{ perspective: "1200px" }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ 
                    transformStyle: "preserve-3d",
                    transform: flippedIndexes[index] ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                  onMouseEnter={() => toggleFlip(index)}
                  onMouseLeave={() => toggleFlip(index)}
                  onClick={() => toggleFlip(index)}
                >
                  {/* Front Side */}
                  <Card className="absolute inset-0 p-4 md:p-8 bg-white/5 border-white/10 backdrop-blur-md backface-hidden rounded-[1.2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center text-center overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover/flip:opacity-[0.05] transition-opacity duration-500`} />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`relative w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-gradient-to-br ${service.color} opacity-90 flex items-center justify-center shadow-lg shadow-black/20 group-hover/flip:scale-110 transition-transform duration-500 mb-3 md:mb-6`}>
                        <service.icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-sm md:text-2xl font-bold text-foreground/95 group-hover/flip:text-white transition-colors leading-tight">
                        {service.title}
                      </h3>
                      <div className="mt-3 text-[8px] md:text-[10px] text-cyan-400/50 uppercase tracking-widest md:hidden font-medium">
                        Нажмите для описания
                      </div>
                    </div>
                  </Card>

                  {/* Back Side */}
                  <Card 
                    className="absolute inset-0 p-4 md:p-8 bg-white/5 border-cyan-400/20 backdrop-blur-md backface-hidden rounded-[1.2rem] md:rounded-[2.5rem] flex flex-col justify-center bg-gradient-to-br from-[#0a0a0a] to-cyan-950/20 overflow-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="relative z-10 text-center md:text-left">
                      <h4 className="text-[10px] md:text-sm font-semibold mb-2 uppercase tracking-wider text-cyan-400">
                        {service.title}
                      </h4>
                      <p className="text-[10px] md:text-lg text-muted-foreground leading-snug md:leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
