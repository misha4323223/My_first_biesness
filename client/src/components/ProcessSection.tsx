import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { MessageSquare, PenTool, Code, Rocket } from "lucide-react";
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

const steps = [
  {
    number: "01",
    title: "Обсуждение",
    description: "Изучаем ваш бизнес, цели и задачи. Определяем функционал и составляем ТЗ.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Дизайн",
    description: "Создаём рабочую версию и отправляем превью. Вносим правки до согласования.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Интеграции",
    description: "Подключаем оплату, доставку, аналитику. Проводим тестирование.",
    icon: Code,
  },
  {
    number: "04",
    title: "Запуск",
    description: "Разворачиваем на сервере, настраиваем домен и передаём продукт.",
    icon: Rocket,
  },
];

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const line1 = "Как мы ";
  const line2 = "работаем";

  return (
    <section id="process" className="py-16 md:py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>
      
      <ParticleBackground />

      {/* Grid pattern like HeroSection */}
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

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />

      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        <div className="text-center mb-12">
          <SectionBadge>Процесс</SectionBadge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-4 tracking-tight flex flex-row items-center justify-center gap-2 whitespace-nowrap scanline-header">
            <span className="neural-interface py-1">
              <AnimatedText text={line1} startIndex={0} isInView={isInView} />
            </span>
            <span className="neural-interface font-bold py-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              <AnimatedText text={line2} startIndex={line1.length} isGradient isInView={isInView} />
            </span>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical Stream Line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 * index,
                  ease: [0.21, 1.02, 0.47, 0.98] // Smooth "injection" easing
                }}
                className="relative pl-12 md:pl-20 group/step"
              >
                {/* Stream "Data Packet" Indicator */}
                <div className="absolute left-[-4px] md:left-[-4px] top-6 w-[9px] h-[9px] rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 group-hover/step:scale-150 transition-transform duration-500" />
                
                {/* Animated pulse for the stream line */}
                <div className="absolute left-4 md:left-6 top-6 w-12 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent opacity-50" />

                <div className="flex flex-row gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl group-hover/step:border-cyan-500/50 group-hover/step:bg-cyan-500/5 transition-all duration-500 shrink-0">
                    <step.icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 group-hover/step:scale-110 group-hover/step:text-white transition-all duration-500" />
                  </div>
                  
                  <div className="flex-1 pt-1 md:pt-4">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl md:text-3xl font-bold text-foreground/90 group-hover/step:text-white transition-colors tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-2xl text-sm leading-relaxed bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 bg-clip-text text-transparent font-medium md:text-lg group-hover/step:opacity-90">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Motion blur highlight on hover */}
                <div className="absolute -inset-y-4 -inset-x-8 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover/step:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
