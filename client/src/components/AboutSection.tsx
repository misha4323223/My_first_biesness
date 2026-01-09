import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ParticleBackground } from "./ParticleBackground";
import { SectionBadge } from "./SectionBadge";
import { Card } from "@/components/ui/card";
import { Code2, Rocket, Target, Zap, Layout, ShieldCheck } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isFlipped, setIsFlipped] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-16 md:py-32 relative overflow-hidden bg-[#0a0a0a]">
      {/* Top Fade for smooth transition from Hero */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent z-[1] pointer-events-none" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>
      
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <SectionBadge>О студии</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 tracking-tight">
            Мы создаём <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">цифровые решения</span>
          </h2>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
        >
          {/* Main Content Box - Flip Card */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-8 md:row-span-1 h-[300px] md:h-auto group/flip relative"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-in-out"
              style={{ 
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
              }}
              onMouseEnter={() => setIsFlipped(true)}
              onMouseLeave={() => setIsFlipped(false)}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front Side */}
              <Card className="absolute inset-0 p-8 md:p-10 bg-white/5 border-white/10 backdrop-blur-md backface-hidden rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-center overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-cyan-400">Наш подход</h3>
                  <p className="text-muted-foreground text-base md:text-xl leading-relaxed max-w-2xl">
                    MP.WebStudio — это сочетание современных технологий и внимания к деталям. 
                    Мы не предлагаем шаблонные решения — каждый проект разрабатывается индивидуально 
                    под ваш бизнес и цели.
                  </p>
                  <div className="mt-6 text-xs text-cyan-400/50 uppercase tracking-widest md:hidden font-medium">
                    Нажмите, чтобы узнать больше
                  </div>
                </div>
              </Card>

              {/* Back Side */}
              <Card 
                className="absolute inset-0 p-8 md:p-10 bg-white/5 border-cyan-400/20 backdrop-blur-md backface-hidden rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-center bg-gradient-to-br from-[#0a0a0a] to-cyan-950/20"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="relative z-10 grid grid-cols-1 gap-4 md:gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-cyan-400/10 shrink-0">
                      <Zap className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 text-sm md:text-base">Мгновенная скорость</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Чистый код без лишних библиотек конструкторов. Максимальный балл в Google Speed.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-cyan-400/10 shrink-0">
                      <Layout className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 text-sm md:text-base">Полная свобода</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Любой дизайн и анимация. Мы не ограничены рамками и блоками платформ.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-cyan-400/10 shrink-0">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 text-sm md:text-base">Безопасность</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Полный контроль над кодом. Независимость от тарифов и обновлений конструкторов.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Stats Box 1 - Rounded Pill-like */}
          <motion.div variants={itemVariants} className="md:col-span-4 h-[200px] md:h-auto">
            <Card className="h-full p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-md hover-elevate flex flex-col items-center justify-center text-center group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="p-4 rounded-full bg-cyan-500/10 mb-4 group-hover:scale-110 transition-transform duration-500 inline-block">
                  <Code2 className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">100%</div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">Чистая разработка</div>
              </div>
            </Card>
          </motion.div>

          {/* Stats Box 2 - Rounded Different Radius */}
          <motion.div variants={itemVariants} className="md:col-span-4 h-[200px] md:h-auto">
            <Card className="h-full p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-md hover-elevate flex flex-col items-center justify-center text-center group relative overflow-hidden rounded-tr-[4rem] rounded-bl-[4rem] md:rounded-tr-[5rem] md:rounded-bl-[5rem] rounded-tl-2xl rounded-br-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="p-4 rounded-2xl bg-purple-500/10 mb-4 group-hover:rotate-12 transition-transform duration-500 inline-block">
                  <Rocket className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Десятки</div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">Отраслевых решений</div>
              </div>
            </Card>
          </motion.div>

          {/* Second Main Content Box - Rounded Medium */}
          <motion.div variants={itemVariants} className="md:col-span-8">
            <Card className="h-full p-8 md:p-10 bg-white/5 border-white/10 backdrop-blur-md hover-elevate transition-all duration-500 group relative overflow-hidden rounded-[2rem]">
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col h-full justify-center">
                <div className="flex items-center gap-4 md:gap-5 mb-6">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 group-hover:rotate-12 transition-transform duration-500">
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight">Ваша цель — наш приоритет</h3>
                </div>
                <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-2xl">
                  Мы используем стек React + Node.js, что позволяет создавать сверхбыстрые 
                  сайты и веб-интерфейсы, которые легко масштабировать. Ваша аудитория получит 
                  лучший пользовательский опыт.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
