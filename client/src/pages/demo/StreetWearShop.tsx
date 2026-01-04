import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame, Heart, Menu, Truck, CreditCard, RefreshCw, ArrowLeft, Plus, X, Minus, Check, Search, ChevronDown, User, Home, Grid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBreadcrumbSchema } from "@/lib/useBreadcrumbSchema";
import { useIsMobile } from "@/hooks/use-mobile";
import heroImg from "@assets/generated_images/streetwear_hero_banner_dark.webp";
import generatedVideo from "@assets/generated_videos/streetwear_fashion_urban_cinematic_video.mp4";
import hoodieImg from "@assets/generated_images/black_oversized_hoodie_product.webp";
import tshirtImg from "@assets/generated_images/black_t-shirt_product_photo.webp";
import cargoImg from "@assets/generated_images/black_cargo_pants_product.webp";
import bomberImg from "@assets/generated_images/black_bomber_jacket_product.webp";
import bagImg from "@assets/generated_images/black_crossbody_bag_product.webp";
import beanieImg from "@assets/generated_images/black_beanie_hat_product.webp";

const products = [
  {
    id: 1,
    name: "Худи SHADOW Oversize",
    brand: "ТЕНЕВОЙ",
    price: 5990,
    oldPrice: 7490,
    image: hoodieImg,
    tag: "SALE",
    sizes: ["S", "M", "L", "XL"],
    category: "Худи и свитшоты",
    description: "Лимитированная серия худи в стиле оверсайз. Выполнено из плотного футера трехнитки с начесом. Высокое качество пошива и материалов обеспечивает комфорт и долговечность.",
  },
  {
    id: 2,
    name: "Футболка БАЗОВАЯ Чёрная",
    brand: "УЛИЦА",
    price: 2490,
    image: tshirtImg,
    tag: "Хит",
    sizes: ["M", "L", "XL"],
    category: "Футболки",
    description: "Классическая футболка прямого кроя. 100% хлопок, плотность 210г/м. Идеально подходит для повседневной носки.",
  },
  {
    id: 3,
    name: "Карго ТАКТИК с карманами",
    brand: "НОРД",
    price: 6990,
    image: cargoImg,
    sizes: ["S", "M", "L"],
    category: "Брюки",
    description: "Функциональные брюки-карго с множеством карманов. Износостойкий материал с водоотталкивающей пропиткой.",
  },
  {
    id: 4,
    name: "Бомбер ПИЛОТ Classic",
    brand: "УЛИЦА",
    price: 9990,
    oldPrice: 12990,
    image: bomberImg,
    tag: "SALE",
    sizes: ["M", "L", "XL", "XXL"],
    category: "Куртки",
    description: "Классический авиационный бомбер. Утеплитель позволяет носить куртку до -5 градусов.",
  },
  {
    id: 5,
    name: "Сумка ПАТРУЛЬ Tactical",
    brand: "ТЕНЕВОЙ",
    price: 2990,
    image: bagImg,
    tag: "New",
    sizes: ["ONE SIZE"],
    category: "Аксессуары",
    description: "Тактическая сумка через плечо. Вместительные отделения и надежная фурнитура.",
  },
  {
    id: 6,
    name: "Шапка МОРОЗ Beanie",
    brand: "НОРД",
    price: 1490,
    image: beanieImg,
    sizes: ["ONE SIZE"],
    category: "Аксессуары",
    description: "Теплая шапка бини из мягкой шерсти с добавлением акрила. Хорошо держит форму.",
  },
];

const categories = [
  { name: "Все", count: 48 },
  { name: "Худи и свитшоты", count: 12 },
  { name: "Футболки", count: 18 },
  { name: "Брюки", count: 8 },
  { name: "Куртки", count: 6 },
  { name: "Аксессуары", count: 14 },
];

const brands = ["ТЕНЕВОЙ", "УЛИЦА", "НОРД", "БЕТОН", "РАЙОН"];

