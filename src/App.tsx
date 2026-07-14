/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { AdminPanel } from './components/AdminPanel';
import { CustomerProfile } from './components/CustomerProfile';
import { FAQView, ContactView, AboutView, PrivacyView, TermsView, NotFoundView } from './components/StaticPages';
import { ShoppingBag, Star, Heart, ArrowRight, ArrowLeft, SlidersHorizontal, ChevronRight, ChevronLeft, Plus, Minus, MessageCircle } from 'lucide-react';
import { Product } from './types';

// MAIN APP RUNNER WITH WRAPPER
export default function App() {
  return (
    <StoreProvider>
      <MainAppLayout />
    </StoreProvider>
  );
}

const MainAppLayout: React.FC = () => {
  const { currentRoute, dir, language, theme } = useStore();

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300`} dir={dir} id="app-container">
      {/* Universal Header */}
      <Navbar />

      {/* Primary Dynamic Content router */}
      <main className="flex-grow">
        <div className="animate-in fade-in duration-300">
          <RouteSelector />
        </div>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

// COMPONENT: ROUTE SELECTOR
const RouteSelector: React.FC = () => {
  const { currentRoute } = useStore();

  switch (currentRoute) {
    case 'home':
      return <HomeScreen />;
    case 'products':
      return <CatalogScreen />;
    case 'product-details':
      return <ProductDetailsScreen />;
    case 'cart':
      return <CartDrawer />;
    case 'wishlist':
      return <WishlistScreen />;
    case 'checkout':
      return <CheckoutPage />;
    case 'profile':
    case 'login':
    case 'orders':
      return <CustomerProfile />;
    case 'admin':
      return <AdminPanel />;
    case 'about':
      return <AboutView />;
    case 'contact':
      return <ContactView />;
    case 'faq':
      return <FAQView />;
    case 'privacy':
      return <PrivacyView />;
    case 'terms':
      return <TermsView />;
    default:
      return <NotFoundView />;
  }
};

// COMPONENT: HOME SCREEN
const HomeScreen: React.FC = () => {
  const { language, t, navigateTo, products, categories, settings } = useStore();

  // --- HERO SLIDER ---
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      titleAr: 'خطواتك نحو الفخامة والتميز',
      titleEn: 'Step into Pure Luxury & Distinction',
      descAr: 'اكتشف تشكيلة الأحذية الراقية المصنوعة يدوياً بأعلى معايير الجودة والراحة.',
      descEn: 'Discover our fine collection of handcrafted premium footwear designed for ultimate comfort and elegance.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
      category: 'sneakers',
    },
    {
      titleAr: 'أناقة الحضور الكلاسيكي الرفيع',
      titleEn: 'The Art of Classic Footwear',
      descAr: 'أحذية جلدية كلاسيكية ورسمية تضفي لمسة من الوقار والجاذبية على مظهرك في كل مناسبة.',
      descEn: 'Premium leather classic shoes that deliver exquisite style, prestige, and timeless durability.',
      image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&q=80&w=1200',
      category: 'formal',
    },
    {
      titleAr: 'مزيج مثالي من الراحة والعصرية',
      titleEn: 'Perfect Blend of Comfort & Trend',
      descAr: 'سنيكرز وأحذية مريحة تناسب نمط حياتك اليومي وحركتك السريعة بأجود الخامات.',
      descEn: 'Modern, lightweight sneakers crafted to complement your dynamic everyday lifestyle with maximum support.',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200',
      category: 'sneakers',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const visibleProducts = products.filter(p => !p.hidden);
  const featuredList = visibleProducts.filter(p => p.featured).slice(0, 4);
  const bestSellersList = visibleProducts.filter(p => p.bestSeller).slice(0, 4);
  const newArrivalsList = visibleProducts.filter(p => p.newArrival).slice(0, 4);

  return (
    <div className="space-y-16 pb-16" id="home-view-container">
      
      {/* 1. HERO SLIDER SCREEN */}
      <section className="relative h-[480px] sm:h-[600px] w-full overflow-hidden bg-zinc-950 text-white" id="home-hero-slider">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Dark background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 z-10" />
            
            <img
              src={slide.image}
              alt={slide.titleEn}
              className="h-full w-full object-cover transition-transform duration-10000 scale-105 group-hover:scale-100"
            />

            {/* Slider Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full text-center sm:text-left rtl:sm:text-right">
                <div className="max-w-2xl space-y-4 sm:space-y-6">
                  <span className="text-[10px] font-black tracking-widest uppercase text-yellow-500 font-mono block">
                    {language === 'ar' ? 'فخامة أتوم الحصرية' : 'AtoM Prestige Curation'}
                  </span>
                  
                  <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase tracking-wide">
                    {language === 'ar' ? slide.titleAr : slide.titleEn}
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg mx-auto sm:mx-0">
                    {language === 'ar' ? slide.descAr : slide.descEn}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                    <button
                      onClick={() => navigateTo('products', { categoryId: slide.category })}
                      className="rounded-xl bg-yellow-600 py-3.5 px-8 text-xs font-bold text-zinc-950 hover:bg-yellow-500 transition-all duration-300 uppercase tracking-wider"
                    >
                      {language === 'ar' ? 'تصفح المجموعة' : 'Explore collection'}
                    </button>
                    <button
                      onClick={() => navigateTo('products')}
                      className="rounded-xl border border-white/30 bg-white/5 backdrop-blur-md py-3.5 px-8 text-xs font-bold text-white hover:bg-white hover:text-zinc-950 transition-all duration-300"
                    >
                      {t('allProducts')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Manual Slides triggers */}
        <button
          onClick={() => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/30 transition rtl:left-auto rtl:right-4"
        >
          {language === 'ar' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setActiveSlide(prev => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/30 transition rtl:right-auto rtl:left-4"
        >
          {language === 'ar' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-6 bg-yellow-500' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES STAGE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="home-categories">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
            {t('featuredCategories')}
          </h2>
          <div className="h-0.5 w-12 bg-yellow-600 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigateTo('products', { categoryId: cat.id })}
              className="group relative h-64 overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.nameEn}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 text-center sm:text-left rtl:sm:text-right">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </h3>
                <span className="text-[10px] font-semibold text-yellow-500 hover:underline mt-1 block">
                  {language === 'ar' ? 'اكتشف الآن ←' : 'Discover Now →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS GRID */}
      {bestSellersList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="home-bestsellers">
          <div className="flex items-baseline justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
              {t('bestSellers')}
            </h2>
            <button
              onClick={() => navigateTo('products')}
              className="text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
              {language === 'ar' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellersList.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. NEW ARRIVALS GRID */}
      {newArrivalsList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="home-newarrivals">
          <div className="flex items-baseline justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
              {t('newArrivals')}
            </h2>
            <button
              onClick={() => navigateTo('products')}
              className="text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
              {language === 'ar' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivalsList.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

// COMPONENT: CATALOG CATALOG
const CatalogScreen: React.FC = () => {
  const { language, t, products, categories, filterCategory, searchQuery, navigateTo } = useStore();

  const [selectedCat, setSelectedCat] = useState<string>(filterCategory || '');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state with global store filters
  useEffect(() => {
    setSelectedCat(filterCategory || '');
  }, [filterCategory]);

  const filteredProducts = products
    .filter(p => !p.hidden)
    .filter(p => {
      // Category check
      if (selectedCat && p.categoryId !== selectedCat) return false;
      // Price check
      if (p.price > maxPrice) return false;
      // Search check
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesAr = p.nameAr.toLowerCase().includes(query) || p.descriptionAr.toLowerCase().includes(query);
        const matchesEn = p.nameEn.toLowerCase().includes(query) || p.descriptionEn.toLowerCase().includes(query);
        if (!matchesAr && !matchesEn) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default featured / unsorted
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="catalog-stage">
      
      {/* Search results banner */}
      {searchQuery && (
        <div className="mb-6 rounded-xl bg-zinc-100 p-4 text-xs font-semibold dark:bg-zinc-900 flex justify-between items-center">
          <span>{t('searchResultFor')}: "{searchQuery}"</span>
          <button onClick={() => navigateTo('products', { query: '' })} className="text-yellow-600 hover:underline">
            {language === 'ar' ? 'إلغاء البحث' : 'Clear search'}
          </button>
        </div>
      )}

      {/* Catalog Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
            {selectedCat ? categories.find(c => c.id === selectedCat)?.nameEn : t('allProducts')}
          </h1>
          <span className="text-xs text-zinc-400 font-medium">({filteredProducts.length} items found)</span>
        </div>

        {/* Filters toggle / sorting */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2 px-4 text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 lg:hidden w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t('filters')}</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white py-2 px-4 text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none w-full sm:w-auto"
          >
            <option value="featured">Default Featured</option>
            <option value="price-asc">{t('priceLowHigh')}</option>
            <option value="price-desc">{t('priceHighLow')}</option>
            <option value="rating">{t('ratingHighLow')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className={`lg:col-span-3 space-y-6 lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            
            {/* Category selection */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">{t('categories')}</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCat('')}
                  className={`text-xs text-left rtl:text-right py-1.5 px-3 rounded-lg font-bold transition ${
                    !selectedCat ? 'bg-yellow-600 text-zinc-950' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {t('allCategories')}
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`text-xs text-left rtl:text-right py-1.5 px-3 rounded-lg font-bold transition ${
                      selectedCat === c.id ? 'bg-yellow-600 text-zinc-950' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {language === 'ar' ? c.nameAr : c.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider filter */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                {language === 'ar' ? 'السعر الأقصى' : 'Max Price'}
              </h3>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-yellow-600"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-bold mt-2">
                <span>500 ج.م</span>
                <span className="text-zinc-900 dark:text-white font-black">{maxPrice.toLocaleString()} ج.م</span>
              </div>
            </div>

          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-zinc-100 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
              <ShoppingBag className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-zinc-400">No offerings match your filter choices.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// COMPONENT: PRODUCT DETAILS
const ProductDetailsScreen: React.FC = () => {
  const { language, t, products, selectedProductId, reviews, addReview, addToCart, navigateTo, categories } = useStore();

  const product = products.find(p => p.id === selectedProductId && !p.hidden);
  if (!product) return <NotFoundView />;

  const category = categories.find(c => c.id === product.categoryId);

  // Gallery viewer state
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');

  // Review Form States
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revText, setRevText] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  const handlePublishReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim()) return;

    addReview(product.id, revName, revRating, revText);
    setRevSuccess(true);
    setRevName('');
    setRevText('');
    setTimeout(() => setRevSuccess(false), 4000);
  };

  const productReviewsList = reviews[product.id] || [];
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="product-details-container">
      
      {/* Grid: Image Gallery & Content details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-800 relative">
            <img src={activeImg} alt={product.nameEn} className="h-full w-full object-cover transition" />
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition ${activeImg === img ? 'border-yellow-600' : 'border-zinc-200 dark:border-zinc-800'}`}
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Details Column */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {category ? (language === 'ar' ? category.nameAr : category.nameEn) : product.categoryId}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white leading-tight">
              {language === 'ar' ? product.nameAr : product.nameEn}
            </h1>
            
            {/* Rating Stars row */}
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-500 font-semibold">
                {product.rating} ({productReviewsList.length} reviews)
              </span>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-zinc-950 dark:text-white">
              {product.price.toLocaleString()} <span className="text-xs font-normal text-zinc-500">{t('currency')}</span>
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-zinc-400 line-through">
                {product.compareAtPrice.toLocaleString()} {t('currency')}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {language === 'ar' ? product.descriptionAr : product.descriptionEn}
          </p>

          {/* Stock Availability indicator */}
          <div className="text-xs font-semibold">
            {product.stock <= 0 ? (
              <span className="text-red-500">❌ {t('outOfStock')}</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-500">⚠️ {language === 'ar' ? `متبقي ${product.stock} فقط في المخزن!` : `Only ${product.stock} left in stock!`}</span>
            ) : (
              <span className="text-green-500">✓ {t('inStock')}</span>
            )}
          </div>

          {/* CTA actions */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              
              {/* Qty counter */}
              <div className="flex items-center border border-zinc-200 rounded-xl px-2.5 py-2.5 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button onClick={() => setQty(prev => Math.max(1, prev - 1))} className="p-1 text-zinc-600 hover:text-yellow-600 dark:hover:text-yellow-400">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold w-8 text-center">{qty}</span>
                <button onClick={() => setQty(prev => Math.min(product.stock, prev + 1))} className="p-1 text-zinc-600 hover:text-yellow-600 dark:hover:text-yellow-400">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, qty);
                  navigateTo('cart');
                }}
                className="flex-1 bg-zinc-950 hover:bg-yellow-600 hover:text-zinc-950 text-white font-bold py-4 px-6 rounded-xl text-xs transition duration-300 flex items-center justify-center gap-2 dark:bg-white dark:text-zinc-950 dark:hover:bg-yellow-400"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{t('addToCart')}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* TABS: Description Details & Customer Reviews */}
      <section className="mt-16 border-t border-zinc-100 dark:border-zinc-800 pt-10" id="product-tabs">
        <div className="flex gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`text-xs uppercase font-black tracking-wider pb-2 border-b-2 transition ${
              activeTab === 'desc' ? 'border-yellow-600 text-zinc-950 dark:text-white' : 'border-transparent text-zinc-400'
            }`}
          >
            {language === 'ar' ? 'تفاصيل ومعلومات إضافية' : 'Boutique Spec Sheet'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-xs uppercase font-black tracking-wider pb-2 border-b-2 transition ${
              activeTab === 'reviews' ? 'border-yellow-600 text-zinc-950 dark:text-white' : 'border-transparent text-zinc-400'
            }`}
          >
            {t('reviews')} ({productReviewsList.length})
          </button>
        </div>

        {/* Tab 1: specifications details */}
        {activeTab === 'desc' && (
          <div className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400 space-y-4 max-w-3xl">
            <p>
              Each AtoM creation is designed, bottled, or stitched with an uncompromising standard of craft. We recommend avoiding direct exposure to heavy heat, maintaining leather with specialized plant balms, and washing fine cotton apparel under cold, gentle loops.
            </p>
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-[11px]">
              <div>
                <span className="font-bold text-zinc-400 block uppercase">Origin</span>
                <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">Republic of Egypt (جمهورية مصر العربية)</span>
              </div>
              <div>
                <span className="font-bold text-zinc-400 block uppercase">Logistics Courier</span>
                <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">Complimentary Bosta / Aramex Express</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews builder */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews display list */}
            <div className="lg:col-span-7 space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {productReviewsList.length === 0 ? (
                <p className="text-xs text-zinc-400">No reviews yet. Be the first to publish one!</p>
              ) : (
                productReviewsList.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-zinc-100 p-4 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-zinc-800 dark:text-zinc-100">{rev.userName}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400' : 'text-zinc-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-zinc-400 block mt-2">
                      {new Date(rev.createdAt).toLocaleDateString(language, {year: 'numeric', month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form */}
            <div className="lg:col-span-5">
              <form onSubmit={handlePublishReview} className="rounded-2xl border border-zinc-100 p-6 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider">{t('writeReview')}</h3>

                {revSuccess && (
                  <div className="rounded-xl bg-green-50 p-3 text-[11px] text-green-600 font-semibold">
                    ✔️ Review published successfully!
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <label className="text-zinc-400 block font-bold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                {/* Rating selection stars */}
                <div className="space-y-1 text-xs">
                  <label className="text-zinc-400 block font-bold">{t('rating')}</label>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((starsNum) => (
                      <button
                        key={starsNum}
                        type="button"
                        onClick={() => setRevRating(starsNum)}
                        className="p-0.5 hover:scale-110 transition"
                      >
                        <Star className={`h-5 w-5 ${starsNum <= revRating ? 'fill-amber-400' : 'text-zinc-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-zinc-400 block font-bold">{t('comment')}</label>
                  <textarea
                    rows={3}
                    required
                    value={revText}
                    onChange={(e) => setRevText(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <button type="submit" className="w-full bg-zinc-950 hover:bg-yellow-600 hover:text-zinc-950 text-white rounded-xl py-3 text-xs font-bold transition duration-300 dark:bg-white dark:text-zinc-950 dark:hover:bg-yellow-400">
                  {t('submitReview')}
                </button>
              </form>
            </div>

          </div>
        )}
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-zinc-100 dark:border-zinc-800 pt-10" id="related-offerings">
          <h2 className="text-lg font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-100 mb-8 text-center sm:text-left rtl:sm:text-right">
            {language === 'ar' ? 'مقتنيات مماثلة قد تنال إعجابك' : 'Other Exquisite Offerings'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

// COMPONENT: WISHLIST VIEW
const WishlistScreen: React.FC = () => {
  const { language, t, wishlist, navigateTo } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center" id="empty-wishlist-view">
        <div className="rounded-full bg-zinc-50 p-6 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 mb-6">
          <Heart className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{t('emptyWishlist')}</h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2 max-w-xs">
          {language === 'ar' ? 'لم تقم بحفظ أي مقتنيات فاخرة للمفضلة بعد.' : 'Save elite boutique listings to view them together.'}
        </p>
        <button
          onClick={() => navigateTo('products')}
          className="mt-8 rounded-xl bg-yellow-600 py-3.5 px-8 text-xs font-bold text-zinc-950 hover:bg-yellow-500 transition duration-300"
        >
          {language === 'ar' ? 'تصفح المعرض الآن' : 'Explore Collections'}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="wishlist-page">
      <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-8">
        {t('wishlist')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
