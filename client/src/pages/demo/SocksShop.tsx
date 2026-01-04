import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Gift, 
  Menu, 
  Truck, 
  CreditCard, 
  RefreshCw, 
  ArrowLeft, 
  Plus, 
  X, 
  Minus, 
  Check, 
  Star, 
  Heart, 
  Share2, 
  Info, 
  ShoppingBag, 
  Search, 
  ArrowRight 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";

import giftBoxImg from "@assets/generated_images/classic_socks_gift_box.webp";
import businessImg from "@assets/generated_images/business_socks_gift_set.webp";
import noveltyImg from "@assets/generated_images/novelty_text_pattern_socks.webp";
import athleticImg from "@assets/generated_images/athletic_compression_running_socks.webp";
import colorfulImg from "@assets/generated_images/colorful_patterned_socks_set.webp";
import heroImg from "@assets/generated_images/socks_collection_hero_banner.webp";

const products = [
  {
    id: 1,
    name: "Набор «Gentleman»",
    description: "Премиальный хлопок, идеальны для классических туфель. В наборе 5 пар базовых цветов: черный, темно-синий, графит.",
    price: 1890,
    oldPrice: 2490,
    image: giftBoxImg,
    tag: "Best Seller",
    category: "Наборы",
    rating: 5,
    details: "80% гребенной хлопок, 17% полиамид, 3% эластан. Бесшовная мыска."
  },
  {
    id: 2,
    name: "Набор «Business Class»",
    description: "7 пар для каждого дня недели, усиленная пятка. Классическая высокая посадка.",
    price: 2990,
    image: businessImg,
    tag: "Premium",
    category: "Наборы",
    rating: 5,
    details: "Премиальный мерсеризованный хлопок с легким шелковистым блеском."
  },
  {
    id: 3,
    name: "«No Limits»",
    description: "Дерзкий принт для тех, кто не боится выделяться. Яркие цвета и провокационные надписи.",
    price: 690,
    image: noveltyImg,
    tag: "Trending",
    category: "С надписями",
    rating: 4.8,
    details: "Яркий принт, устойчивый к многочисленным стиркам."
  },
  {
    id: 4,
    name: "«The Boss»",
    description: "Для тех, кто принимает решения в любой ситуации. Золотая корона на черном фоне.",
    price: 750,
    oldPrice: 990,
    image: noveltyImg,
    tag: "SALE",
    category: "С надписями",
    rating: 4.9,
    details: "Эксклюзивный дизайн, ограниченная серия."
  },
  {
    id: 5,
    name: "Ultra Sport Pro",
    description: "Анатомическая поддержка и отвод влаги. Идеально для марафонов и интенсивных тренировок.",
    price: 990,
    image: athleticImg,
    tag: "PRO",
    category: "Спорт",
    rating: 5,
    details: "Специальная компрессионная зона и вентиляционные вставки."
  },
  {
    id: 6,
    name: "Winter Thermo",
    description: "Шерсть мериноса для самых низких температур. Сохраняют тепло и отводят лишнюю влагу.",
    price: 1290,
    image: athleticImg,
    tag: "Winter",
    category: "Спорт",
    rating: 4.7,
    details: "50% шерсть мериноса, 40% акрил, 10% эластан."
  },
  {
    id: 7,
    name: "Набор «Infinity»",
    description: "Яркие геометрические узоры для творческих людей. 5 пар с уникальными паттернами.",
    price: 1990,
    image: colorfulImg,
    tag: "Gift Choice",
    category: "Наборы",
    rating: 4.9,
    details: "Экологичный хлопок, подарочная коробка в комплекте."
  },
  {
    id: 8,
    name: "«Super Power»",
    description: "Твоя секретная энергия в каждом шаге. Мотивирующие надписи на стопе.",
    price: 590,
    image: noveltyImg,
    category: "С надписями",
    rating: 4.6,
    details: "Текстурированная подошва для лучшего сцепления."
  },
];

const reviews = [
  { id: 1, name: "Александр В.", text: "Качество на высоте! После 10 стирок как новые. Очень комфортно сидят на ноге.", rating: 5 },
  { id: 2, name: "Мария П.", text: "Брала мужу в подарок набор «Gentleman», он в восторге от упаковки и качества ткани!", rating: 5 },
  { id: 3, name: "Дмитрий К.", text: "Спортивные носки реально работают, ноги не устают даже после длинной пробежки.", rating: 5 },
];

