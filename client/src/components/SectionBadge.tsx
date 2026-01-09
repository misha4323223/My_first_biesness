import { motion } from "framer-motion";

interface SectionBadgeProps {
  children: React.ReactNode;
}

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative inline-flex items-center justify-center px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden group shadow-[0_0_20px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-shadow duration-500 mb-8"
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
        {children}
      </span>
    </motion.div>
  );
}
