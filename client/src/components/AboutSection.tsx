import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useMemo } from "react";
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

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const line1 = "Мы создаём ";
  const line2 = "цифровые решения";
  const line3 = " для вашего бизнеса";

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden bg-[#0a0a0a]">
      {/* Top Fade for smooth transition from Hero */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent z-[1] pointer-events-none" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>
      
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div ref={ref} className="max-w-3xl mx-auto text-center">
          <SectionBadge>О студии</SectionBadge>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            <AnimatedText text={line1} startIndex={0} isInView={isInView} />
            <AnimatedText text={line2} startIndex={line1.length} isGradient isInView={isInView} />
            <AnimatedText text={line3} startIndex={line1.length + line2.length} isInView={isInView} />
          </h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              MP.WebStudio — это сочетание современных технологий и внимания к деталям. 
              Мы используем актуальные инструменты разработки, чтобы создавать сайты быстрее и качественнее.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Каждый проект начинается с понимания вашей задачи. Мы не предлагаем шаблонные решения — 
              мы разрабатываем продукт под ваш бизнес, вашу аудиторию и ваши цели.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
