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
      <Link href="/#portfolio" className="fixed top-4 left-4 z-[100]">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-orange-300/30 dark:border-white/20 hover:bg-white/90 dark:hover:bg-black/90"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-5 h-5" />
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

      <header className="relative h-[80vh] flex items-center overflow-hidden bg-neutral-950">
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
        
        <nav className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 pl-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Food<span className="text-orange-500">Flow</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm tracking-wider uppercase">
            <button onClick={scrollToMenu} className="hover:text-orange-500 transition-all hover:scale-110">Меню</button>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Доставка 30 мин
            </span>
          </div>
        </nav>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Открыты для заказов</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase italic">
              Вкус, который <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">вдохновляет</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-xl font-medium leading-relaxed">
              Авторская азиатская кухня с доставкой. Мы используем только фермерские продукты и аутентичные специи.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 active:scale-95 group" 
                onClick={scrollToMenu}
              >
                Заказать сейчас
                <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
              </Button>
              <div className="flex items-center gap-4 px-6 border border-white/10 rounded-2xl backdrop-blur-sm bg-white/5">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white">
                      {i === 1 ? 'JD' : i === 2 ? 'AK' : 'MS'}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-white/60">
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

      <section className="py-12 -mt-8 relative z-20 bg-gradient-to-b from-orange-500/15 to-white dark:from-orange-900/20 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-6 bg-white dark:bg-neutral-800 border-0 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={menuRef} className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50 dark:from-neutral-950 dark:to-orange-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Популярные блюда
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Выберите из нашего меню или соберите свой заказ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {categories.map(cat => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={selectedCategory === cat.id ? "bg-orange-500 hover:bg-orange-600 border-0" : ""}
                data-testid={`button-filter-${cat.id}`}
              >
                {cat.name}
              </Button>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-neutral-100 dark:border-neutral-800 flex flex-col h-full" data-testid={`card-menu-${item.id}`}>
                  <div className="h-64 overflow-hidden relative">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.tags.map(tag => (
                        <Badge
                          key={tag}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-0 shadow-lg ${
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
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{item.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-black text-neutral-900 dark:text-white leading-tight uppercase italic">{item.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 line-clamp-2 font-medium italic">"{item.description}"</p>
                    
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-400 uppercase font-black tracking-widest mb-1">Price</span>
                        <span className="text-2xl font-black text-orange-500 italic">{item.price} ₽</span>
                      </div>
                      
                      {cart[item.id] > 0 ? (
                        <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-xl hover:bg-white dark:hover:bg-neutral-700 shadow-sm" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-black italic text-lg w-4 text-center">{cart[item.id]}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-xl bg-orange-500 text-white hover:bg-orange-600 shadow-md" 
                            onClick={() => addToCart(item.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="h-14 w-14 rounded-2xl bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-orange-500 hover:text-white transition-all duration-500 group/btn" 
                          onClick={() => addToCart(item.id)}
                          data-testid={`button-add-${item.id}`}
                        >
                          <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-500" />
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

      <section className="py-16 bg-gradient-to-b from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-950/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Отзывы клиентов</h2>
            <p className="text-muted-foreground">Вот что говорят наши постоянные клиенты</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-white dark:bg-neutral-900 p-10 rounded-[3rem] shadow-xl relative border border-neutral-100 dark:border-neutral-800">
                  <div className="absolute top-0 right-10 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-3xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-2xl overflow-hidden">
                      <div className="text-2xl font-black text-white dark:text-neutral-900 italic uppercase tracking-tighter">
                        {review.avatar}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-neutral-200'}`} />
                    ))}
                  </div>
                  
                  <h4 className="text-xl font-black text-neutral-900 dark:text-white mb-2 uppercase italic tracking-tight">{review.name}</h4>
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[4rem] p-12 md:p-20 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl -mr-48 -mt-48 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl -ml-32 -mb-32 rounded-full" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic leading-tight tracking-tighter">
                  Готовы к <br />
                  <span className="text-black/30">вкусному</span> ужину?
                </h2>
                <p className="text-white/80 text-lg mb-10 font-medium italic">
                  Закажите сейчас и получите скидку 10% на первый заказ через наше новое мобильное приложение.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-neutral-100 h-16 px-10 rounded-2xl text-lg font-black uppercase italic shadow-xl" onClick={scrollToMenu}>
                    Заказать сейчас
                  </Button>
                </div>
              </div>
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center p-8"
                >
                  <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Flame className="w-24 h-24 text-white opacity-20" />
                  </div>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-3xl p-6 shadow-2xl transform -rotate-12 scale-110">
                    <span className="text-4xl font-black text-orange-500 italic">-10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-neutral-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Food<span className="text-orange-500">Flow</span></span>
              </div>
              <p className="text-neutral-500 max-w-sm mb-8 font-medium italic leading-relaxed">
                Мы создаем не просто еду, а гастрономический опыт, который меняет ваше представление о доставке. Каждое блюдо — это история вкуса.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-orange-500">Навигация</h4>
              <ul className="space-y-4 text-neutral-400 font-bold italic">
                <li><button onClick={scrollToMenu} className="hover:text-white transition-colors">Меню</button></li>
                <li><button className="hover:text-white transition-colors">Доставка</button></li>
                <li><button className="hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-orange-500">Контакты</h4>
              <ul className="space-y-4 text-neutral-400 font-bold italic">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-500" />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  г. Тула, пр. Ленина, 1
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-orange-500" />
                  10:00 — 23:00
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-600 text-xs font-black uppercase tracking-widest">
            <p>© 2026 FOODFLOW. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
            <p>ДИЗАЙН И РАЗРАБОТКА — MP.WEBSTUDIO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
