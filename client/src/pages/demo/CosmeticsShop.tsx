import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Search, Star, Sparkles, Leaf, Droplet, ArrowLeft, Plus, Minus, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useAggregateRatingSchema } from "@/lib/useAggregateRatingSchema";
import heroImg from "@assets/stock_images/cosmetics_skincare_p_2775c0e7.webp";
import moisturizerImg from "@assets/stock_images/face_moisturizer_cre_59e07cda.webp";
import serumImg from "@assets/stock_images/vitamin_c_serum_drop_c449b45e.webp";
import micellarImg from "@assets/stock_images/micellar_water_clean_dda3e93a.webp";
import maskImg from "@assets/stock_images/face_mask_cosmetic_s_4961cbaf.webp";
import tonerImg from "@assets/stock_images/toner_bottle_skincar_632250d7.webp";
import nightCreamImg from "@assets/stock_images/night_cream_luxury_s_7bf4c694.webp";
import ritualHeroImg from "@assets/stock_images/luxury_skincare_rout_51feeee5.jpg";

const products = [
  {
    id: 1,
    name: "Увлажняющий крем",
    brand: "HYDRA",
    price: 2890,
    oldPrice: 3490,
    image: moisturizerImg,
    rating: 4.8,
    reviews: 124,
    tag: "Хит",
    category: "Увлажнение",
    description: "Глубокое увлажнение на 24 часа. Легкая текстура быстро впитывается, не оставляя жирного блеска. Обогащен гиалуроновой кислотой.",
    ingredients: ["Гиалуроновая кислота", "Экстракт алоэ", "Витамин Е"],
    howToUse: "Наносить утром и вечером на очищенную кожу лица легкими массирующими движениями.",
  },
  {
    id: 2,
    name: "Сыворотка с витамином C",
    brand: "GLOW",
    price: 3450,
    image: serumImg,
    rating: 4.9,
    reviews: 89,
    tag: "Новинка",
    category: "Антивозрастной",
    description: "Мощный антиоксидантный комплекс для сияния вашей кожи. Выравнивает тон и стимулирует выработку коллагена.",
    ingredients: ["Витамин С 15%", "Феруловая кислота", "Витамин Е"],
    howToUse: "Нанесите 3-4 капли на очищенную кожу лица перед использованием крема.",
  },
  {
    id: 3,
    name: "Мицеллярная вода",
    brand: "PURE",
    price: 890,
    image: micellarImg,
    rating: 4.7,
    reviews: 256,
    category: "Очищение",
    description: "Бережное удаление макияжа и загрязнений. Не требует смывания и не раздражает глаза.",
    ingredients: ["Мицеллы", "Пантенол", "Экстракт ромашки"],
    howToUse: "Смочите ватный диск и бережно протрите кожу лица, глаз и губ.",
  },
  {
    id: 4,
    name: "Маска для лица",
    brand: "CARE",
    price: 1290,
    image: maskImg,
    rating: 4.6,
    reviews: 78,
    tag: "Веган",
    category: "Очищение",
    description: "Глубокое очищение пор и детокс-эффект. Успокаивает воспаления и выравнивает текстуру.",
    ingredients: ["Белая глина", "Масло чайного дерева", "Цинк"],
    howToUse: "Нанесите на чистую кожу на 10-15 минут, затем смойте теплой водой.",
  },
  {
    id: 5,
    name: "Тоник с гиалуроновой кислотой",
    brand: "HYDRA",
    price: 1890,
    image: tonerImg,
    rating: 4.8,
    reviews: 145,
    category: "Увлажнение",
    description: "Восстанавливает pH-баланс и подготавливает кожу к дальнейшему уходу. Мгновенно освежает.",
    ingredients: ["Низкомолекулярная гиалуроновая кислота", "Ниацинамид"],
    howToUse: "После очищения нанесите небольшое количество на ладони или ватный диск и распределите по лицу.",
  },
  {
    id: 6,
    name: "Ночной крем",
    brand: "RESTORE",
    price: 3290,
    oldPrice: 3990,
    image: nightCreamImg,
    rating: 4.9,
    reviews: 67,
    tag: "Скидка",
    category: "Антивозрастной",
    description: "Интенсивное восстановление кожи во время сна. Сокращает морщины и повышает упругость.",
    ingredients: ["Ретинол", "Пептиды", "Масло ши"],
    howToUse: "Наносите вечером на очищенную кожу лица за 30 минут до сна.",
  },
];

const categories = ["Все", "Увлажнение", "Очищение", "Антивозрастной", "Для тела"];

const features = [
  { icon: Leaf, title: "Натуральный состав", desc: "Без парабенов и сульфатов" },
  { icon: Droplet, title: "Гипоаллергенно", desc: "Подходит чувствительной коже" },
  { icon: Sparkles, title: "Результат", desc: "Видимый эффект за 14 дней" },
];

