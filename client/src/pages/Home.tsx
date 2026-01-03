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
    title: "MP.WebStudio — Создание сайтов и IT-решений по всей России",
    description: "Профессиональная разработка сайтов, лендингов и веб-сервисов под ключ для бизнеса в любом регионе России. Современный дизайн, высокая скорость и SEO-оптимизация.",
    keywords: "разработка сайтов Россия, создание лендингов, веб-студия, заказать сайт, продвижение сайтов, создание интернет-магазина, веб-разработка удаленно",
    ogTitle: "MP.WebStudio — Ваш надежный партнер в веб-разработке по всей России",
    ogDescription: "Создаем эффективные сайты для бизнеса по всей России. От идеи до запуска под ключ.",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/",
    canonical: "https://mp-webstudio.ru/"
  });

  useEffect(() => {
    // Handle anchor scrolling on mount/URL change
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay to ensure content is rendered
    }
  }, []);

  useEffect(() => {
    // JSON-LD for Organization
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MP.WebStudio",
      "url": "https://mp-webstudio.ru",
      "logo": "https://mp-webstudio.ru/favicon.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+7 (953) 181-41-36",
        "contactType": "customer service",
        "email": "mpwebstudio1@gmail.com",
        "availableLanguage": "Russian",
        "areaServed": "RU"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Россия",
        "addressCountry": "RU"
      },
      "sameAs": [
        "https://t.me/MPWebStudio"
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
