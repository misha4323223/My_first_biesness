import { motion } from "framer-motion";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "./ParticleBackground";
import dataFlowVideo from "@assets/generated_videos/minimalist_abstract_data_flow_video_loop.mp4";

interface FlyingLetterProps {
  letter: string;
  index: number;
  totalLetters: number;
  isGradient?: boolean;
}

function FlyingLetter({ letter, index, totalLetters, isGradient }: FlyingLetterProps) {
  const isAndroid = useMemo(() => {
    return /Android/i.test(navigator.userAgent);
  }, []);

  const startPosition = useMemo(() => {
    if (isAndroid) {
      // Анимация "изнутри" для Android: зум и появление
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.1,
      };
    }
    const angle = (index / totalLetters) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 300 + Math.random() * 400;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 200,
      rotate: (Math.random() - 0.5) * 360,
      scale: 0.3 + Math.random() * 0.3,
    };
  }, [index, totalLetters, isAndroid]);

  const delay = 0.3 + index * 0.03;

  if (letter === " ") {
    return <span className="inline-block w-[0.3em]">&nbsp;</span>;
  }

  if (isAndroid) {
    return (
      <span
        className={`inline-block ${isGradient ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]" : ""}`}
      >
        {letter}
      </span>
    );
  }

  return (
    <motion.span
      className={`inline-block ${isGradient ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]" : ""}`}
      initial={{
        x: startPosition.x,
        y: startPosition.y,
        rotate: startPosition.rotate,
        scale: startPosition.scale,
        opacity: 0,
        filter: isAndroid ? "blur(4px)" : "blur(8px)",
      }}
      animate={{
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      }}
      transition={isAndroid ? {
        duration: 0.5,
        delay: delay,
        ease: "easeOut",
      } : {
        duration: 0.8,
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 12,
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
}

function AnimatedText({ text, startIndex, isGradient }: AnimatedTextProps) {
  const words = text.split(" ");
  let letterIndex = startIndex;
  const totalLetters = text.length + startIndex;

  return (
    <>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((letter, letterIdx) => {
            const currentIndex = letterIndex;
            letterIndex++;
            return (
              <FlyingLetter
                key={`${wordIdx}-${letterIdx}`}
                letter={letter}
                index={currentIndex}
                totalLetters={totalLetters + 15}
                isGradient={isGradient}
              />
            );
          })}
          {wordIdx < words.length - 1 && (
            <span className="inline-block w-[0.3em]">&nbsp;</span>
          )}
        </span>
      ))}
    </>
  );
}

function GlowPulse() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl" />
    </motion.div>
  );
}

function GlassBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative inline-flex items-center justify-center px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden group shadow-[0_0_20px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-shadow duration-500"
    >
      {/* Сканирующая полоска света */}
      <motion.div
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12"
        animate={{
          left: ["-150%", "150%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
      />
      
      {/* Внутреннее свечение краев */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <span className="relative z-10 text-xs md:text-sm font-medium tracking-[0.2em] uppercase bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
        Веб-студия нового поколения
      </span>
    </motion.div>
  );
}

export function HeroSection() {
  const scrollToPortfolio = () => {
    const element = document.querySelector("#portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const line1 = "Это не реклама про нас.";
  const line2 = "Это витрина для вас.";

  return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] pt-12 md:pt-32 pb-24 md:pb-0">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src={dataFlowVideo}
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            const buffer = 1.0; // увеличим буфер для более плавного перехода
            if (video.duration - video.currentTime < buffer) {
              const progress = (video.duration - video.currentTime) / buffer;
              video.style.opacity = String(0.4 * progress);
              video.style.filter = `brightness(${0.8 * progress}) contrast(${1.2})`;
            } else if (video.currentTime < buffer) {
              const progress = video.currentTime / buffer;
              video.style.opacity = String(0.4 * progress);
              video.style.filter = `brightness(${0.8 * progress}) contrast(${1.2})`;
            } else {
              video.style.opacity = "0.4";
              video.style.filter = "brightness(0.8) contrast(1.2)";
            }
          }}
          className="w-full h-full object-cover opacity-40 mix-blend-screen brightness-[0.8] contrast-[1.2] transition-[opacity,filter] duration-1000 ease-in-out"
        />
        {/* Monolithic Overlays */}
        <div className="absolute inset-0 bg-[#0a0a0a]/40" />
        <div className="absolute inset-0 bg-[#0a0a0a]/10" />
        
        {/* Bottom Fade Overlay to hide video edges and particles cutting off */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent z-[1]" />
      </div>

      <div className="absolute inset-0 z-1">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)]" />
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-10">
          <GlassBadge />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-none mb-8 relative overflow-hidden uppercase">
          <GlowPulse />
          <span className="text-stone-400 block px-2 font-mono text-sm md:text-base tracking-[0.3em] opacity-80 mb-4">
            <AnimatedText text={line1} startIndex={0} />
          </span>
          <span className="block px-2 font-black tracking-tighter text-white bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            <AnimatedText text={line2} startIndex={line1.length} isGradient />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 px-4"
        >
          Каждый сайт создаётся с нуля — под ваш бизнес, под вашу аудиторию, под ваши цели.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 px-6"
        >
          <a href="/order" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto min-h-[3rem]"
              data-testid="button-hero-cta"
            >
              Заказать сайт
            </Button>
          </a>
          <Button
            variant="outline"
            onClick={scrollToPortfolio}
            className="w-full sm:w-auto min-h-[3rem]"
            data-testid="button-hero-portfolio"
          >
            Смотреть работы
          </Button>
        </motion.div>
      </div>


      <div className="absolute top-1/4 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
    </section>
  );
}
