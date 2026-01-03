import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Truck, Package, MapPin, ArrowLeft, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const steps = [
  { id: 1, name: "Заказ принят", desc: "Мы получили ваш заказ и начали его обработку", time: "12:45", icon: Check },
  { id: 2, name: "Сборка", desc: "Сотрудник склада упаковывает ваши вещи", time: "12:50", icon: Package },
  { id: 3, name: "Передано курьеру", desc: "Заказ в пути по указанному адресу", time: "Ожидается", icon: Truck },
  { id: 4, name: "Доставлено", desc: "Приятных покупок!", time: "Ожидается", icon: MapPin },
];

export default function StreetWearSuccess() {
  const [currentStep, setCurrentStep] = useState(1);

  useDocumentMeta({
    title: "Заказ оформлен | SHADOWSTREET",
    description: "Статус вашего заказа в магазине SHADOWSTREET",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => prev < 3 ? prev + 1 : prev);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Link href="/demo/streetwear">
          <Button variant="ghost" className="mb-8 text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться в магазин
          </Button>
        </Link>

        <Card className="bg-neutral-900 border-neutral-800 p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <Check className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black mb-2">ЗАКАЗ ОФОРМЛЕН!</h1>
            <p className="text-neutral-400">Номер заказа: #SH-{Math.floor(1000 + Math.random() * 9000)}</p>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Статус доставки (Демо)
            </h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-800" />
              
              <div className="space-y-10 relative">
                {steps.map((step, idx) => {
                  const isActive = step.id <= currentStep;
                  const isLastActive = step.id === currentStep;
                  
                  return (
                    <motion.div 
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className={`flex gap-6 ${isActive ? "opacity-100" : "opacity-30"}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-500"}`}>
                        <step.icon className="w-6 h-6" />
                        {isLastActive && (
                          <motion.div 
                            layoutId="active-ring"
                            className="absolute w-14 h-14 rounded-full border-2 border-amber-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-bold ${isActive ? "text-white" : "text-neutral-500"}`}>{step.name}</h3>
                          <span className="text-xs font-mono text-neutral-600">{step.time}</span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-neutral-800/50 rounded-lg p-6 border border-neutral-800">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              Информация о доставке
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Способ</p>
                <p className="text-white">Курьерская доставка</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Оплата</p>
                <p className="text-white">При получении</p>
              </div>
              <div className="col-span-2">
                <p className="text-neutral-500 mb-1">Адрес</p>
                <p className="text-white">г. Москва, ул. Арбат, д. 1, кв. 42 (Демо-адрес)</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/demo/streetwear">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12">
                Продолжить покупки
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
