import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TechnologiesSection } from "@/components/TechnologiesSection";
import { CalculatorSection } from "@/components/CalculatorSection";
import { ProcessSection } from "@/components/ProcessSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useEffect } from "react";

export default function Home() {
  useDocumentMeta({
    title: "MP.WebStudio — Создание современных сайтов и IT-решений в Туле",
    description: "Профессиональная разработка сайтов, лендингов и веб-сервисов под ключ. Современный дизайн, высокая скорость работы и SEO-оптимизация для вашего бизнеса.",
    keywords: "разработка сайтов Тула, создание лендингов, веб-студия, заказать сайт, продвижение сайтов, создание интернет-магазина",
    ogTitle: "MP.WebStudio — Ваш надежный партнер в мире веб-разработки",
    ogDescription: "Создаем сайты, которые продают. От идеи до запуска за минимальные сроки.",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/",
    canonical: "https://mp-webstudio.ru/"
  });

  useEffect(() => {
    // JSON-LD for Organization
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MP.WebStudio",
      "url": "https://mp-webstudio.ru",
      "logo": "https://mp-webstudio.ru/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+7 (999) 123-45-67",
        "contactType": "customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Тула",
        "addressCountry": "RU"
      },
      "sameAs": [
        "https://vk.com/mp.webstudio",
        "https://t.me/mp_webstudio"
      ]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ServicesSection />
        <TechnologiesSection />
        <ProcessSection />
        <CalculatorSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