export default function CosmeticsShop() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", email: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const { toast } = useToast();
  const productsRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "BeautyLab — Косметика и уход за кожей | Натуральные средства",
    description: "Премиум косметика и средства по уходу за кожей. Натуральный состав, гипоаллергенно. Скидки до 30%. Доставка по России.",
    keywords: "косметика, уход за кожей, натуральная косметика, сыворотки, кремы, маски для лица",
    ogTitle: "BeautyLab — Косметика | Дизайн от MP.WebStudio",
    ogDescription: "Натуральная косметика без парабенов. Видимый результат за 14 дней. Гипоаллергенно.",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/cosmetics-shop",
    canonical: "https://mp-webstudio.ru/demo/cosmetics-shop"
  });

  const avgProdRating = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);
  const totalProdReviews = products.reduce((sum, p) => sum + p.reviews, 0);

  useAggregateRatingSchema({
    name: "BeautyLab Косметика",
    description: "Натуральная косметика с видимым результатом",
    data: {
      ratingValue: parseFloat(avgProdRating),
      ratingCount: totalProdReviews
    }
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "BeautyLab", url: "https://mp-webstudio.ru/demo/cosmetics" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
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

  const filteredProducts = activeCategory === "Все" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) return;
    setOrderSuccess(true);
    setTimeout(() => {
      setCartOpen(false);
      setOrderSuccess(false);
      setCart({});
      setOrderForm({ name: "", phone: "", email: "" });
    }, 2000);
  };

  const handleNewsletter = () => {
    if (!newsletterEmail) return;
    toast({ title: "Подписка оформлена!", description: "Скидка 15% отправлена на вашу почту" });
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950">
      <Link href="/#portfolio" className="fixed top-4 left-4 z-[100]">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-stone-300 dark:border-white/20 hover:bg-white/90 dark:hover:bg-black/90"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Корзина
            </DialogTitle>
          </DialogHeader>
          
          {orderSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Заказ оформлен!</h3>
              <p className="text-muted-foreground">Мы свяжемся с вами для подтверждения</p>
            </div>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-sm text-rose-500">{product.price * quantity} р</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeFromCart(product.id)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => addToCart(product.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => clearItem(product.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-lg font-semibold mb-4">
                      <span>Итого:</span>
                      <span className="text-rose-500">{cartTotal} р</span>
                    </div>
                    
                    <div className="bg-rose-100/50 dark:bg-rose-900/20 p-4 rounded-xl mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Спецпредложение для вас
                      </p>
                      <div className="flex gap-3 items-center">
                        <img src={maskImg} className="w-12 h-12 rounded-lg object-cover" alt="Mask" />
                        <div className="flex-1">
                          <p className="text-xs font-medium">Маска CARE</p>
                          <p className="text-xs text-muted-foreground">Добавьте за 990 р (вместо 1290)</p>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => addToCart(4)}>
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleOrder} className="space-y-3">
                    <div>
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input 
                        id="name" 
                        value={orderForm.name} 
                        onChange={(e) => setOrderForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Анна"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        value={orderForm.phone} 
                        onChange={(e) => setOrderForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={orderForm.email} 
                        onChange={(e) => setOrderForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="anna@mail.ru"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 rounded-full">
                      Оформить заказ
                    </Button>
                  </form>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-stone-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-light tracking-widest text-stone-800 dark:text-white pl-12">
              NATURA
            </h1>
            
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 z-10" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="w-full pl-10 rounded-full bg-stone-100 dark:bg-neutral-800 border-0"
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-favorites">
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)} data-testid="button-cart">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ritualHeroImg} 
            alt="Premium Skincare" 
            className="w-full h-full object-cover brightness-[0.85] dark:brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-xl"
          >
            <span className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4 block font-light">Pure. Intentional. Transformative.</span>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight font-light">
              Искусство <br />
              <span className="italic">ухода</span>
            </h2>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-white text-stone-900 hover:bg-stone-100 rounded-full px-8 h-12 text-base font-light tracking-wide transition-all hover:scale-105" 
                onClick={scrollToProducts}
              >
                Откройте коллекцию
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif mb-8 font-light tracking-wide text-stone-800 dark:text-stone-200">Философия NATURA</h2>
            <div className="w-12 h-[1px] bg-rose-200 mx-auto mb-8" />
            <p className="text-lg text-stone-600 dark:text-stone-400 font-light leading-relaxed tracking-wide">
              Мы верим, что истинная красота рождается в гармонии с природой. Наши формулы — это сочетание чистейших ботанических экстрактов и передовых научных достижений для здоровья и сияния вашей кожи.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-stone-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light tracking-widest text-stone-800 dark:text-stone-200 uppercase">Ритуал NATURA</h2>
            <p className="text-stone-500 mt-4 font-light">3 простых шага к безупречной коже</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-stone-200 -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Очищение", desc: "Удаление загрязнений и подготовка к уходу", img: micellarImg },
              { step: "02", title: "Увлажнение", desc: "Насыщение влагой и активными компонентами", img: moisturizerImg },
              { step: "03", title: "Защита", desc: "Запечатывание влаги и защита от внешних факторов", img: serumImg },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 border border-stone-100 dark:border-neutral-700 flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <span className="text-xl font-serif text-stone-400">{item.step}</span>
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-md hover:shadow-xl transition-shadow duration-500">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-serif font-light mb-3 text-stone-800 dark:text-stone-200">{item.title}</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-stone-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-800 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-stone-500 dark:text-neutral-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={productsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-white">
              Популярные товары
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full ${activeCategory === cat ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`button-category-${cat.toLowerCase()}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden border-0 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-shadow" data-testid={`card-product-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-neutral-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    {product.tag && (
                      <Badge className={`absolute top-3 left-3 border-0 ${
                        product.tag === "Хит" ? "bg-amber-500" :
                        product.tag === "Новинка" ? "bg-emerald-500" :
                        product.tag === "Скидка" ? "bg-rose-500" :
                        "bg-green-600"
                      } text-white`}>
                        {product.tag}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-3 right-3 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${favorites.includes(product.id) ? 'text-rose-500' : 'text-stone-400'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                        if (!favorites.includes(product.id)) {
                          toast({ title: "Добавлено в избранное", description: `${product.name} теперь в вашем списке желаний` });
                        }
                      }}
                      data-testid={`button-favorite-${product.id}`}
                    >
                      <Heart className={`w-4 h-4 transition-all duration-300 ${favorites.includes(product.id) ? 'fill-current scale-110' : ''}`} />
                    </Button>
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-white/90 hover:bg-white text-stone-900 border border-stone-200 rounded-full"
                          onClick={() => setSelectedProduct(product)}
                          data-testid={`button-view-details-${product.id}`}
                        >
                          Детали
                        </Button>
                        <Button
                          size="icon"
                          className="bg-rose-500 hover:bg-rose-600 rounded-full"
                          onClick={() => addToCart(product.id)}
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-stone-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-medium text-stone-800 dark:text-white mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-stone-600 dark:text-neutral-400">{product.rating}</span>
                      </div>
                      <span className="text-xs text-stone-400 dark:text-neutral-500">
                        ({product.reviews} отзывов)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-stone-800 dark:text-white">{product.price} р</span>
                      {product.oldPrice && (
                        <span className="text-sm text-stone-400 line-through">{product.oldPrice} р</span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-8 py-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-rose-500 uppercase tracking-widest font-semibold mb-2">{selectedProduct.brand}</p>
                <DialogTitle className="text-2xl font-light mb-4">{selectedProduct.name}</DialogTitle>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-stone-500">({selectedProduct.reviews} отзывов)</span>
                </div>
                <div className="text-2xl font-medium mb-6">{selectedProduct.price} р</div>
                <p className="text-stone-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="space-y-4 mb-8">
                  <div className="text-sm">
                    <span className="font-semibold block mb-1">Активные ингредиенты:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.ingredients?.map(ing => (
                        <Badge key={ing} variant="outline" className="font-normal text-stone-500 border-stone-200">{ing}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-rose-500 hover:bg-rose-600 rounded-full mt-auto"
                  onClick={() => {
                    addToCart(selectedProduct.id);
                    setSelectedProduct(null);
                    toast({ title: "Добавлено", description: `${selectedProduct.name} теперь в корзине` });
                  }}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Добавить в корзину
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <section className="py-24 bg-white dark:bg-neutral-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-rose-500 uppercase tracking-widest text-xs font-semibold mb-4 block">Ингредиенты</span>
              <h2 className="text-4xl font-serif font-light mb-8 text-stone-800 dark:text-stone-200">Сила чистой природы</h2>
              <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-8">
                Мы отбираем только самые эффективные природные компоненты. Каждая капля наших средств наполнена энергией растений, чтобы ваша кожа светилась изнутри.
              </p>
              <div className="space-y-6">
                {[
                  { name: "Экстракт центеллы", desc: "Успокаивает и восстанавливает защитный барьер" },
                  { name: "Масло семян зеленого чая", desc: "Мощный антиоксидант для детокс-эффекта" },
                  { name: "Корейский женьшень", desc: "Тонизирует и замедляет процессы старения" }
                ].map((ing, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-200 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-stone-800 dark:text-stone-200">{ing.name}</h4>
                      <p className="text-sm text-stone-500 font-light">{ing.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="aspect-square rounded-full bg-rose-50 absolute -top-12 -right-12 w-64 h-64 -z-10" />
              <img 
                src={serumImg} 
                alt="Natural Ingredients" 
                className="w-full h-auto rounded-3xl shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-rose-50 dark:bg-rose-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-white mb-4">
            Подпишитесь на рассылку
          </h2>
          <p className="text-stone-600 dark:text-neutral-400 mb-6">
            Получите скидку 15% на первый заказ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Ваш email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 rounded-full"
              data-testid="input-newsletter"
            />
            <Button className="bg-rose-500 hover:bg-rose-600 rounded-full px-8" onClick={handleNewsletter} data-testid="button-newsletter">
              Подписаться
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white dark:bg-neutral-950 border-t border-stone-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xl font-light tracking-widest text-stone-800 dark:text-white">
              NATURA
            </span>
            <p className="text-sm text-stone-500 dark:text-neutral-400">
              Демо-сайт от WebStudio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
