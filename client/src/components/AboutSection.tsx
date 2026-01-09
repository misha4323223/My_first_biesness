import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ParticleBackground } from "./ParticleBackground";
import { SectionBadge } from "./SectionBadge";
import { Card } from "@/components/ui/card";
import { Code2, Rocket, Users, Target } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <section id="about" className="py-20 md:py-32 relative overflow-hidden bg-[#0a0a0a]">
      {/* Top Fade for smooth transition from Hero */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent z-[1] pointer-events-none" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>
      
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-2"
        >
          {/* Main Content Box */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
            <Card className="h-full p-8 bg-white/5 border-white/10 backdrop-blur-sm hover-elevate transition-all duration-300">
              <div className="flex flex-col h-full justify-center">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Наш подход</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  MP.WebStudio — это сочетание современных технологий и внимания к деталям. 
                  Мы не предлагаем шаблонные решения — каждый проект разрабатывается индивидуально 
                  под ваш бизнес и цели.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Stats Box 1 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full p-8 bg-white/5 border-white/10 backdrop-blur-sm hover-elevate flex flex-col items-center justify-center text-center group">
              <div className="p-3 rounded-2xl bg-cyan-500/10 mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <Code2 className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">Кастомный код</div>
            </Card>
          </motion.div>

          {/* Stats Box 2 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full p-8 bg-white/5 border-white/10 backdrop-blur-sm hover-elevate flex flex-col items-center justify-center text-center group">
              <div className="p-3 rounded-2xl bg-purple-500/10 mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Rocket className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-4xl font-bold mb-2">14+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">Демо-концепций</div>
            </Card>
          </motion.div>

          {/* Second Main Content Box */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
            <Card className="h-full p-8 bg-white/5 border-white/10 backdrop-blur-sm hover-elevate transition-all duration-300">
              <div className="flex flex-col h-full justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Target className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Ваша цель — наш приоритет</h3>
                </div>
                <p className="text-muted-foreground">
                  Мы используем стек React + Node.js, что позволяет создавать сверхбыстрые 
                  приложения, которые легко масштабировать. Ваша аудитория получит 
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