const categories = [
  { name: "Все", count: 24, icon: null },
  { name: "Наборы", count: 8, icon: Gift },
  { name: "С надписями", count: 10, icon: null },
  { name: "Спорт", count: 6, icon: null },
];

const features = [
  { icon: Truck, title: "Экспресс доставка", desc: "По всей России от 1-3 дней" },
  { icon: Gift, title: "Премиум упаковка", desc: "Бесплатно к каждому набору" },
  { icon: RefreshCw, title: "Гарантия качества", desc: "Возврат без лишних вопросов" },
];

const heroCategories = [
  {
    title: "Подарочные наборы",
    description: "Элегантные боксы для настоящих ценителей",
    image: giftBoxImg,
    filter: "Наборы",
  },
  {
    title: "С надписями",
    description: "Твое настроение — твои правила",
    image: noveltyImg,
    filter: "С надписями",
  },
  {
    title: "Спорт и Актив",
    description: "Технологии комфорта в каждом движении",
    image: athleticImg,
    filter: "Спорт",
  },
];

export default function SocksShop() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", email: "" });
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const { toast } = useToast();
  
  const productsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "SockLove — Бутик эксклюзивных мужских носков",
    description: "Премиальные наборы, дизайнерские носки с надписями и технологичные спортивные модели. Бесплатная доставка от 1500 ₽.",
    keywords: "мужские носки, подарочные наборы, брендовые носки, купить носки, socklove",
    ogTitle: "SockLove — Стиль начинается с деталей",
    ogDescription: "Откройте для себя мир качественных аксессуаров. Лучшие подарки для него здесь.",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/socks",
    canonical: "https://mp-webstudio.ru/demo/socks"
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "SockLove", url: "https://mp-webstudio.ru/demo/socks" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast({
      title: "Добавлено в корзину",
      description: "Товар успешно добавлен к вашему заказу",
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id]--;
      else delete newCart[id];
      return newCart;
    });
  };

  const clearItem = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    product: products.find(p => p.id === Number(id))!,
    quantity: qty
  })).filter(c => c.product);

  const cartTotal = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleNavClick = (item: string) => {
    setMobileMenuOpen(false);
    if (item === "Каталог") scrollToProducts();
    else if (item === "Наборы") {
      setActiveCategory("Наборы");
      scrollToProducts();
    }
    else if (item === "SALE") {
      scrollToProducts();
      toast({ title: "Раздел SALE", description: "Скидки на избранные модели до -40%!" });
    }
    else if (item === "Доставка") featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) return;
    setOrderSuccess(true);
    setTimeout(() => {
      setCartOpen(false);
      setOrderSuccess(false);
      setCart({});
      setOrderForm({ name: "", phone: "", email: "" });
    }, 2500);
  };

  const filteredProducts = (activeCategory === "Все" 
    ? products 
    : products.filter(p => p.category === activeCategory)
  ).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-8 pt-6">
              <div className="rounded-xl overflow-hidden bg-muted">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full aspect-square object-cover" />
              </div>
              <div className="flex flex-col">
                <Badge variant="secondary" className="w-fit mb-2">{selectedProduct.category}</Badge>
                <DialogTitle className="text-2xl font-black mb-2">{selectedProduct.name}</DialogTitle>
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < selectedProduct.rating ? "fill-amber-500" : ""}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">(12 отзывов)</span>
                </div>
                <DialogDescription className="text-base text-neutral-600 mb-6">
                  {selectedProduct.description}
                  <br /><br />
                  <span className="text-sm font-bold text-neutral-900">Особенности:</span><br />
                  {selectedProduct.details}
                </DialogDescription>
                <div className="mt-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-black text-rose-500">{selectedProduct.price} ₽</span>
                    {selectedProduct.oldPrice && (
                      <span className="text-lg text-neutral-400 line-through">{selectedProduct.oldPrice} ₽</span>
                    )}
                  </div>
                  <Button className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold" onClick={() => addToCart(selectedProduct.id)}>
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-rose-500" />
              Корзина ({cartCount})
            </DialogTitle>
          </DialogHeader>
          
          {orderSuccess ? (
            <div className="py-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Заказ принят!</h3>
              <p className="text-muted-foreground text-sm">Наш менеджер перезвонит вам в течение 10 минут.</p>
            </div>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                  <p className="text-muted-foreground">В корзине пока ничего нет</p>
                  <Button variant="outline" className="mt-6" onClick={() => setCartOpen(false)}>Начать покупки</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm leading-tight mb-1 truncate">{product.name}</p>
                          <p className="text-sm font-black text-rose-500">{product.price * quantity} ₽</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2 bg-white rounded-full border px-2 py-1">
                            <button onClick={() => removeFromCart(product.id)} className="hover:text-rose-500"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                            <button onClick={() => addToCart(product.id)} className="hover:text-rose-500"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => clearItem(product.id)} className="text-[10px] text-muted-foreground hover:text-rose-500">Удалить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-dashed pt-4 mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground text-sm">Сумма заказа:</span>
                      <span className="font-bold">{cartTotal} ₽</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground text-sm">Доставка:</span>
                      <span className="text-green-600 text-sm font-bold">Бесплатно</span>
                    </div>
                    <div className="flex justify-between text-xl font-black border-t pt-4">
                      <span>Итого:</span>
                      <span className="text-rose-500">{cartTotal} ₽</span>
                    </div>
                  </div>

                  <form onSubmit={handleOrder} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Как к вам обращаться?</Label>
                      <Input id="name" value={orderForm.name} onChange={(e) => setOrderForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя Фамилия" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Контактный телефон</Label>
                      <Input id="phone" type="tel" value={orderForm.phone} onChange={(e) => setOrderForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 (___) ___-__-__" required />
                    </div>
                    <Button type="submit" className="w-full h-12 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl shadow-lg">
                      Подтвердить заказ
                    </Button>
                  </form>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Link href="/#portfolio">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-100">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex flex-col">
                <span className="text-xl font-[1000] leading-none tracking-tighter">
                  SOCK<span className="text-rose-500">LOVE</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Concept Store</span>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8">
              {["Каталог", "Наборы", "SALE", "Доставка"].map(item => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-bold tracking-tight transition-all relative group ${
                    item === "SALE" ? "text-rose-500" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
                <Search className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => setCartOpen(true)}
                className="relative bg-neutral-900 hover:bg-black text-white rounded-full px-4 gap-2 h-10 shadow-lg shadow-black/10"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline font-bold text-sm">Корзина</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-rose-500 text-[10px] font-black">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-8 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10"
              >
                <Badge className="mb-4 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none font-bold py-1 px-4 rounded-full">
                  Новая коллекция '26
                </Badge>
                <h1 className="text-5xl sm:text-7xl font-[1000] leading-[0.9] tracking-tighter mb-6">
                  СТИЛЬ <br /> 
                  В КАЖДОМ <br />
                  <span className="text-rose-500 underline decoration-rose-200 underline-offset-8">ШАГЕ</span>
                </h1>
                <p className="text-lg text-neutral-500 mb-8 max-w-md font-medium leading-relaxed">
                  Бутик мужских носков, где качество хлопка встречается с безупречным дизайном. 
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="h-14 px-8 bg-neutral-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-black/20 group" onClick={scrollToProducts}>
                    Смотреть каталог
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 border-2 font-black rounded-2xl">
                    О нас
                  </Button>
                </div>
              </motion.div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl z-10"
                >
                  <img src={heroImg} alt="Hero" className="w-full h-full object-cover scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent" />
                </motion.div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-200/50 rounded-full blur-3xl -z-0" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-0" />
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Grid */}
        <section ref={productsRef} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Sidebar Filters */}
              <aside className="lg:w-64 space-y-8 flex-shrink-0">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-6">Категории</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                          activeCategory === cat.name
                            ? "bg-neutral-900 text-white shadow-lg"
                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                        }`}
                      >
                        {cat.name}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === cat.name ? "bg-white/20" : "bg-neutral-100"}`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-neutral-100">
                  <h4 className="font-black text-sm uppercase tracking-widest mb-6">Сортировка</h4>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-neutral-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-rose-500 outline-none"
                  >
                    <option value="popular">По популярности</option>
                    <option value="price-low">Сначала дешевле</option>
                    <option value="price-high">Сначала дороже</option>
                  </select>
                </div>
              </aside>

              {/* Main Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black tracking-tight">
                    {activeCategory} <span className="text-muted-foreground text-lg ml-2">{filteredProducts.length}</span>
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl"><Filter className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-xl lg:hidden"><Search className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="group relative bg-white border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] overflow-hidden">
                          <div className="relative aspect-square overflow-hidden bg-neutral-100">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                              {product.tag && (
                                <Badge className="bg-white/90 backdrop-blur-md text-neutral-900 border-none font-bold px-3 py-1 rounded-full text-[10px] shadow-sm">
                                  {product.tag}
                                </Badge>
                              )}
                              <Button variant="ghost" size="icon" className="rounded-full bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="absolute bottom-4 inset-x-4 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <Button className="flex-1 bg-white/95 backdrop-blur-md text-neutral-900 hover:bg-neutral-900 hover:text-white font-bold rounded-xl h-12 shadow-xl" onClick={() => setSelectedProduct(product)}>
                                <Info className="w-4 h-4 mr-2" /> Описание
                              </Button>
                              <Button className="w-12 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xl p-0" onClick={() => addToCart(product.id)}>
                                <Plus className="w-5 h-5 mx-auto" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-black text-lg leading-tight truncate">{product.name}</h3>
                              <div className="flex items-center text-amber-500 text-xs font-bold">
                                <Star className="w-3 h-3 fill-current mr-1" /> {product.rating}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 font-medium">{product.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                              <div className="flex flex-col">
                                {product.oldPrice && <span className="text-[10px] text-neutral-400 line-through mb-1">{product.oldPrice} ₽</span>}
                                <span className="text-xl font-black text-rose-500 leading-none">{product.price} ₽</span>
                              </div>
                              <div className="flex -space-x-1">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-neutral-200" style={{ backgroundColor: i === 1 ? '#000' : i === 2 ? '#333' : '#666' }} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-neutral-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid md:grid-cols-3 gap-16">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all group-hover:bg-rose-500 group-hover:rotate-12 group-hover:scale-110">
                    <f.icon className="w-8 h-8 text-rose-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-black mb-3">{f.title}</h3>
                  <p className="text-neutral-400 font-medium">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full" />
        </section>

        {/* Reviews Section */}
        <section className="py-24 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tighter mb-4">ШЕПОТ СЧАСТЛИВЫХ НОГ</h2>
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Доверие более 10,000 клиентов</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-8 border-none bg-white shadow-xl shadow-black/5 rounded-[2.5rem] relative">
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= r.rating ? "fill-rose-500 text-rose-500" : "text-neutral-200"}`} />
                      ))}
                    </div>
                    <p className="text-neutral-600 font-medium italic mb-8 leading-relaxed">"{r.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-black text-lg">
                        {r.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-neutral-900">{r.name}</span>
                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Подтвержденный покупатель</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-white px-4">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-neutral-900 p-8 sm:p-16 relative overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tighter">ВСТУПАЙ В SOCKLOVE CLUB</h2>
              <p className="text-neutral-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                Подпишись на наши новости и получи секретный промокод на <span className="text-rose-500 font-black">-15%</span> на первый заказ и ранний доступ к дропам.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input 
                  placeholder="Ваш e-mail" 
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-2xl px-6 focus:ring-rose-500"
                />
                <Button className="h-14 px-8 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-500/20 whitespace-nowrap">
                  Подписаться
                </Button>
              </form>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/20 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>
        </section>
      </main>

      <footer ref={footerRef} className="bg-white border-t border-neutral-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="text-2xl font-[1000] tracking-tighter mb-6">
                SOCK<span className="text-rose-500">LOVE</span>
              </div>
              <p className="text-neutral-500 max-w-xs font-medium leading-relaxed mb-8">
                Бутик мужских носков №1. Мы верим, что стиль начинается с деталей, а комфорт — с правильной пары.
              </p>
              <div className="flex gap-4">
                {["IG", "TG", "VK"].map(s => (
                  <button key={s} className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center font-black text-xs hover:bg-rose-500 hover:text-white transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-neutral-400">Навигация</h4>
              <ul className="space-y-4">
                {["Каталог", "Подарочные наборы", "SALE / Акции", "Доставка и оплата"].map(l => (
                  <li key={l}><button className="text-sm font-bold text-neutral-600 hover:text-rose-500 transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-neutral-400">Поддержка</h4>
              <ul className="space-y-4">
                <li className="text-sm font-bold text-neutral-900">+7 (900) 555-01-23</li>
                <li className="text-sm font-bold text-neutral-600">hello@socklove.ru</li>
                <li className="pt-4 border-t border-neutral-50">
                  <p className="text-[10px] text-neutral-400 uppercase font-black mb-2">Разработка</p>
                  <Link href="/" className="text-sm font-black hover:text-rose-500 transition-colors">MP.WEBSTUDIO</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-400 gap-4">
            <p>© {new Date().getFullYear()} SOCKLOVE CONCEPT STORE. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <button className="hover:text-rose-500">Политика конфиденциальности</button>
              <button className="hover:text-rose-500">Публичная оферта</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
