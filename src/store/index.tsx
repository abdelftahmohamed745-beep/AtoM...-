/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Category, Order, OrderItem, Address, Review, Coupon, WebsiteSettings, TranslationKey } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, DEFAULT_SETTINGS, TRANSLATIONS } from '../constants';
import { supabaseService } from '../services/supabase';
import { resendService } from '../services/resend';
import { shippingService } from '../services/shipping';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Notification {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  read: boolean;
  createdAt: string;
}

interface StoreContextType {
  // Locale & UI
  language: 'ar' | 'en';
  dir: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
  currentRoute: string;
  selectedProductId: string | null;
  searchQuery: string;
  filterCategory: string | null;
  setLanguage: (lang: 'ar' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  navigateTo: (route: string, params?: { productId?: string; query?: string; categoryId?: string }) => void;
  t: (key: TranslationKey) => string;

  // Data Lists
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  settings: WebsiteSettings;
  notifications: Notification[];
  reviews: Record<string, Review[]>;

  // Shopping Actions
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;

  // Coupon Engine
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;

  // User Session & Addresses
  currentUser: User | null;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;

  // Checkout Actions
  placeOrder: (shippingAddress: Address, notes?: string, method?: 'COD' | 'Paymob' | 'Vodafone Cash') => Promise<Order>;

  // Reviews Actions
  addReview: (productId: string, userName: string, rating: number, comment: string) => void;

  // Admin Dashboard Actions
  adminAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  adminUpdateProduct: (id: string, product: Partial<Product>) => void;
  adminDeleteProduct: (id: string) => void;
  adminUpdateOrderStatus: (id: string, status: Order['status']) => void;
  adminUpdateSettings: (settings: WebsiteSettings) => void;
  adminAddCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  adminDeleteCoupon: (id: string) => void;

  // Notification Actions
  markAllNotificationsRead: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Persistent UI States ---
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('atom_lang') as 'ar' | 'en') || 'ar';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('atom_theme') as 'light' | 'dark') || 'light';
  });

  // Navigation state (Simple client router)
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Core Data loaded dynamically from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Client shopping states
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atom_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- Initialize database on mount ---
  useEffect(() => {
    const syncWithDatabase = async () => {
      try {
        // 1. Authenticate cached session
        const dbUser = await supabaseService.getCurrentUser();
        if (dbUser) {
          setCurrentUser(dbUser);
        }

        // 2. Load custom settings from settings table
        const dbSettings = await supabaseService.getSettings();
        if (dbSettings) {
          setSettings(dbSettings);
        }

        // 3. Load live products from Supabase
        const dbProds = await supabaseService.getProducts();
        if (dbProds && dbProds.length > 0) {
          const filtered = dbProds.filter(p => p && p.id && !['1', '2', '3', '4', '5', 'demo-1', 'demo-2', 'placeholder-1', 'placeholder-2'].includes(p.id.toString()));
          setProducts(filtered);
        } else {
          // If unprovisioned, fall back to default design selection minus demo noise
          const cleanFallbacks = INITIAL_PRODUCTS.filter(p => p && p.id && !['1', '2', '3', '4', '5', 'demo-1', 'demo-2', 'placeholder-1', 'placeholder-2'].includes(p.id.toString()));
          setProducts(cleanFallbacks);
        }

        // 4. Load categories
        const dbCats = await supabaseService.getCategories();
        if (dbCats && dbCats.length > 0) {
          setCategories(dbCats);
        }

        // 5. Load coupons
        const dbCoupons = await supabaseService.getCoupons();
        if (dbCoupons && dbCoupons.length > 0) {
          setCoupons(dbCoupons);
        }

        // 6. Load orders
        const dbOrders = await supabaseService.getOrders(dbUser?.role === 'admin' ? undefined : dbUser?.id || undefined);
        setOrders(dbOrders);

        // 7. Load reviews list
        const dbRevs = await supabaseService.getReviews();
        const revMap: Record<string, Review[]> = {};
        dbRevs.forEach(r => {
          if (!revMap[r.productId]) {
            revMap[r.productId] = [];
          }
          revMap[r.productId].push(r);
        });
        setReviews(revMap);

      } catch (err) {
        console.warn('[Store Engine] Supabase synchronization failed, running on robust fallbacks:', err);
      }
    };

    syncWithDatabase();
  }, [currentUser?.id, currentUser?.role]);

  // --- Synchronization Effects to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('atom_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('atom_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('atom_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('product/')) {
          const id = hash.split('/')[1];
          setCurrentRoute('product-details');
          setSelectedProductId(id);
        } else {
          setCurrentRoute(hash);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // --- Context UI Actions ---
  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
  };

  const setTheme = (tMode: 'light' | 'dark') => {
    setThemeState(tMode);
  };

  const navigateTo = (route: string, params?: { productId?: string; query?: string; categoryId?: string }) => {
    setCurrentRoute(route);
    if (params?.productId) {
      setSelectedProductId(params.productId);
      window.location.hash = `product/${params.productId}`;
    } else {
      setSelectedProductId(null);
      window.location.hash = route;
    }

    if (params?.query !== undefined) {
      setSearchQuery(params.query);
    }
    if (params?.categoryId !== undefined) {
      setFilterCategory(params.categoryId);
    }
  };

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[language][key] || key;
  };

  // --- Shopping Logic ---
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = prev.filter(p => p.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      if (currentUser) {
        supabaseService.updateUserWishlist(currentUser.id, updated);
      }
      return updated;
    });
  };

  const applyPromoCode = async (code: string) => {
    setCouponError(null);
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    
    try {
      const coupon = await supabaseService.validateCoupon(code, subtotal);
      if (!coupon) {
        setCouponError(language === 'ar' ? 'كود الخصم غير صحيح أو قيمة الطلب أقل من الحد الأدنى.' : 'Invalid or expired promo code or minimum spend requirement not met.');
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon(coupon);
    } catch {
      // Local fallback
      const localCoupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
      if (localCoupon && subtotal >= localCoupon.minOrderValue) {
        setAppliedCoupon(localCoupon);
      } else {
        setCouponError(language === 'ar' ? 'كود الخصم غير صحيح.' : 'Invalid promo code.');
      }
    }
  };

  const removePromoCode = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // --- Authentication Actions ---
  const login = async (email: string): Promise<boolean> => {
    try {
      const user = await supabaseService.signIn(email);
      setCurrentUser(user);
      
      if (user.role === 'admin') {
        addNotification(
          'دخول مسؤول النظام السريع',
          'Admin Console Sign-in',
          'تم تسجيل الدخول بصلاحيات الإدارة لتحديث المعروضات والإعدادات.',
          'Successfully logged in as administrator to manage portal collections.'
        );
      } else {
        addNotification(
          'مرحباً بعودتك يا ' + user.name,
          'Welcome back, ' + user.name,
          'يسعدنا تصفحك لجديد مقتنيات أتوم الفاخرة.',
          'We are delighted to have you back browsing AtoM offerings.'
        );
      }
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const user = await supabaseService.signUp(email, name, phone);
      setCurrentUser(user);
      addNotification(
        'مرحباً بك يا ' + name,
        'Welcome, ' + name,
        'تم تسجيل وتفعيل حسابك الفاخر كعضو مميز بنجاح.',
        'Your exclusive client profile is verified and active.'
      );
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('atom_current_user');
    navigateTo('home');
  };

  const addAddress = async (newAddr: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const freshAddr: Address = {
      ...newAddr,
      id: Math.random().toString(36).substr(2, 9),
      isDefault: currentUser.addresses.length === 0 ? true : newAddr.isDefault,
    };

    const updatedAddresses = freshAddr.isDefault
      ? currentUser.addresses.map(a => ({ ...a, isDefault: false })).concat(freshAddr)
      : currentUser.addresses.concat(freshAddr);

    const updatedUser = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updatedUser);
    await supabaseService.updateUserAddresses(currentUser.id, updatedAddresses);
  };

  const deleteAddress = async (id: string) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.addresses.filter(a => a.id !== id);
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    const updatedUser = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updatedUser);
    await supabaseService.updateUserAddresses(currentUser.id, updatedAddresses);
  };

  const addNotification = (titleAr: string, titleEn: string, descAr: string, descEn: string) => {
    setNotifications(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        titleAr,
        titleEn,
        descAr,
        descEn,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // --- Checkout Sequence ---
  const placeOrder = async (shippingAddress: Address, notes?: string, method: 'COD' | 'Paymob' | 'Vodafone Cash' = 'COD'): Promise<Order> => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : shippingAddress.isDefault ? 50 : 55;
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discount = appliedCoupon.value;
      }
    }

    const total = subtotal + shippingFee - discount;

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      nameAr: item.product.nameAr,
      nameEn: item.product.nameEn,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images[0],
    }));

    const rawOrder: Omit<Order, 'id' | 'createdAt'> = {
      userId: currentUser?.id || null,
      customerName: shippingAddress.fullName,
      customerPhone: shippingAddress.phone,
      items: orderItems,
      status: method === 'Vodafone Cash' || method === 'Paymob' ? 'waiting_payment' : 'pending',
      paymentMethod: method,
      paymentStatus: 'pending',
      shippingAddress,
      subtotal,
      shippingFee,
      discount,
      total,
      notes,
    };

    const newOrder = await supabaseService.createOrder(rawOrder);
    setOrders(prev => [newOrder, ...prev]);

    // Dispatch real email communications
    if (currentUser?.email) {
      await resendService.sendOrderConfirmation(newOrder, currentUser.email);
    }
    await resendService.sendAdminNewOrderAlert(newOrder);

    // Create delivery shipment dispatch
    await shippingService.createShipment(newOrder);

    // Adjust product inventory stock level
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const orderedItem = orderItems.find(o => o.productId === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      });
    });

    addNotification(
      'تأكيد طلب الشراء الفاخر ' + newOrder.id,
      'Exclusive Purchase Confirmed ' + newOrder.id,
      `تم استلام طلبك بنجاح بقيمة ${newOrder.total} ج.م وسيتم تجهيز الشحنة فوراً.`,
      `Your premium order of ${newOrder.total} EGP is booked. Packaging is initiated.`
    );

    clearCart();
    return newOrder;
  };

  // --- Reviews ---
  const addReview = async (productId: string, userName: string, rating: number, comment: string) => {
    try {
      const fresh = await supabaseService.createReview({ productId, userName, rating, comment });
      
      setReviews(prev => {
        const currentReviews = prev[productId] || [];
        return { ...prev, [productId]: [fresh, ...currentReviews] };
      });

      // Adjust average rating metrics
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          if (p.id === productId) {
            const productReviews = reviews[productId] || [];
            const allReviews = [fresh, ...productReviews];
            const averageRating = parseFloat(
              (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
            );
            return {
              ...p,
              rating: averageRating,
              reviewsCount: allReviews.length,
            };
          }
          return p;
        });
      });
    } catch (err) {
      console.error('Failed to register review in database:', err);
    }
  };

  // --- Admin Console Operations ---
  const adminAddProduct = async (newProd: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    try {
      const fresh = await supabaseService.createProduct({
        ...newProd,
        rating: 5.0,
        reviewsCount: 0,
      });
      setProducts(prev => [fresh, ...prev]);
      addNotification(
        'إضافة مقتنى فاخر جديد: ' + fresh.nameAr,
        'Luxury Item Registered: ' + fresh.nameEn,
        'تم توفير المنتج الجديد في صالات العرض الرقمية بنجاح.',
        'The premium article has been approved and listed for public buyers.'
      );
    } catch (err) {
      console.error('Failed to register product:', err);
    }
  };

  const adminUpdateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const updated = await supabaseService.updateProduct(id, updatedFields);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      console.error('Failed to edit product:', err);
    }
  };

  const adminDeleteProduct = async (id: string) => {
    try {
      const targetProduct = products.find(p => p.id === id);
      const success = await supabaseService.deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        
        if (targetProduct && targetProduct.images) {
          const { cloudinaryService: cloudSvc } = await import('../services/cloudinary');
          for (const imgUrl of targetProduct.images) {
            if (imgUrl && imgUrl.includes('cloudinary.com')) {
              try {
                await cloudSvc.deleteImage(imgUrl);
              } catch (cErr) {
                console.warn('[Store Engine] Cloudinary image destruction failed:', cErr);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to remove product from catalog:', err);
    }
  };

  const adminUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const updated = await supabaseService.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
      
      if (updated && updated.userId) {
        addNotification(
          `تحديث حالة شحن طلبك ${id}`,
          `Dispatch Update ${id}`,
          `تغيرت حالة معالجة الطلب إلى: ${t(status as TranslationKey)}`,
          `Your shipping package status is updated to: ${status}`
        );
      }
    } catch (err) {
      console.error('Failed to update order processing state:', err);
    }
  };

  const adminUpdateSettings = async (newSettings: WebsiteSettings) => {
    try {
      const success = await supabaseService.updateSettings(newSettings);
      if (success) {
        setSettings(newSettings);
        addNotification(
          'تم تحديث إعدادات المتجر العامة',
          'Global Configurations Saved',
          'تم تطبيق إعدادات الرسوم ومفاتيح الربط والاتصال على المتجر كاملاً بنجاح.',
          'Global store currencies, merchant IDs, and API keys are verified and persistent.'
        );
      }
    } catch (err) {
      console.error('Failed to persist global customizations:', err);
    }
  };

  const adminAddCoupon = async (newCoupon: Omit<Coupon, 'id'>) => {
    try {
      const fresh = await supabaseService.createCoupon(newCoupon);
      setCoupons(prev => [fresh, ...prev]);
    } catch (err) {
      console.error('Failed to persist coupon:', err);
    }
  };

  const adminDeleteCoupon = async (id: string) => {
    try {
      const success = await supabaseService.deleteCoupon(id);
      if (success) {
        setCoupons(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        dir,
        theme,
        currentRoute,
        selectedProductId,
        searchQuery,
        filterCategory,
        setLanguage,
        setTheme,
        navigateTo,
        t,
        products,
        categories,
        orders,
        coupons,
        settings,
        notifications,
        reviews,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        wishlist,
        toggleWishlist,
        appliedCoupon,
        couponError,
        applyPromoCode,
        removePromoCode,
        currentUser,
        login,
        register,
        logout,
        addAddress,
        deleteAddress,
        placeOrder,
        addReview,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminUpdateOrderStatus,
        adminUpdateSettings,
        adminAddCoupon,
        adminDeleteCoupon,
        markAllNotificationsRead,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
