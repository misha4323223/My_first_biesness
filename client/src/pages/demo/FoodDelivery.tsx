import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, MapPin, Phone, Star, Flame, Leaf, ChefHat, Truck, ArrowLeft, ShoppingCart, Plus, Minus, X, Check, CreditCard, Wallet, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import foodHeroImg from "@assets/generated_images/asian_food_arrangement_table.webp";
import tomYumImg from "@assets/generated_images/tom_yum_shrimp_soup.webp";
import padThaiImg from "@assets/generated_images/pad_thai_chicken_noodles.webp";
import greenCurryImg from "@assets/generated_images/green_curry_coconut_milk.webp";
import springRollsImg from "@assets/generated_images/spring_rolls_crispy_vietnamese.webp";

const categories = [
  { id: "all", name: "Все блюда" },
  { id: "soups", name: "Супы" },
  { id: "noodles", name: "Лапша" },
  { id: "vegan", name: "Веган" },
];

const menuItems = [
  {
    id: 1,
    name: "Том Ям с креветками",
    description: "Острый тайский суп с креветками, грибами и лемонграссом",
    price: 590,
    image: tomYumImg,
    tags: ["острое", "хит"],
    calories: 280,
    category: "soups",
  },
  {
    id: 2,
    name: "Пад Тай с курицей",
    description: "Рисовая лапша с курицей, арахисом и ростками бамбука",
    price: 450,
    image: padThaiImg,
    tags: ["популярное"],
    calories: 520,
    category: "noodles",
  },
  {
    id: 3,
    name: "Зелёный карри",
    description: "Нежное куриное филе в кокосовом молоке с овощами",
    price: 520,
    image: greenCurryImg,
    tags: ["веган"],
    calories: 380,
    category: "vegan",
  },
  {
    id: 4,
    name: "Спринг роллы",
    description: "Хрустящие роллы с овощами и соусом sweet chili",
    price: 320,
    image: springRollsImg,
    tags: ["веган", "лёгкое"],
    calories: 180,
    category: "vegan",
  },
];

const reviews = [
  {
    id: 1,
    name: "Мария К.",
    rating: 5,
    text: "Невероятно вкусная еда! Доставили за 25 минут. Всё очень свежее и горячее. Обязательно закажу ещё!",
    avatar: "МК",
  },
  {
    id: 2,
    name: "Иван П.",
    rating: 5,
    text: "Том Ям просто восхитительный, как в настоящем тайском ресторане. Буду постоянным клиентом!",
    avatar: "ИП",
  },
  {
    id: 3,
    name: "Анна М.",
    rating: 5,
    text: "Отличное меню для веганов. Спринг роллы получились хрустящими. Спасибо за быструю доставку!",
    avatar: "АМ",
  },
];

const paymentMethods = [
  { icon: CreditCard, name: "Карта" },
  { icon: Wallet, name: "Электронный кошелек" },
  { icon: DollarSign, name: "Наличные" },
];

const features = [
  { icon: Truck, title: "Быстрая доставка", desc: "от 30 минут" },
  { icon: ChefHat, title: "Свежие продукты", desc: "готовим при заказе" },
  { icon: Leaf, title: "Веган меню", desc: "большой выбор" },
];