const features = [
  { icon: Truck, title: "Доставка по всей России", desc: "Курьером до двери" },
  { icon: CreditCard, title: "Оплата частями", desc: "Без процентов" },
  { icon: RefreshCw, title: "Возврат 14 дней", desc: "Без лишних вопросов" },
];

export default function StreetWearShop() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", email: "" });
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quickSizes, setQuickSizes] = useState<Record<number, string>>({});
  const [flyer, setFlyer] = useState<{ id: number; x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "new">("name");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const productsRef = useRef<HTMLElement>(null);
  const brandsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useDocumentMeta({
    title: "SHADOWSTREET — Streetwear магазин | Худи, бомберы, карго",
    description: "Интернет-магазин уличной моды. Худи, футболки, карго, бомберы, аксессуары. Доставка по России, оплата частями, возврат 14 дней.",
    keywords: "streetwear, худи, одежда, бомбер, карго, интернет-магазин, уличная мода",
    ogTitle: "SHADOWSTREET — Streetwear магазин | Дизайн от MP.WebStudio",
    ogDescription: "Современная уличная мода, качественные материалы, быстрая доставка",
    ogImage: "https://mp-webstudio.ru/og-image.png",
    ogUrl: "https://mp-webstudio.ru/demo/streetwear",
    canonical: "https://mp-webstudio.ru/demo/streetwear"
  });

  useBreadcrumbSchema([
    { name: "MP.WebStudio", url: "https://mp-webstudio.ru/" },
    { name: "Портфолио", url: "https://mp-webstudio.ru/#portfolio" },
    { name: "SHADOWSTREET", url: "https://mp-webstudio.ru/demo/streetwear" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCart = (id: number, e?: React.MouseEvent) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setFlyer({ id, x: rect.left, y: rect.top });
      setTimeout(() => setFlyer(null), 800);
    }
    
    // Luxury Haptic-like feedback for mobile
    if (isMobile && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
    
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const toggleFavorite = (id: number) => {
    // Subtle haptic for favorites
    if (isMobile && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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

  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    product: products.find(p => p.id === Number(id))!,
    quantity: qty
  })).filter(c => c.product);

  const favoriteItems = favorites.map(id => products.find(p => p.id === id)!).filter(Boolean);

  const cartTotal = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = activeCategory === "Все" || p.category === activeCategory;
      const matchesBrand = !activeBrand || p.brand === activeBrand;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchesCategory && matchesBrand && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "new":
          return b.id - a.id;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBrands = () => brandsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFooter = () => footerRef.current?.scrollIntoView({ behavior: "smooth" });
  
  const handleNavClick = (item: string) => {
    setMobileMenuOpen(false);
    if (item === "Каталог") scrollToProducts();
    else if (item === "Бренды") scrollToBrands();
    else if (item === "SALE") {
      setActiveCategory("Все");
      scrollToProducts();
      toast({ title: "Раздел SALE", description: "Скидки на избранные товары!" });
    }
    else if (item === "О нас") scrollToFooter();
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
      setLocation("/demo/streetwear/success");
    }, 1500);
  };

  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");
  const { scrollY } = useScroll();
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      const direction = latest > lastScrollY.current ? "down" : "up";
      if (latest > 100 && direction === "down") setShowNav(false);
      else setShowNav(true);
      lastScrollY.current = latest;
    });
  }, [scrollY]);

  // Performance optimization: Prevent heavy background processes on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overscrollBehavior = 'none';
    }
    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-24 md:pb-0">
      {/* Luxury Floating Action Bar (Mobile Only) */}
      <AnimatePresence>
        {isMobile && showNav && (
          <motion.div
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-[400px]"
          >
            <div className="bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl shadow-black/50">
              <button
                onClick={() => { setActiveTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all ${activeTab === "home" ? "text-amber-500" : "text-neutral-400"}`}
              >
                <Home className={`w-5 h-5 ${activeTab === "home" ? "scale-110" : ""}`} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Главная</span>
              </button>
              
              <button
                onClick={() => { setActiveTab("catalog"); scrollToProducts(); }}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all ${activeTab === "catalog" ? "text-amber-500" : "text-neutral-400"}`}
              >
                <Grid className={`w-5 h-5 ${activeTab === "catalog" ? "scale-110" : ""}`} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Магазин</span>
              </button>

              <div className="relative -top-6">
                <button
                  onClick={() => setCartOpen(true)}
                  className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-90 transition-transform border-4 border-neutral-950"
                >
                  <ShoppingCart className="w-6 h-6 text-black" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-amber-500">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => setFavoritesOpen(true)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all ${favoritesOpen ? "text-amber-500" : "text-neutral-400"}`}
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-amber-500/20 text-amber-500" : ""}`} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Избранное</span>
                {favorites.length > 0 && (
                  <span className="absolute top-2 right-1/4 w-4 h-4 bg-amber-500 text-black text-[8px] font-black rounded-full flex items-center justify-center border border-neutral-950">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setProfileOpen(true)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all ${profileOpen ? "text-amber-500" : "text-neutral-400"}`}
              >
                <User className={`w-5 h-5 ${profileOpen ? "scale-110" : ""}`} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Профиль</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {flyer && (
        <motion.div
          initial={{ x: flyer.x, y: flyer.y, scale: 1, opacity: 1 }}
          animate={{ 
            x: window.innerWidth - 100, 
            y: 20, 
            scale: 0.2, 
            opacity: 0 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed z-50 pointer-events-none"
        >
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <ShoppingCart className="text-black" />
          </div>
        </motion.div>
      )}
      <Dialog open={!!selectedProduct} onOpenChange={() => { setSelectedProduct(null); setSelectedSize(null); }}>
        <DialogContent className="max-w-4xl w-[95vw] md:w-full p-0 bg-neutral-900 border-neutral-800 overflow-hidden">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[80vh]">
              {/* Image Section */}
              <div className="w-full md:w-3/5 h-[45vh] md:h-auto bg-neutral-950 relative overflow-hidden group flex items-center justify-center">
                <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain md:object-cover object-center"
                />
                {selectedProduct.tag && (
                  <Badge className="absolute top-4 left-4 bg-amber-500 text-black font-black px-3 py-1 rounded-none border-none z-10">
                    {selectedProduct.tag}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none" />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-5 md:p-8 flex flex-col bg-neutral-900 overflow-y-auto">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">{selectedProduct.brand}</p>
                    <div className="flex gap-2">
                       <Badge variant="outline" className="text-[8px] border-neutral-800 text-neutral-500 uppercase">{selectedProduct.category}</Badge>
                    </div>
                  </div>
                  <DialogTitle className="text-white text-xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-2">
                    {selectedProduct.name}
                  </DialogTitle>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                      {selectedProduct.price.toLocaleString()} р
                    </span>
                    {selectedProduct.oldPrice && (
                      <span className="text-sm md:text-lg text-neutral-600 line-through font-bold">
                        {selectedProduct.oldPrice.toLocaleString()} р
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-neutral-800 w-full mb-5" />
                
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Выберите размер</h4>
                    <button className="text-[9px] text-neutral-500 hover:text-white underline font-bold uppercase tracking-tighter transition-colors">Таблица размеров</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className={`min-w-[3.5rem] h-10 md:h-12 rounded-none border-neutral-800 font-black transition-all text-xs ${
                          selectedSize === size 
                            ? "bg-amber-500 text-black border-amber-500" 
                            : "text-neutral-400 hover:border-neutral-600 hover:text-white bg-transparent"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-3">Описание</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                    {selectedProduct.description || `Эксклюзивная модель от ${selectedProduct.brand}. Выполнено из высококачественных материалов, обеспечивающих комфорт и долговечность в городских условиях.`}
                  </p>
                </div>

                <div className="mt-auto grid grid-cols-5 gap-3 pt-4">
                  <Button
                    className="col-span-4 h-12 md:h-14 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-none text-xs md:text-sm shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all"
                    disabled={!selectedSize}
                    onClick={(e) => {
                      addToCart(selectedProduct.id, e);
                      setSelectedProduct(null);
                      setSelectedSize(null);
                      toast({ 
                        title: "ДОБАВЛЕНО В КОРЗИНУ", 
                        description: `${selectedProduct.name} (${selectedSize})` 
                      });
                    }}
                  >
                    {selectedSize ? (
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        ДОБАВИТЬ В КОРЗИНУ
                      </span>
                    ) : "ВЫБЕРИТЕ РАЗМЕР"}
                  </Button>
                  <Button
                    variant="outline"
                    className={`col-span-1 h-12 md:h-14 rounded-none border-neutral-800 transition-all active:scale-[0.98] ${
                      favorites.includes(selectedProduct.id) ? "text-red-500 border-red-500/30 bg-red-500/5" : "text-white hover:text-red-500 hover:border-red-500/30"
                    }`}
                    onClick={() => toggleFavorite(selectedProduct.id)}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedProduct.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3 h-3 text-amber-500/50" />
                    <span>Быстрая доставка</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 text-amber-500/50" />
                    <span>Легкий возврат</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              Корзина
            </DialogTitle>
          </DialogHeader>
          
          {orderSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Заказ оформлен!</h3>
              <p className="text-neutral-400">Мы свяжемся с вами для подтверждения</p>
            </div>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <p className="text-center text-neutral-400 py-8 font-black uppercase tracking-widest text-xs">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 p-2 bg-neutral-800 border border-neutral-700">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[10px] text-white uppercase truncate">{product.name}</p>
                          <p className="text-xs text-amber-500 font-black">{product.price.toLocaleString()} р</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400" onClick={() => removeFromCart(product.id)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-xs text-white font-black">{quantity}</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400" onClick={() => addToCart(product.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => clearItem(product.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-neutral-700 pt-4 mb-4">
                    <div className="flex justify-between items-center font-black uppercase tracking-tighter">
                      <span className="text-white text-sm">Итого:</span>
                      <span className="text-amber-500 text-lg">{cartTotal.toLocaleString()} р</span>
                    </div>
                  </div>

                  <form onSubmit={handleOrder} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ваше имя</Label>
                      <Input 
                        id="name" 
                        value={orderForm.name} 
                        onChange={(e) => setOrderForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="ИВАН"
                        className="bg-neutral-800 border-neutral-700 text-white rounded-none h-12 uppercase font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Телефон</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        value={orderForm.phone} 
                        onChange={(e) => setOrderForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+7 (999) 000-00-00"
                        className="bg-neutral-800 border-neutral-700 text-white rounded-none h-12 font-bold"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-none shadow-lg shadow-amber-500/10 transition-all">
                      Оформить заказ
                    </Button>
                  </form>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={favoritesOpen} onOpenChange={setFavoritesOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white uppercase tracking-tighter font-black">
              <Heart className="w-5 h-5 text-amber-500 fill-current" />
              Избранное
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {favoriteItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Список пуст</p>
                <Button 
                  variant="link" 
                  className="text-amber-500 text-xs mt-2 font-black uppercase"
                  onClick={() => { setFavoritesOpen(false); scrollToProducts(); }}
                >
                  Перейти к покупкам
                </Button>
              </div>
            ) : (
              favoriteItems.map((product) => (
                <div key={product.id} className="flex items-center gap-4 group">
                  <div className="w-20 h-24 bg-neutral-950 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{product.brand}</p>
                    <h4 className="text-white font-black uppercase text-sm truncate mb-1">{product.name}</h4>
                    <p className="text-white font-black text-sm">{product.price.toLocaleString()} р</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-neutral-500 hover:text-red-500"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="bg-amber-500 text-black hover:bg-amber-600"
                      onClick={() => {
                        setSelectedProduct(product);
                        setFavoritesOpen(false);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-md bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white uppercase tracking-tighter font-black">Профиль клиента</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-amber-500 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-tight text-lg">Гость</h3>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-8">streetwear enthusiast</p>
            
            <div className="w-full space-y-2">
              <div className="p-4 bg-neutral-800/50 border border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Заказов</span>
                <span className="text-white font-black">0</span>
              </div>
              <div className="p-4 bg-neutral-800/50 border border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Бонусные баллы</span>
                <span className="text-amber-500 font-black">500</span>
              </div>
              <div className="p-4 bg-neutral-800/50 border border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Статус</span>
                <Badge className="bg-neutral-700 text-white border-none text-[8px] font-black uppercase">Новичок</Badge>
              </div>
            </div>

            <Button className="w-full mt-8 h-12 bg-neutral-800 text-white hover:bg-neutral-700 rounded-none font-black uppercase tracking-widest text-xs">
              Войти в аккаунт
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/#portfolio">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-9 w-9"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <h1 className="text-xl md:text-2xl font-black tracking-tight shrink-0">
              <span className="text-white">STREET</span>
              <span className="text-amber-500">WEAR</span>
            </h1>
            
            <nav className="hidden lg:flex items-center gap-6">
              {["Каталог", "Бренды", "SALE", "О нас"].map(item => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${item === "SALE" ? "text-red-500 hover:text-red-400" : "text-neutral-400 hover:text-white"}`}
                  data-testid={`link-nav-${item.toLowerCase()}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white hidden sm:flex" data-testid="button-favorites">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white" data-testid="button-cart-trigger">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-neutral-900 border-neutral-800 p-0 overflow-hidden" align="end">
                <div className="p-4 border-b border-neutral-800">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-amber-500" />
                    Корзина ({cartCount})
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto p-2">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-neutral-500 py-8 text-sm">Корзина пуста</p>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center gap-3 p-2 rounded-md bg-neutral-800/50">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate text-white">{product.name}</p>
                            <p className="text-xs text-amber-500">{product.price.toLocaleString()} р x {quantity}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-400" onClick={() => clearItem(product.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="p-4 bg-neutral-800/30 border-t border-neutral-800">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-neutral-400">Итого:</span>
                      <span className="text-sm font-bold text-amber-500">{cartTotal.toLocaleString()} р</span>
                    </div>
                    <Button 
                      className="w-full h-8 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs"
                      onClick={() => setCartOpen(true)}
                    >
                      Оформить заказ
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-neutral-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar/Drawer (replacing previous inline nav) */}
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogContent className="sm:max-w-none w-full h-full m-0 rounded-none bg-neutral-950 border-none p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter text-white leading-none">SHADOW</span>
                  <span className="text-xs font-bold text-amber-500 tracking-[0.2em] leading-none uppercase">Streetwear</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Навигация</h3>
                    <div className="grid gap-2">
                      {["Каталог", "Бренды", "SALE", "О нас"].map((item) => (
                        <button
                          key={item}
                          onClick={() => { handleNavClick(item); setMobileMenuOpen(false); }}
                          className={`text-2xl font-black text-left uppercase tracking-tight transition-colors ${item === "SALE" ? "text-red-500" : "text-white"}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Категории</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat.name}
                          variant={activeCategory === cat.name ? "default" : "outline"}
                          size="sm"
                          className={`rounded-full border-neutral-800 ${activeCategory === cat.name ? "bg-amber-500 text-black" : "text-neutral-400"}`}
                          onClick={() => { setActiveCategory(cat.name); setMobileMenuOpen(false); scrollToProducts(); }}
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5">
                <Button className="w-full bg-amber-500 text-black font-black uppercase py-6" onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}>
                  Корзина ({cartCount})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img 
          src={heroImg} 
          alt="Streetwear" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <Badge className="mb-4 bg-amber-500 text-black border-0 font-bold">
              НОВАЯ КОЛЛЕКЦИЯ 2024
            </Badge>
            <h2 className="text-4xl md:text-7xl font-black leading-none mb-6">
              РОССИЙСКИЙ
              <br />
              <span className="text-amber-500">СТРИТВИР</span>
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Лучшие российские бренды уличной одежды. Оригинальный дизайн, качественные материалы, честные цены.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold" onClick={scrollToProducts} data-testid="button-shop-now">
                Смотреть каталог
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={scrollToBrands} data-testid="button-brands">
                Бренды
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden md:block absolute right-0 top-[0%] -translate-y-1/2 w-[280px] lg:w-[320px] z-10"
          >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl shadow-amber-500/20 group bg-neutral-900">
              <video
                src={generatedVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-amber-600/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="space-y-1">
                  <Badge className="bg-amber-500 text-black border-0 text-[10px]">LOOKBOOK 2024</Badge>
                  <p className="text-xs font-bold text-white">Уличная эстетика в движении</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 border-b border-neutral-800 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-amber-500/50 transition-colors duration-500 flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-[11px] md:text-xs font-black uppercase tracking-widest text-white leading-none mb-1">{feature.title}</h3>
                  <p className="text-[9px] md:text-[10px] text-neutral-500 font-bold uppercase tracking-tight leading-none">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section ref={brandsRef} className="py-12 md:py-20 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic">
              Наши <span className="text-amber-500">Бренды</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-[10px] font-black uppercase tracking-widest ${!activeBrand ? "text-amber-500" : "text-neutral-500"}`}
              onClick={() => setActiveBrand(null)}
            >
              Все
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setActiveBrand(activeBrand === brand ? null : brand);
                  scrollToProducts();
                }}
                className={`px-4 py-4 md:px-10 md:py-6 border transition-all duration-500 relative overflow-hidden group ${
                  activeBrand === brand 
                    ? "border-amber-500 text-white" 
                    : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white"
                }`}
              >
                <span className="relative z-10 text-base md:text-2xl font-black italic tracking-tighter uppercase">
                  {brand}
                </span>
                {activeBrand === brand && (
                  <motion.div 
                    layoutId="brand-bg"
                    className="absolute inset-0 bg-amber-500/10"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                <div className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 transition-all duration-500 ${activeBrand === brand ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={productsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0 space-y-6 hidden lg:block">
              <div>
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Категории</h3>
                <div className="flex flex-row lg:flex-col flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`text-left px-4 py-2 rounded-md transition-colors ${
                        activeCategory === cat.name
                          ? "bg-amber-500 text-black font-bold"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                      data-testid={`button-category-${cat.name.toLowerCase()}`}
                    >
                      <span>{cat.name}</span>
                      <span className="ml-2 text-xs opacity-60">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Цена</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-2">От {minPrice.toLocaleString()} р</label>
                    <input
                      type="range"
                      min="0"
                      max="15000"
                      step="500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-2">До {maxPrice.toLocaleString()} р</label>
                    <input
                      type="range"
                      min="0"
                      max="15000"
                      step="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                      placeholder="Поиск товаров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-neutral-800 border-neutral-700 text-white"
                      data-testid="input-search"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 cursor-pointer"
                    data-testid="select-sort"
                  >
                    <option value="name">По названию</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="new">Новинки</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">
                    {activeCategory === "Все" ? "Все товары" : activeCategory}
                  </h2>
                  <span className="text-sm text-neutral-500">{filteredProducts.length} из {products.length}</span>
                </div>
              </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.6 }}
                  >
                    <Card 
                      className="group overflow-hidden border-0 bg-neutral-900 hover:bg-neutral-800 transition-all duration-700 cursor-pointer rounded-none shadow-2xl shadow-black/40 hover:shadow-amber-500/10" 
                      data-testid={`card-product-${product.id}`} 
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-800">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                        
                        {product.tag && (
                          <Badge className={`absolute top-4 left-4 border-0 font-black tracking-tighter rounded-none py-1 px-3 ${
                            product.tag === "SALE" ? "bg-red-600 text-white" :
                            product.tag === "New" ? "bg-white text-black" :
                            "bg-amber-500 text-black"
                          }`}>
                            {product.tag}
                          </Badge>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-500 ${
                            favorites.includes(product.id) 
                              ? "bg-white text-red-500 scale-110 shadow-xl" 
                              : "bg-black/40 text-white hover:bg-white hover:text-black border border-white/10"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                            if (!favorites.includes(product.id)) {
                              toast({ title: "В избранном", description: "Товар добавлен в ваш список желаний" });
                            }
                          }}
                          data-testid={`button-like-${product.id}`}
                        >
                          <Flame className={`w-5 h-5 transition-transform duration-500 ${favorites.includes(product.id) ? "scale-110 fill-current" : "group-hover:rotate-12"}`} />
                        </Button>

                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                          <Button
                            className="w-full bg-white text-black hover:bg-amber-500 font-black uppercase tracking-[0.15em] py-6 rounded-none shadow-2xl"
                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                          >
                            ПОДРОБНЕЕ
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 md:p-6">
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                          <div className="space-y-0.5 md:space-y-1">
                            <p className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">{product.brand}</p>
                            <h3 className="text-xs md:text-xl font-black leading-tight group-hover:text-amber-500 transition-colors uppercase tracking-tight line-clamp-2 md:line-clamp-none">{product.name}</h3>
                          </div>
                        </div>
                        
                        {/* Quick Size Selection - Mobile Friendly */}
                        <div className="mb-3 md:mb-4">
                          <p className="text-[8px] md:text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-1.5 md:mb-3">Размеры</p>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {product.sizes.map(size => (
                              <button
                                key={size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickSizes(prev => ({ ...prev, [product.id]: size }));
                                }}
                                className={`text-[8px] md:text-[11px] px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-none border transition-all duration-300 font-black tracking-tighter ${
                                  quickSizes[product.id] === size 
                                    ? "bg-amber-500 border-amber-500 text-black scale-105" 
                                    : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-sm md:text-2xl font-black tracking-tighter text-white">{product.price.toLocaleString()} р</span>
                            {product.oldPrice && (
                              <span className="text-[9px] md:text-sm text-neutral-600 line-through font-bold tracking-tighter">{product.oldPrice.toLocaleString()} р</span>
                            )}
                          </div>
                          <Button
                            size="icon"
                            className={`w-7 h-7 md:w-12 md:h-12 rounded-none transition-all duration-500 ${
                              quickSizes[product.id] 
                                ? "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20" 
                                : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                            }`}
                            disabled={!quickSizes[product.id]}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product.id, e);
                              setQuickSizes(prev => {
                                const next = { ...prev };
                                delete next[product.id];
                                return next;
                              });
                              toast({ 
                                title: "ДОБАВЛЕНО В КОРЗИНУ", 
                                description: `${product.name} [РАЗМЕР: ${quickSizes[product.id]}]` 
                              });
                            }}
                            data-testid={`button-add-cart-${product.id}`}
                          >
                            <Plus className={`w-3.5 h-3.5 md:w-5 md:h-5 ${quickSizes[product.id] ? "animate-pulse" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={footerRef} className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">
            Подпишись на <span className="text-amber-500">Telegram</span>
          </h2>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">
            Скидки, новинки и эксклюзивные дропы первыми. Никакого спама.
          </p>
          <Button size="lg" className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold" data-testid="button-telegram">
            Подписаться на канал
          </Button>
        </div>
      </section>

      <footer className="py-12 bg-black border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-black">
              <span className="text-white">STREET</span>
              <span className="text-amber-500">WEAR</span>
            </div>
            <p className="text-sm text-neutral-500">
              Демо-сайт от WebStudio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
