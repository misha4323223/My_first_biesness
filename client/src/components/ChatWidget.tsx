import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Send, X, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/mp_hexagonal_tech_logo_1766320057712.webp";
import { motion, AnimatePresence } from "framer-motion";

import generatedVideo from "@assets/generated_videos/ai_assistant_holographic_head_greeting.mp4";

const ParticleSphere = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      speed: number;
      alpha: number;
    }> = [];

    const particleCount = 450;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    // Инициализация частиц в случайных позициях снаружи
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + Math.random() * 100;
      const targetAngle = Math.random() * Math.PI * 2;
      const targetR = Math.random() * radius;

      particles.push({
        x: centerX + Math.cos(angle) * (r + 100),
        y: centerY + Math.sin(angle) * (r + 100),
        targetX: centerX + Math.cos(targetAngle) * targetR,
        targetY: centerY + Math.sin(targetAngle) * targetR,
        size: Math.random() * 2 + 1,
        speed: 0.02 + Math.random() * 0.03,
        alpha: 0
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Движение к цели (сборка сферы)
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;
        p.alpha = Math.min(p.alpha + 0.01, 0.6);

        // Легкое дрожание для эффекта жизни
        const jitter = Math.sin(Date.now() * 0.01 + p.x) * 0.5;
        
        ctx.beginPath();
        ctx.arc(p.x + jitter, p.y + jitter, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.fill();

        // Эффект свечения вокруг частицы
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(34, 211, 238, ${p.alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Отрисовка основного ядра сферы
      const pulse = Math.sin(Date.now() * 0.002) * 5;
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + pulse);
      coreGradient.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
      coreGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + pulse, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} width={400} height={400} className="w-64 h-64" />;
};

const HolographicVideo = ({ isProcessing }: { isProcessing: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Начинаем показывать частицы на 4-й секунде видео для плавного перехода
      if (video.currentTime >= 4 && !showParticles) {
        setShowParticles(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [showParticles]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Плавное свечение вокруг */}
      <div className={`absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full transition-opacity duration-1000 ${isVideoEnded ? 'opacity-100' : 'opacity-40'}`} />
      
      <motion.div
        animate={isVideoEnded ? {
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.9, 0.7],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <video
          ref={videoRef}
          src={generatedVideo}
          autoPlay
          muted
          playsInline
          onEnded={() => setIsVideoEnded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 scale-100 ${
            isVideoEnded 
              ? "opacity-0 scale-110 blur-xl pointer-events-none" 
              : "opacity-90 blur-0 mix-blend-lighten"
          }`}
        />
        
        {/* Эффект пульсирующего ядра (сферы) */}
        <AnimatePresence>
          {showParticles && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-[0%] flex items-center justify-center pointer-events-none z-0"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <ParticleSphere />
                {/* Дополнительное свечение в центре */}
                <div className="absolute w-32 h-32 bg-cyan-400/10 rounded-full blur-[40px] animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Наложение сетки для эффекта прямой трансляции */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-30" />
      
      {/* Виньетка для бесшовного вписывания */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-20" />
    </div>
  );
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

const HolographicSphere = ({ isProcessing, isNaming }: { isProcessing: boolean, isNaming: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += isProcessing ? 0.05 : 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const baseRadius = isNaming ? 60 : 20;
      
      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw layers
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const pulse = Math.sin(time + i) * (isProcessing ? 15 : 5);
        const radius = baseRadius + pulse + (i * 10);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        if (i === 0) {
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        } else {
          gradient.addColorStop(0, 'transparent');
          gradient.addColorStop(1, i === 1 ? 'rgba(34, 211, 238, 0.2)' : 'rgba(168, 85, 247, 0.1)');
        }

        ctx.fillStyle = gradient;
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Wave effect
        ctx.beginPath();
        ctx.strokeStyle = i === 1 ? 'rgba(34, 211, 238, 0.3)' : 'rgba(168, 85, 247, 0.2)';
        ctx.lineWidth = 1;
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          const r = radius + Math.sin(a * 5 + time * 2) * 2;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isProcessing, isNaming]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full pointer-events-none"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [isNameStep, setIsNameStep] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll tracking and tooltip logic
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial tooltip timer
    const tooltipTimer = setTimeout(() => {
      if (isVisible) setShowTooltip(true);
    }, 5000);

    // Hide tooltip after some time
    const hideTooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);

    return () => {
      window.removeEventListener('open-ai-chat', handleOpenChat);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(tooltipTimer);
      clearTimeout(hideTooltipTimer);
    };
  }, [isVisible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const trimmedName = userName.trim();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/giga-chat", { 
        message: `Привет! Это первое сообщение от ${trimmedName}.`,
        userName: trimmedName,
        isFirstMessage: true 
      });

      const data = await response.json();

      if (data.success) {
        setMessages([
          { role: "assistant", content: data.response },
        ]);
        setIsNameStep(false);
      } else {
        const errorMsg = data.response || "Ошибка при получении ответа. Попробуйте снова.";
        setMessages([
          { role: "assistant", content: `Ошибка: ${errorMsg}` },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        { role: "assistant", content: "⚠️ Не удалось связаться с AI-ассистентом. Попробуйте позже." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/giga-chat", { 
        message: userMessage,
        history: messages 
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        const errorMsg = data.response || "Ошибка при получении ответа. Попробуйте снова.";
        const details = data.code ? ` (Код: ${data.code})` : "";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Ошибка: ${errorMsg}${details}`,
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = "Не удалось связаться с AI-ассистентом";
      
      if (error instanceof Error) {
        try {
          const jsonMatch = error.message.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            errorMessage = jsonData.response || errorMessage;
          } else {
            errorMessage = error.message;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-md h-[80vh] md:h-[600px] flex flex-col p-0 bg-black/90 backdrop-blur-2xl border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden font-sans">
          
          <DialogHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <img src={logoUrl} alt="MP" className="w-5 h-5 object-contain" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-white tracking-tight">
                  MP<span className="text-cyan-400">.</span>Assistant
                </DialogTitle>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    {isLoading ? 'Processing' : 'Online'}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 relative flex flex-col overflow-hidden min-h-0">
            <AnimatePresence mode="wait">
              {isNameStep ? (
                <motion.div
                  key="name-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-end relative overflow-hidden"
                >
                  <div className="absolute inset-0 z-0">
                    <HolographicVideo isProcessing={isLoading} />
                  </div>
                  
                  <div className="w-full max-w-[280px] space-y-6 text-center relative z-10 mb-0 p-8 bg-transparent">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white tracking-tight">Представьтесь</h3>
                      <p className="text-sm text-white/40">Чтобы начать диалог с нашим интеллектом</p>
                    </div>

                    <form onSubmit={handleNameSubmit} className="space-y-3">
                      <div className="relative group">
                        <Input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          disabled={isLoading}
                          placeholder="Ваше имя"
                          className="h-12 bg-white/[0.03] border-white/20 rounded-2xl text-center font-bold tracking-tight focus:border-cyan-500/50 transition-all placeholder:text-white/40 text-white"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !userName.trim()}
                        className="w-full h-12 bg-white/10 text-white hover:bg-white/20 font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                        ) : (
                          "Начать чат"
                        )}
                      </Button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 relative z-20 min-h-0 custom-scrollbar" style={{ maxHeight: 'calc(80vh - 180px)', flexBasis: 'auto' }}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-white text-black font-medium rounded-tr-none shadow-xl shadow-white/5"
                              : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 bg-gradient-to-t from-black to-transparent">
                    <div className="relative flex gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-[24px] focus-within:border-cyan-500/50 transition-all">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Задайте вопрос..."
                        disabled={isLoading}
                        className="h-11 bg-transparent border-0 focus-visible:ring-0 text-sm font-medium placeholder:text-white/20 px-4"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        size="icon"
                        className="w-11 h-11 bg-white text-black hover:bg-white/90 rounded-full flex-shrink-0 transition-all active:scale-90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
