import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Send, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/mp_hexagonal_tech_logo_1766320057712.webp";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [isNameStep, setIsNameStep] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const trimmedName = userName.trim();
    setUserName("");
    setIsLoading(true);
    setIsNameStep(false);

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

      // apiRequest уже обрабатывает response.ok и выбрасывает ошибку, если статус не 2xx
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
        // Если это ошибка от apiRequest, она может содержать тело ответа
        errorMessage = error.message;
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
      {/* Плавающая кнопка - NEO TERMINAL STYLE WITH NEON ANIMATION */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <div className="h-14 w-14 rounded-sm bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 p-[2px] group hover:shadow-lg hover:shadow-purple-400/50 transition-shadow duration-200">
          <button
            onClick={() => setIsOpen(true)}
            data-testid="button-ai-chat"
            className="h-full w-full rounded-sm bg-background flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ai-assistant-btn"
            title="AI Assistant"
          >
            <Brain className="w-6 h-6 text-cyan-400 group-hover:text-purple-400 transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Модалка чата - NEO TERMINAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] md:w-full max-w-md h-[80vh] md:h-[500px] flex flex-col p-0 bg-black border-2 border-transparent bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-cyan-400/20 bg-clip-padding rounded-sm shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_20px_rgba(34,211,238,0.3)] neo-terminal">
          
          {/* Шапка - NEO TERMINAL */}
          <DialogHeader className="bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-cyan-400/10 border-b-2 border-cyan-400/50 p-3 space-y-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono text-sm font-bold tracking-wider">
                ИИ Помощник MP.WebStudio
              </DialogTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-cyan-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </DialogHeader>

          {/* История сообщений */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-black font-mono text-xs chat-messages-scroll">
            {messages.length === 0 && isNameStep && (
              <div className="h-full flex flex-col items-center justify-center gap-6 p-4">
                <img 
                  src={logoUrl} 
                  alt="MP Logo" 
                  className="w-24 h-24 opacity-60"
                />
                <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-3">
                  <label className="text-cyan-400 text-xs font-bold">Ваше имя:</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={isLoading}
                    placeholder="Введите ваше имя..."
                    className="w-full bg-black border border-cyan-400/30 text-cyan-400 placeholder-cyan-400/40 px-3 py-2 rounded-sm text-xs focus:border-purple-400 focus:outline-none focus:ring-0"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !userName.trim()}
                    className="w-full bg-black border-2 border-cyan-400 text-cyan-400 hover:border-purple-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-sm text-xs font-bold transition-colors"
                  >
                    {isLoading ? "Загрузка..." : "Задать вопрос"}
                  </button>
                  <p className="text-cyan-400/60 text-xs text-center mt-2">
                    💬 Сообщения не сохраняются<br/>
                    📚 Контекст: последние 10 сообщений
                  </p>
                </form>
              </div>
            )}
            {messages.length === 0 && !isNameStep && (
              <div className="h-full flex items-center justify-center">
                <img 
                  src={logoUrl} 
                  alt="MP Logo" 
                  className="w-32 h-32 opacity-60 hover:opacity-80 transition-opacity"
                />
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                data-testid={`message-${msg.role}-${idx}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-sm border ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border-purple-400/30 text-cyan-400"
                      : "bg-black border-cyan-400/20 text-cyan-400"
                  }`}
                >
                  <p className="text-xs leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black border border-cyan-400/20 px-3 py-2 rounded-sm">
                  <p className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-xs animate-none">
                    &gt; PROCESSING...
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Форма ввода - только если прошли шаг ввода имени */}
          {!isNameStep && (
            <div className="bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-cyan-400/5 border-t-2 border-cyan-400/50 p-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  data-testid="input-chat-message"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Что вас интересует?"
                  disabled={isLoading}
                  className="bg-black border-cyan-400/30 focus:border-purple-400 text-cyan-400 placeholder-cyan-400/40 font-mono text-xs rounded-sm focus:ring-0 focus:outline-none transition-colors"
                />
                <Button
                  data-testid="button-send-chat"
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                  className="bg-black border-2 border-cyan-400 hover:border-purple-400 text-cyan-400 hover:text-purple-400 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