export default function FoodDelivery() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const menuRef = useRef<HTMLElement>(null);

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  useDocumentMeta({
    title: "FoodFlow — Доставка тайской еды в Туле | Быстро и вкусно",
    description: "Заказывайте свежую тайскую еду с доставкой за 30 минут. Том Ям, Пад Тай, Карри. Меню с калориями. Веган опции.",
    keywords: "доставка еды, тайская кухня, доставка в Туле, суши, лапша, веган меню",
    ogTitle: "FoodFlow — Доставка еды | Дизайн от MP.WebStudio",
    ogDescription: "Быстрая доставка, свежие продукты, веган меню. Попробуйте тайскую кухню прямо сейчас!",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/food-delivery",
    canonical: "https://mp-webstudio.ru/demo/food-delivery"
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "FoodFlow", url: "https://mp-webstudio.ru/demo/food-delivery" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    item: menuItems.find(m => m.id === Number(id))!,
    quantity: qty
  })).filter(c => c.item);

  const cartTotal = cartItems.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone || !orderForm.address) return;
    setOrderSuccess(true);
    setTimeout(() => {
      setCartOpen(false);
      setOrderSuccess(false);
      setCart({});
      setOrderForm({ name: "", phone: "", address: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 dark:from-neutral-950 dark:to-neutral-900">
      <Link href="/#portfolio" className="fixed top-3 left-4 md:top-2 md:left-6 z-[100]">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-xl md:rounded-2xl w-10 h-10 md:w-14 md:h-14 hover:bg-orange-500 hover:border-orange-500 transition-all shadow-2xl"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
      </Link>

      {cartCount > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-lg" onClick={() => setCartOpen(true)} data-testid="button-view-cart">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Корзина ({cartCount}) — {cartTotal} р
          </Button>
        </div>
      )}

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Ваш заказ
            </DialogTitle>
          </DialogHeader>
          
          {orderSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Заказ принят!</h3>
              <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cartItems.map(({ item, quantity }) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-sm text-orange-500">{item.price * quantity} р</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => addToCart(item.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => clearItem(item.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого:</span>
                      <span className="text-orange-500">{cartTotal} р</span>
                    </div>
                    {cartTotal < 1000 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        До бесплатной доставки: {1000 - cartTotal} р
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleOrder} className="space-y-3">
                    <div>
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input 
                        id="name" 
                        value={orderForm.name} 
                        onChange={(e) => setOrderForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Иван"
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
                      <Label htmlFor="address">Адрес доставки</Label>
                      <Input 
                        id="address" 
                        value={orderForm.address} 
                        onChange={(e) => setOrderForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="ул. Примерная, д. 1, кв. 10"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                      Оформить заказ
                    </Button>
                  </form>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <header className="relative min-h-[60vh] md:h-[80vh] flex items-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={foodHeroImg} 
            alt="Premium Food" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 pl-12 md:pl-16 relative z-50">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">Food<span className="text-orange-500">Flow</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm tracking-wider uppercase relative z-50">
            <button onClick={scrollToMenu} className="hover:text-orange-500 transition-all hover:scale-110">Меню</button>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Доставка 30 мин
            </span>
          </div>
        </nav>

        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 w-full pt-12 md:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-4 md:mb-8 leading-[1] md:leading-[0.9] tracking-tighter uppercase italic">
              Вкус, который <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">вдохновляет</span>
            </h1>
            <p className="text-base md:text-xl text-white/60 mb-6 md:mb-10 max-w-xl font-medium leading-relaxed">
              Авторская азиатская кухня с доставкой. Мы используем только фермерские продукты и аутентичные специи.
            </p>
            <div className="flex flex-wrap gap-4 items-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Открыты для заказов</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg font-bold shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 active:scale-95 group w-full sm:w-auto" 
                onClick={scrollToMenu}
              >
                Заказать сейчас
                <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
              </Button>
              <div className="flex items-center gap-4 px-5 py-3 md:py-0 md:px-6 border border-white/10 rounded-xl md:rounded-2xl backdrop-blur-sm bg-white/5 w-full sm:w-auto">
                <div className="flex -space-x-3">
                  {['МД', 'АК', 'МС'].map((initials, i) => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white uppercase tracking-tighter">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] md:text-xs text-white/60">
                  <div className="flex items-center gap-1 text-orange-400 font-bold">
                    <Star className="w-3 h-3 fill-current" /> 4.9
                  </div>
                  500+ заказов сегодня
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="py-8 md:py-12 -mt-6 md:-mt-8 relative z-20 bg-gradient-to-b from-orange-500/15 to-white dark:from-orange-900/20 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-white dark:bg-neutral-800 border-0 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base text-foreground">{feature.title}</h3>
                      <p className="text-[10px] md:text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={menuRef} className="py-12 md:py-24 bg-gradient-to-b from-white to-orange-50 dark:from-neutral-950 dark:to-orange-950/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4 tracking-tight">
              Популярные блюда
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Выберите из нашего меню или соберите свой заказ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex overflow-x-auto pb-4 mb-8 md:mb-10 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center gap-2"
          >
            {categories.map(cat => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                className={`whitespace-nowrap rounded-full px-5 py-1 text-xs md:text-sm transition-all ${
                  selectedCategory === cat.id ? "bg-orange-500 hover:bg-orange-600 border-0 shadow-md shadow-orange-500/20" : "bg-white dark:bg-neutral-900"
                }`}
                data-testid={`button-filter-${cat.id}`}
              >
                {cat.name}
              </Button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <div className="group relative bg-white dark:bg-neutral-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-neutral-100 dark:border-neutral-800 flex flex-col h-full" data-testid={`card-menu-${item.id}`}>
                  <div className="h-48 md:h-64 overflow-hidden relative">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2">
                      {item.tags.map(tag => (
                        <Badge
                          key={tag}
                          className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 border-0 shadow-lg ${
                            tag === "острое" ? "bg-red-500" :
                            tag === "хит" ? "bg-orange-500" :
                            tag === "веган" ? "bg-green-500" :
                            "bg-blue-500"
                          } text-white`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end transform md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 md:px-3 md:py-1 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 md:w-3 md:h-3 text-orange-400 fill-orange-400" />
                        <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-tighter">{item.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                      <h3 className="text-base md:text-xl font-black text-neutral-900 dark:text-white leading-tight uppercase italic">{item.name}</h3>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mb-4 md:mb-8 line-clamp-2 font-medium italic">"{item.description}"</p>
                    
                    <div className="mt-auto flex items-center justify-between gap-3 md:gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-black tracking-widest mb-0.5">Price</span>
                        <span className="text-lg md:text-2xl font-black text-orange-500 tracking-tighter italic">{item.price} р</span>
                      </div>
                      
                      {cart[item.id] > 0 ? (
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 md:h-8 md:w-8 rounded-lg hover:bg-white dark:hover:bg-neutral-700 shadow-sm" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          </Button>
                          <span className="font-black italic text-sm md:text-lg w-4 text-center">{cart[item.id]}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-md" 
                            onClick={() => addToCart(item.id)}
                          >
                            <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          className="bg-neutral-900 dark:bg-white dark:text-neutral-950 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white rounded-xl md:rounded-2xl h-10 md:h-12 px-4 md:px-6 transition-all active:scale-90 shadow-lg shadow-black/5"
                          onClick={() => addToCart(item.id)}
                          data-testid={`button-add-cart-${item.id}`}
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                          <span className="font-bold text-xs md:text-sm uppercase tracking-wider">Купить</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-950/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Отзывы клиентов</h2>
            <p className="text-sm md:text-base text-muted-foreground">Вот что говорят наши постоянные клиенты</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-white dark:bg-neutral-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl relative border border-neutral-100 dark:border-neutral-800">
                  <div className="absolute top-0 right-6 md:right-10 -translate-y-1/2">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-2xl overflow-hidden">
                      <div className="text-lg md:text-2xl font-black text-white dark:text-neutral-900 italic uppercase tracking-tighter">
                        {review.avatar}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4 md:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-neutral-200'}`} />
                    ))}
                  </div>
                  
                  <h4 className="text-lg md:text-xl font-black text-neutral-900 dark:text-white mb-2 uppercase italic tracking-tight">{review.name}</h4>
                  <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic line-clamp-4">
                    "{review.text}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white/10 blur-3xl -mr-24 -mt-24 md:-mr-48 md:-mt-48 rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-black/10 blur-3xl -ml-16 -mb-16 md:-ml-32 md:-mb-32 rounded-full" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 uppercase italic leading-tight tracking-tighter">
                  Готовы к <br />
                  <span className="text-black/30">вкусному</span> ужину?
                </h2>
                <p className="text-sm md:text-lg text-white/80 mb-6 md:mb-10 font-medium italic">
                  Закажите сейчас и получите скидку 10% на первый заказ через наше новое мобильное приложение.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-neutral-100 h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg font-black uppercase italic shadow-xl w-full sm:w-auto" onClick={scrollToMenu}>
                    Заказать сейчас
                  </Button>
                </div>
              </div>
              <div className="relative shrink-0">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 md:w-80 md:h-80 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center p-4 md:p-8"
                >
                  <div className="w-full h-full rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <Flame className="w-12 h-12 md:w-24 md:h-24 text-white/20" />
                  </div>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">-10%</div>
                    <div className="text-[8px] md:text-[10px] text-white/60 font-bold uppercase tracking-widest">OFF FIRST ORDER</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-20 bg-neutral-950 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic text-white">Food<span className="text-orange-500">Flow</span></span>
              </div>
              <p className="text-xs md:text-sm text-neutral-500 font-medium italic leading-relaxed">
                Лучшая тайская кухня в Туле. Свежие продукты, быстрая доставка и любовь к азиатской культуре в каждом блюде.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 md:mb-6 text-orange-500">Меню</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-neutral-400 font-bold italic">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button onClick={() => { setSelectedCategory(cat.id); scrollToMenu(); }} className="hover:text-white transition-colors uppercase tracking-tight">
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 md:mb-6 text-orange-500">Контакты</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-neutral-400 font-bold italic">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-500" />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  г. Тула, пр-т Ленина, 1
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-orange-500" />
                  10:00 - 23:00
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 md:mb-6 text-orange-500">Приложение</h4>
              <p className="text-xs md:text-sm text-neutral-500 mb-6 font-medium italic">Скоро в App Store и Google Play</p>
              <div className="flex flex-col gap-3">
                <div className="h-12 px-5 rounded-xl border border-white/10 flex items-center gap-3 bg-white/5 grayscale">
                  <div className="w-6 h-6 bg-white/20 rounded" />
                  <div className="text-[10px] font-bold">App Store</div>
                </div>
                <div className="h-12 px-5 rounded-xl border border-white/10 flex items-center gap-3 bg-white/5 grayscale">
                  <div className="w-6 h-6 bg-white/20 rounded" />
                  <div className="text-[10px] font-bold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-neutral-600 font-black uppercase tracking-[0.3em]">
            <div>© 2026 FOODFLOW. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-6 md:gap-8">
              <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
