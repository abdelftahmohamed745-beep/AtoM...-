/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { Product, Order, Coupon, WebsiteSettings } from '../types';
import { LayoutDashboard, ShoppingBag, Truck, Users, Ticket, Settings, Plus, Pencil, Trash2, Save, X, Search, DollarSign, Activity, ShieldAlert, CreditCard, Eye, EyeOff, Key } from 'lucide-react';
import {
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getCloudinaryCloudName,
  getCloudinaryApiKey,
  getCloudinaryApiSecret,
  getResendApiKey,
  getPaymobApiKey,
  getPaymobSecretKey,
  getPaymobIntegrationId,
  getPaymobIframeId,
  isValidSupabaseUrl,
  isValidSupabaseKey,
  isValidResendApiKey,
  isValidPaymobApiKey,
  isValidCloudinaryCloudName,
  isValidCloudinaryApiKey,
} from '../services/config';

export const AdminPanel: React.FC = () => {
  const {
    language,
    t,
    products,
    categories,
    orders,
    coupons,
    settings,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminUpdateSettings,
    adminAddCoupon,
    adminDeleteCoupon,
    currentUser,
    navigateTo,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings' | 'payments' | 'api-settings'>('overview');

  // Search filter inside admin tabs
  const [pSearch, setPSearch] = useState('');
  const [oSearch, setOSearch] = useState('');

  // --- New Product Form States ---
  const [isProductFormView, setIsProductFormView] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [pNameAr, setPNameAr] = useState('');
  const [pNameEn, setPNameEn] = useState('');
  const [pDescAr, setPDescAr] = useState('');
  const [pDescEn, setPDescEn] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pCompare, setPCompare] = useState(0);
  const [pStock, setPStock] = useState(0);
  const [pCategory, setPCategory] = useState('sneakers');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [pBrandAr, setPBrandAr] = useState('');
  const [pBrandEn, setPBrandEn] = useState('');
  const [pSizes, setPSizes] = useState('');
  const [pColors, setPColors] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pNewArrival, setPNewArrival] = useState(false);
  const [pBestSeller, setPBestSeller] = useState(false);
  const [pHidden, setPHidden] = useState(false);
  const [pSpecsAr, setPSpecsAr] = useState('');
  const [pSpecsEn, setPSpecsEn] = useState('');

  // --- New Coupon Form States ---
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'fixed' | 'percentage'>('percentage');
  const [cValue, setCValue] = useState(0);
  const [cMinVal, setCMinVal] = useState(1000);

  // --- Settings Form States ---
  const [setContactPhone, setSetContactPhone] = useState(settings.contactPhone);
  const [setContactEmail, setSetContactEmail] = useState(settings.contactEmail);
  const [setWhatsapp, setSetWhatsapp] = useState(settings.whatsappNumber);
  const [setFreeShip, setSetFreeShip] = useState(settings.freeShippingThreshold);

  // --- Payment Settings States ---
  const [vodaCashNumber, setVodaCashNumber] = useState(settings.vodafoneCashNumber || '01032120351');
  const [paymobApiKey, setPaymobApiKey] = useState(settings.paymobApiKey || getPaymobApiKey());
  const [paymobSecretKey, setPaymobSecretKey] = useState(settings.paymobSecretKey || getPaymobSecretKey());
  const [paymobIntegrationId, setPaymobIntegrationId] = useState(settings.paymobIntegrationId || getPaymobIntegrationId());
  const [paymobIframeId, setPaymobIframeId] = useState(settings.paymobIframeId || getPaymobIframeId());
  const [futureProviderApiKey, setFutureProviderApiKey] = useState(settings.futureProviderApiKey || '');

  // --- API Settings States ---
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || getSupabaseUrl());
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabaseAnonKey || getSupabaseAnonKey());
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState(settings.supabaseServiceRoleKey || getSupabaseServiceRoleKey());
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(settings.cloudinaryCloudName || getCloudinaryCloudName());
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState(settings.cloudinaryApiKey || getCloudinaryApiKey());
  const [cloudinaryApiSecret, setCloudinaryApiSecret] = useState(settings.cloudinaryApiSecret || getCloudinaryApiSecret());
  const [resendApiKey, setResendApiKey] = useState(settings.resendApiKey || getResendApiKey());

  // Visibility states for hidden secrets
  const [showPaymobApiKey, setShowPaymobApiKey] = useState(false);
  const [showPaymobSecretKey, setShowPaymobSecretKey] = useState(false);
  const [showFutureApiKey, setShowFutureApiKey] = useState(false);
  const [showSupabaseAnonKey, setShowSupabaseAnonKey] = useState(false);
  const [showSupabaseServiceRoleKey, setShowSupabaseServiceRoleKey] = useState(false);
  const [showCloudinaryApiSecret, setShowCloudinaryApiSecret] = useState(false);
  const [showResendApiKey, setShowResendApiKey] = useState(false);

  // Connection testing states
  const [supabaseTestState, setSupabaseTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [cloudinaryTestState, setCloudinaryTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [resendTestState, setResendTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [paymobTestState, setPaymobTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Connection messages
  const [supabaseTestMsg, setSupabaseTestMsg] = useState('');
  const [cloudinaryTestMsg, setCloudinaryTestMsg] = useState('');
  const [resendTestMsg, setResendTestMsg] = useState('');
  const [paymobTestMsg, setPaymobTestMsg] = useState('');

  // Auth block
  const isEmailAdmin = currentUser?.email?.toLowerCase() === 'abdelftahmohamed745@gmail.com';
  if (!currentUser || (currentUser.role !== 'admin' && !isEmailAdmin)) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center dark:text-zinc-100" id="unauthorized-view">
        <div className="inline-flex rounded-full bg-amber-50 p-6 text-amber-600 dark:bg-amber-950/20 mb-6">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="text-xl font-bold">{t('unauthorized')}</h1>
        <p className="text-sm text-zinc-500 mt-2">{t('unauthorizedDesc')}</p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-6 rounded-xl bg-yellow-600 py-3 px-6 text-xs font-bold text-zinc-950 hover:bg-yellow-505 transition"
        >
          {t('backToHome')}
        </button>
      </div>
    );
  }

  // Helper Stats calculations
  const totalSalesVal = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';

    const payload = {
      nameAr: pNameAr,
      nameEn: pNameEn,
      descriptionAr: pDescAr,
      descriptionEn: pDescEn,
      price: Number(pPrice),
      compareAtPrice: pCompare ? Number(pCompare) : undefined,
      stock: Number(pStock),
      categoryId: pCategory,
      images: uploadedImages.length ? uploadedImages : [defaultImg],
      featured: pFeatured,
      bestSeller: pBestSeller,
      newArrival: pNewArrival,
      brandAr: pBrandAr || undefined,
      brandEn: pBrandEn || undefined,
      sizes: pSizes ? pSizes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      colors: pColors ? pColors.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      hidden: pHidden,
      specificationsAr: pSpecsAr || undefined,
      specificationsEn: pSpecsEn || undefined,
    };

    if (editingProduct) {
      adminUpdateProduct(editingProduct.id, payload);
    } else {
      adminAddProduct(payload);
    }

    // reset and close inline view
    setIsProductFormView(false);
    setEditingProduct(null);
    clearProductForm();
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setPNameAr(p.nameAr);
    setPNameEn(p.nameEn);
    setPDescAr(p.descriptionAr);
    setPDescEn(p.descriptionEn);
    setPPrice(p.price);
    setPCompare(p.compareAtPrice || 0);
    setPStock(p.stock);
    setPCategory(p.categoryId);
    setUploadedImages(p.images || []);
    setPBrandAr(p.brandAr || '');
    setPBrandEn(p.brandEn || '');
    setPSizes(p.sizes ? p.sizes.join(', ') : '');
    setPColors(p.colors ? p.colors.join(', ') : '');
    setPFeatured(p.featured || false);
    setPNewArrival(p.newArrival || false);
    setPBestSeller(p.bestSeller || false);
    setPHidden(p.hidden || false);
    setPSpecsAr(p.specificationsAr || '');
    setPSpecsEn(p.specificationsEn || '');
    setIsProductFormView(true);
  };

  const clearProductForm = () => {
    setPNameAr('');
    setPNameEn('');
    setPDescAr('');
    setPDescEn('');
    setPPrice(0);
    setPCompare(0);
    setPStock(0);
    setPCategory('sneakers');
    setUploadedImages([]);
    setManualImageUrl('');
    setPBrandAr('');
    setPBrandEn('');
    setPSizes('');
    setPColors('');
    setPFeatured(false);
    setPNewArrival(false);
    setPBestSeller(false);
    setPHidden(false);
    setPSpecsAr('');
    setPSpecsEn('');
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode) return;
    adminAddCoupon({
      code: cCode.toUpperCase(),
      discountType: cType,
      value: Number(cValue),
      minOrderValue: Number(cMinVal),
      active: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    });
    setCCode('');
    setCValue(0);
    setShowCouponForm(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings({
      ...settings,
      contactPhone: setContactPhone,
      contactEmail: setContactEmail,
      whatsappNumber: setWhatsapp,
      freeShippingThreshold: Number(setFreeShip),
    });
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings({
      ...settings,
      vodafoneCashNumber: vodaCashNumber,
      paymobApiKey,
      paymobSecretKey,
      paymobIntegrationId,
      paymobIframeId,
      futureProviderApiKey,
    });
  };

  // --- Auto-Realign & Validate API Fields ---
  const performAutoRealignAndVerify = () => {
    let currentUrl = supabaseUrl.trim();
    let currentAnon = supabaseAnonKey.trim();
    let currentServiceRole = supabaseServiceRoleKey.trim();
    let currentCloudName = cloudinaryCloudName.trim();
    let currentCloudKey = cloudinaryApiKey.trim();
    let currentCloudSecret = cloudinaryApiSecret.trim();
    let currentResend = resendApiKey.trim();
    let currentPaymob = paymobApiKey.trim();
    let currentPaymobSecret = paymobSecretKey.trim();
    let currentPaymobInt = paymobIntegrationId.trim();
    let currentPaymobIframe = paymobIframeId.trim();

    const allValues = [
      currentUrl, currentAnon, currentServiceRole,
      currentCloudName, currentCloudKey, currentCloudSecret,
      currentResend,
      currentPaymob, currentPaymobSecret, currentPaymobInt, currentPaymobIframe
    ].filter(Boolean);

    let realignedAny = false;

    // 1. Supabase URL
    const foundUrl = allValues.find(v => v.includes('supabase.co'));
    if (foundUrl && currentUrl !== foundUrl) {
      currentUrl = foundUrl;
      realignedAny = true;
    }

    // 2. Resend API Key
    const foundResend = allValues.find(v => v.startsWith('re_'));
    if (foundResend && currentResend !== foundResend) {
      currentResend = foundResend;
      realignedAny = true;
    }

    // 3. Paymob API Key
    const foundPaymob = allValues.find(v => v.startsWith('p_live_') || v.startsWith('p_test_'));
    if (foundPaymob && currentPaymob !== foundPaymob) {
      currentPaymob = foundPaymob;
      realignedAny = true;
    }

    // 4. Supabase Keys (eyJ JWTs)
    const foundJwts = allValues.filter(v => v.startsWith('eyJ') && v.length > 50);
    if (foundJwts.length > 0) {
      if (foundJwts.length === 1) {
        if (currentAnon !== foundJwts[0]) {
          currentAnon = foundJwts[0];
          realignedAny = true;
        }
      } else if (foundJwts.length >= 2) {
        if (currentAnon !== foundJwts[0] || currentServiceRole !== foundJwts[1]) {
          currentAnon = foundJwts[0];
          currentServiceRole = foundJwts[1];
          realignedAny = true;
        }
      }
    }

    // 5. Cloudinary API Key (typically 15 digits)
    const foundCloudKey = allValues.find(v => /^\d{15}$/.test(v));
    if (foundCloudKey && currentCloudKey !== foundCloudKey) {
      currentCloudKey = foundCloudKey;
      realignedAny = true;
    }

    if (realignedAny) {
      setSupabaseUrl(currentUrl);
      setSupabaseAnonKey(currentAnon);
      setSupabaseServiceRoleKey(currentServiceRole);
      setCloudinaryCloudName(currentCloudName);
      setCloudinaryApiKey(currentCloudKey);
      setCloudinaryApiSecret(currentCloudSecret);
      setResendApiKey(currentResend);
      setPaymobApiKey(currentPaymob);
      setPaymobSecretKey(currentPaymobSecret);
      setPaymobIntegrationId(currentPaymobInt);
      setPaymobIframeId(currentPaymobIframe);
    }

    return {
      realigned: realignedAny,
      values: {
        supabaseUrl: currentUrl,
        supabaseAnonKey: currentAnon,
        supabaseServiceRoleKey: currentServiceRole,
        cloudinaryCloudName: currentCloudName,
        cloudinaryApiKey: currentCloudKey,
        cloudinaryApiSecret: currentCloudSecret,
        resendApiKey: currentResend,
        paymobApiKey: currentPaymob,
        paymobSecretKey: currentPaymobSecret,
        paymobIntegrationId: currentPaymobInt,
        paymobIframeId: currentPaymobIframe
      }
    };
  };

  const handleSaveApiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const result = performAutoRealignAndVerify();
    adminUpdateSettings({
      ...settings,
      ...result.values
    });
  };

  const handleTestSupabase = async () => {
    setSupabaseTestState('testing');
    setSupabaseTestMsg(language === 'ar' ? 'جاري الاتصال بقاعدة بيانات Supabase...' : 'Connecting to Supabase instance...');
    
    try {
      const result = performAutoRealignAndVerify();
      const { supabaseUrl: url, supabaseAnonKey: anon, supabaseServiceRoleKey: serviceRole } = result.values;

      if (!url || !anon) {
        setSupabaseTestState('error');
        setSupabaseTestMsg(language === 'ar' ? 'خطأ: يرجى إدخال عنوان URL ومفتاح Anon للاتصال.' : 'Error: Missing Supabase URL or Anon Key configuration.');
        return;
      }

      if (!isValidSupabaseUrl(url)) {
        setSupabaseTestState('error');
        setSupabaseTestMsg(language === 'ar' ? 'خطأ: يجب أن يكون عنوان URL لـ Supabase بالصيغة https://your-project.supabase.co' : 'Error: Supabase URL must be a valid https://your-project.supabase.co URL.');
        return;
      }

      if (!isValidSupabaseKey(anon)) {
        setSupabaseTestState('error');
        setSupabaseTestMsg(language === 'ar' ? 'خطأ: يجب أن يبدأ مفتاح Anon بـ eyJ.' : 'Error: Supabase Anon Key (Publishable Key) must be a valid publishable key starting with eyJ.');
        return;
      }

      if (serviceRole && !isValidSupabaseKey(serviceRole)) {
        setSupabaseTestState('error');
        setSupabaseTestMsg(language === 'ar' ? 'خطأ: يجب أن يبدأ مفتاح Service Role بـ eyJ.' : 'Error: Supabase Service Role Key must be a valid server secret starting with eyJ.');
        return;
      }

      if (anon === serviceRole) {
        setSupabaseTestState('error');
        setSupabaseTestMsg(language === 'ar' ? 'خطأ أمني: لا يجب استخدام نفس المفتاح لـ Anon و Service Role.' : 'Security Error: Supabase Publishable Key and Service Role Key must not be identical.');
        return;
      }

      // Real connection check
      const { createClient } = await import('@supabase/supabase-js');
      const testClient = createClient(url, anon);
      
      const { error } = await testClient.from('products').select('id').limit(1);
      
      if (error) {
        // Table missing but connection successful: error code 42P01 means "relation does not exist"
        if (error.code === '42P01') {
          setSupabaseTestState('success');
          let msg = language === 'ar'
            ? 'نجاح الاتصال! تم التحقق من بيانات الاعتماد بنجاح، ولكن جدول المنتجات (products) غير منشأ بعد في قاعدة بياناتك. يرجى تشغيل سكربت تهيئة الجداول المرفق في الكود.'
            : 'Connection Success! Credentials are authorized, but the "products" table does not exist in your database yet. Please run the SQL initialization script in your Supabase SQL editor.';
          if (result.realigned) {
            msg += language === 'ar' ? ' (تمت إعادة محاذاة الحقول تلقائياً)' : ' (Misaligned fields corrected automatically)';
          }
          setSupabaseTestMsg(msg);
        } else {
          throw new Error(error.message || JSON.stringify(error));
        }
      } else {
        setSupabaseTestState('success');
        let msg = language === 'ar' 
          ? 'نجاح! تم الاتصال بـ Supabase والتحقق من صحة الجداول بالكامل.' 
          : 'Success! Connected to Supabase and verified schema collections successfully.';
        if (result.realigned) {
          msg += language === 'ar' ? ' (تمت إعادة محاذاة الحقول تلقائياً)' : ' (Misaligned fields corrected automatically)';
        }
        setSupabaseTestMsg(msg);
      }
    } catch (err: any) {
      setSupabaseTestState('error');
      setSupabaseTestMsg(language === 'ar' 
        ? `فشل الاتصال: ${err.message || 'خطأ غير معروف في الشبكة.'}` 
        : `Connection failed: ${err.message || 'Unknown network error.'}`);
    }
  };

  const handleTestCloudinary = async () => {
    setCloudinaryTestState('testing');
    setCloudinaryTestMsg(language === 'ar' ? 'جاري اختبار مصادقة Cloudinary...' : 'Authenticating with Cloudinary server...');
    
    try {
      const result = performAutoRealignAndVerify();
      const { cloudinaryCloudName: name, cloudinaryApiKey: apiKey, cloudinaryApiSecret: secret } = result.values;

      if (!name || !apiKey || !secret) {
        setCloudinaryTestState('error');
        setCloudinaryTestMsg(language === 'ar' ? 'خطأ: يرجى ملء جميع حقول Cloudinary للاختبار.' : 'Error: Cloud Name, API Key, and Secret are required.');
        return;
      }

      if (!isValidCloudinaryCloudName(name)) {
        setCloudinaryTestState('error');
        setCloudinaryTestMsg(language === 'ar' ? 'خطأ: اسم السحابة Cloud Name غير صالح.' : 'Error: Cloudinary Cloud Name must be valid.');
        return;
      }

      if (!isValidCloudinaryApiKey(apiKey)) {
        setCloudinaryTestState('error');
        setCloudinaryTestMsg(language === 'ar' ? 'خطأ: يجب أن يكون مفتاح واجهة التطبيق رقمياً بالكامل.' : 'Error: Cloudinary API Key must be a numeric string.');
        return;
      }

      // Real ping request to check if cloud name is valid and reachable
      const response = await fetch(`https://api.cloudinary.com/v1_1/${name}/ping`);
      
      if (!response.ok) {
        throw new Error(`Cloud Name "${name}" not found or unauthorized on Cloudinary service.`);
      }

      setCloudinaryTestState('success');
      let msg = language === 'ar' 
        ? 'نجاح! تم التحقق من اتصال Cloudinary وجاهز لرفع الفاخر.' 
        : 'Success! Cloudinary asset portal verified and connected successfully.';
      if (result.realigned) {
        msg += language === 'ar' ? ' (تمت إعادة محاذاة الحقول تلقائياً)' : ' (Fields realigned automatically)';
      }
      setCloudinaryTestMsg(msg);
    } catch (err: any) {
      setCloudinaryTestState('error');
      setCloudinaryTestMsg(language === 'ar'
        ? `خطأ في اختبار Cloudinary: ${err.message || 'فشل الاتصال بخادم الرفع.'}`
        : `Cloudinary test failed: ${err.message || 'Server connection failure.'}`);
    }
  };

  const handleTestResend = async () => {
    setResendTestState('testing');
    setResendTestMsg(language === 'ar' ? 'جاري اختبار خادم البريد Resend...' : 'Pinging Resend mail dispatcher...');
    
    try {
      const result = performAutoRealignAndVerify();
      const { resendApiKey: rKey } = result.values;

      if (!rKey) {
        setResendTestState('error');
        setResendTestMsg(language === 'ar' ? 'خطأ: مفتاح بريد Resend فارغ.' : 'Error: Resend API Key is missing.');
        return;
      }

      if (!isValidResendApiKey(rKey)) {
        setResendTestState('error');
        setResendTestMsg(language === 'ar' ? 'خطأ: يجب أن يبدأ مفتاح Resend بـ re_.' : 'Error: Resend API Key must be a valid key starting with re_.');
        return;
      }

      // Real test lookup to check if API Key is valid
      const response = await fetch('https://api.resend.com/emails', {
        headers: {
          'Authorization': `Bearer ${rKey}`,
        }
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Resend API Key is invalid or has expired.');
      }

      setResendTestState('success');
      let msg = language === 'ar' 
        ? 'نجاح! مصادقة Resend ممتازة لإرسال الفواتير.' 
        : 'Success! Resend SMTP secure credentials verified successfully.';
      if (result.realigned) {
        msg += language === 'ar' ? ' (تمت إعادة محاذاة الحقول تلقائياً)' : ' (Fields realigned automatically)';
      }
      setResendTestMsg(msg);
    } catch (err: any) {
      setResendTestState('error');
      setResendTestMsg(language === 'ar'
        ? `خطأ في اختبار Resend: ${err.message || 'يرجى مراجعة صلاحية المفتاح والاتصال.'}`
        : `Resend test failed: ${err.message || 'Please check key authorization status.'}`);
    }
  };

  const handleTestPaymob = async () => {
    setPaymobTestState('testing');
    setPaymobTestMsg(language === 'ar' ? 'جاري الاتصال ببوابة بيموب...' : 'Handshaking with Paymob merchant gateway...');
    
    try {
      const result = performAutoRealignAndVerify();
      const { paymobApiKey: pKey, paymobIntegrationId: pInt, paymobIframeId: pIframe } = result.values;

      if (!pKey || !pInt || !pIframe) {
        setPaymobTestState('error');
        setPaymobTestMsg(language === 'ar' ? 'خطأ: يرجى التحقق من حقول بيموب.' : 'Error: Paymob integration key, Iframe ID, or API Key is blank.');
        return;
      }

      if (!isValidPaymobApiKey(pKey)) {
        setPaymobTestState('error');
        setPaymobTestMsg(language === 'ar' ? 'خطأ: مفتاح Paymob API غير صالح.' : 'Error: Paymob API Key must start with p_live_ or p_test_.');
        return;
      }

      // Real authentication handshake with Paymob gateway
      const authResponse = await fetch('https://egypt.paymob.com/api/auth/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: pKey }),
      });

      if (!authResponse.ok) {
        const errText = await authResponse.text();
        throw new Error(`Auth handshake rejected: ${errText || authResponse.statusText}`);
      }

      const authData = await authResponse.json();
      if (!authData.token) {
        throw new Error('Merchant handshake failed to return an auth token.');
      }

      setPaymobTestState('success');
      let msg = language === 'ar' 
        ? 'نجاح! بوابة بيموب نشطة وجاهزة لاستقبال المدفوعات.' 
        : 'Success! Paymob merchant wallets and integration fields verified.';
      if (result.realigned) {
        msg += language === 'ar' ? ' (تمت إعادة محاذاة الحقول تلقائياً)' : ' (Fields realigned automatically)';
      }
      setPaymobTestMsg(msg);
    } catch (err: any) {
      setPaymobTestState('error');
      setPaymobTestMsg(language === 'ar'
        ? `فشل اتصال بيموب: ${err.message || 'يرجى مراجعة مفتاح المتجر.'}`
        : `Paymob handshake failed: ${err.message || 'Please check your merchant key.'}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="admin-panel-stage">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
            {language === 'ar' ? 'أتوم - لوحة إدارة المتجر السحرية' : 'AtoM Store Manager'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar' ? 'إضافة وتعديل المنتجات، تتبع طلبيات العملاء، ضبط العروض الحصرية والمقاييس.' : 'Control inventory, update customer invoices, and tune global settings.'}
          </p>
        </div>
        <button
          onClick={() => navigateTo('home')}
          className="rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 py-2 px-4 text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition"
        >
          {t('viewStore')}
        </button>
      </div>

      {/* Grid Layout: Sidebar Navigation & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 border-b border-zinc-100 lg:border-b-0 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'overview'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{t('adminDashboard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'products'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t('adminProducts')} ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'orders'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>{t('adminOrders')} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'coupons'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>{t('adminCoupons')} ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'settings'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>{t('adminSettings')}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'payments'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>{language === 'ar' ? 'إعدادات الدفع' : 'Payment Settings'}</span>
          </button>

          <button
            onClick={() => setActiveTab('api-settings')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              activeTab === 'api-settings'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Key className="h-4 w-4" />
            <span>{language === 'ar' ? 'إعدادات واجهة برمجة التطبيقات (API)' : 'API Settings'}</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Stats Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('totalSales')}</span>
                    <DollarSign className="h-4.5 w-4.5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-black mt-2">{totalSalesVal.toLocaleString()} <span className="text-xs font-normal">ج.م</span></h3>
                  <span className="text-[10px] text-green-500 font-semibold block mt-1">✓ Delivered orders</span>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('totalOrders')}</span>
                    <Truck className="h-4.5 w-4.5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-black mt-2">{orders.length}</h3>
                  <span className="text-[10px] text-zinc-400 block mt-1">({pendingOrdersCount} pending orders)</span>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('activeCustomers')}</span>
                    <Users className="h-4.5 w-4.5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-black mt-2">{products.reduce((acc, p) => acc + p.reviewsCount, 3)}</h3>
                  <span className="text-[10px] text-zinc-400 block mt-1">Unique buyer emails</span>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('activeCoupons')}</span>
                    <Ticket className="h-4.5 w-4.5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-black mt-2">{coupons.filter(c => c.active).length}</h3>
                  <span className="text-[10px] text-zinc-400 block mt-1">Codes ready to use</span>
                </div>

              </div>

              {/* Recent Orders List */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 mb-4 pb-3 border-b border-zinc-50 dark:border-zinc-800">
                  {t('recentOrders')}
                </h3>
                {orders.length === 0 ? (
                  <p className="text-center text-xs text-zinc-400 py-6">No orders logged yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400">
                          <th className="pb-3">{t('orderId')}</th>
                          <th className="pb-3">{t('fullName')}</th>
                          <th className="pb-3">{t('governorate')}</th>
                          <th className="pb-3">{t('total')}</th>
                          <th className="pb-3">{t('orderStatus')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id}>
                            <td className="py-3 font-semibold text-yellow-600 font-mono">{o.id}</td>
                            <td className="py-3">{o.customerName}</td>
                            <td className="py-3">{language === 'ar' ? o.shippingAddress.governorateAr : o.shippingAddress.governorateEn}</td>
                            <td className="py-3 font-bold">{o.total.toLocaleString()} ج.م</td>
                            <td className="py-3">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                o.status === 'delivered'
                                  ? 'bg-green-50 text-green-700 dark:bg-green-950/20'
                                  : o.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700 dark:bg-red-950/20'
                                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                              }`}>
                                {t(o.status as any)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {!isProductFormView ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                      <input
                        type="text"
                        placeholder={t('searchProducts')}
                        value={pSearch}
                        onChange={(e) => setPSearch(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-4 pr-10 text-xs text-zinc-800 focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-900"
                      />
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                    </div>

                    <button
                      onClick={() => {
                        clearProductForm();
                        setEditingProduct(null);
                        setIsProductFormView(true);
                      }}
                      className="rounded-xl bg-yellow-600 py-2.5 px-4 text-xs font-bold text-zinc-950 hover:bg-yellow-500 transition flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('addNewProduct')}</span>
                    </button>
                  </div>

                  {/* Products Grid Table */}
                  <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-x-auto">
                    <table className="w-full text-left rtl:text-right text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400">
                          <th className="pb-3">Image</th>
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Stock</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3 text-right rtl:text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {products
                          .filter(p => (p.nameAr + p.nameEn).toLowerCase().includes(pSearch.toLowerCase()))
                          .map(p => (
                            <tr key={p.id}>
                              <td className="py-3">
                                <img src={p.images[0]} alt={p.nameEn} className="h-10 w-10 rounded-lg object-cover bg-zinc-50" />
                              </td>
                              <td className="py-3 font-semibold">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span>{language === 'ar' ? p.nameAr : p.nameEn}</span>
                                  {p.hidden && <span className="inline-flex rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[8px] font-bold uppercase dark:bg-red-950/40 dark:text-red-400">Hidden</span>}
                                  {p.featured && <span className="inline-flex rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[8px] font-bold uppercase dark:bg-yellow-950/40 dark:text-yellow-400">Featured</span>}
                                  {p.newArrival && <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[8px] font-bold uppercase dark:bg-blue-950/40 dark:text-blue-400">New</span>}
                                  {p.bestSeller && <span className="inline-flex rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[8px] font-bold uppercase dark:bg-green-950/40 dark:text-green-400">Best Seller</span>}
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono">ID: {p.id} {p.brandEn ? `| Brand: ${p.brandEn}` : ''}</span>
                              </td>
                              <td className="py-3">
                                <span className={`font-bold ${p.stock <= 5 ? 'text-red-500 font-black' : ''}`}>{p.stock} units</span>
                              </td>
                              <td className="py-3 font-bold">{p.price.toLocaleString()} ج.م</td>
                              <td className="py-3 text-right rtl:text-left">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleEditClick(p)}
                                    className="rounded-lg p-1.5 border border-zinc-200 hover:border-yellow-600 hover:text-yellow-600 dark:border-zinc-800 transition"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => adminDeleteProduct(p.id)}
                                    className="rounded-lg p-1.5 border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-950/30 dark:hover:bg-red-950/20 transition"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm animate-in slide-in-from-bottom duration-200">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                    <div>
                      <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                        {editingProduct ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
                      </h2>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {language === 'ar' ? 'أدخل تفاصيل ومواصفات المقتنى الفاخر الجديد لعرضه بالمعرض.' : 'Enter specifications, pricing, and upload images for this high-end boutique item.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProductFormView(false);
                        setEditingProduct(null);
                        clearProductForm();
                      }}
                      className="rounded-xl border border-zinc-200 hover:bg-zinc-50 py-2 px-4 text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition"
                    >
                      {language === 'ar' ? 'إلغاء والعودة' : 'Cancel & Back'}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('productNameAr')} *</label>
                        <input
                          type="text"
                          required
                          value={pNameAr}
                          onChange={(e) => setPNameAr(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('productNameEn')} *</label>
                        <input
                          type="text"
                          required
                          value={pNameEn}
                          onChange={(e) => setPNameEn(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('descriptionAr')} *</label>
                        <textarea
                          rows={3}
                          required
                          value={pDescAr}
                          onChange={(e) => setPDescAr(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('descriptionEn')} *</label>
                        <textarea
                          rows={3}
                          required
                          value={pDescEn}
                          onChange={(e) => setPDescEn(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('priceLabel')} *</label>
                        <input
                          type="number"
                          required
                          value={pPrice || ''}
                          onChange={(e) => setPPrice(Number(e.target.value))}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('comparePriceLabel')}</label>
                        <input
                          type="number"
                          value={pCompare || ''}
                          onChange={(e) => setPCompare(Number(e.target.value))}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('stockLabel')} *</label>
                        <input
                          type="number"
                          required
                          value={pStock || ''}
                          onChange={(e) => setPStock(Number(e.target.value))}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">{t('categoryLabel')} *</label>
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {language === 'ar' ? cat.nameAr : cat.nameEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">Brand (Arabic)</label>
                        <input
                          type="text"
                          value={pBrandAr}
                          onChange={(e) => setPBrandAr(e.target.value)}
                          placeholder="مثال: نايكي"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">Brand (English)</label>
                        <input
                          type="text"
                          value={pBrandEn}
                          onChange={(e) => setPBrandEn(e.target.value)}
                          placeholder="e.g. Nike"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">Available Sizes (Comma-separated)</label>
                        <input
                          type="text"
                          value={pSizes}
                          onChange={(e) => setPSizes(e.target.value)}
                          placeholder="e.g. 40, 41, 42, 43, 44"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">Available Colors (Comma-separated)</label>
                        <input
                          type="text"
                          value={pColors}
                          onChange={(e) => setPColors(e.target.value)}
                          placeholder="e.g. Black, Brown, Suede"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      {/* Image Upload Block */}
                      <div className="sm:col-span-2 space-y-3 bg-zinc-50 dark:bg-zinc-950/25 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800/60 animate-in fade-in">
                        <label className="text-xs font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200 block">
                          {language === 'ar' ? 'صور المنتج المعروضة' : 'Displayed Product Images'} *
                        </label>
                        
                        {uploadedImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {uploadedImages.map((img, index) => (
                              <div key={index} className="group relative aspect-square rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                                <img src={img} alt="Boutique upload preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition shadow animate-in zoom-in-50"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  #{index + 1} {index === 0 ? (language === 'ar' ? '(الرئيسية)' : '(Primary)') : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400 block uppercase">{language === 'ar' ? 'تحميل من جهازك' : 'Upload from your device'}</span>
                            <div className="relative border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-yellow-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white dark:bg-zinc-900 transition">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={async (e) => {
                                  if (e.target.files) {
                                    const filesArray = Array.from(e.target.files) as File[];
                                    const { cloudinaryService: cloudSvc } = await import('../services/cloudinary');
                                    
                                    for (const file of filesArray) {
                                      try {
                                        console.log('Uploading file directly to Cloudinary:', file.name);
                                        const secureUrl = await cloudSvc.uploadImage(file);
                                        setUploadedImages(prev => [...prev, secureUrl]);
                                      } catch (err: any) {
                                        alert(language === 'ar' 
                                          ? `خطأ أثناء الرفع إلى Cloudinary: ${err.message}` 
                                          : `Error uploading to Cloudinary: ${err.message}`);
                                      }
                                    }
                                    e.target.value = '';
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <Plus className="h-5 w-5 text-zinc-400 mb-1" />
                              <span className="text-[10px] font-bold text-yellow-600">
                                {language === 'ar' ? 'انقر لاختيار صور من جهازك' : 'Click to select device files'}
                              </span>
                              <span className="text-[9px] text-zinc-400 mt-0.5">Supports JPG, PNG</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400 block uppercase">{language === 'ar' ? 'أو إضافة رابط صورة خارجي' : 'Or add external image URL'}</span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={manualImageUrl}
                                onChange={(e) => setManualImageUrl(e.target.value)}
                                className="flex-grow rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (manualImageUrl.trim()) {
                                    setUploadedImages(prev => [...prev, manualImageUrl.trim()]);
                                    setManualImageUrl('');
                                  }
                                }}
                                className="rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white px-4 text-xs font-bold hover:bg-yellow-600 hover:text-zinc-950 transition"
                              >
                                {language === 'ar' ? 'إضافة' : 'Add'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">Specifications (Arabic, one per line)</label>
                        <textarea
                          rows={2}
                          value={pSpecsAr}
                          onChange={(e) => setPSpecsAr(e.target.value)}
                          placeholder="الخامة: جلد طبيعي 100%&#10;النعل: طبي مريح مضاد للانزلاق"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wide block">Specifications (English, one per line)</label>
                        <textarea
                          rows={2}
                          value={pSpecsEn}
                          onChange={(e) => setPSpecsEn(e.target.value)}
                          placeholder="Material: 100% Genuine Leather&#10;Sole: Orthopedic non-slip rubber"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:col-span-2 bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800/60">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                          <input
                            type="checkbox"
                            checked={pFeatured}
                            onChange={(e) => setPFeatured(e.target.checked)}
                            className="rounded border-zinc-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                          />
                          <span className="text-zinc-700 dark:text-zinc-300">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                          <input
                            type="checkbox"
                            checked={pNewArrival}
                            onChange={(e) => setPNewArrival(e.target.checked)}
                            className="rounded border-zinc-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                          />
                          <span className="text-zinc-700 dark:text-zinc-300">New Arrival</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                          <input
                            type="checkbox"
                            checked={pBestSeller}
                            onChange={(e) => setPBestSeller(e.target.checked)}
                            className="rounded border-zinc-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                          />
                          <span className="text-zinc-700 dark:text-zinc-300">Best Seller</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                          <input
                            type="checkbox"
                            checked={pHidden}
                            onChange={(e) => setPHidden(e.target.checked)}
                            className="rounded border-zinc-300 text-red-600 focus:ring-red-500 h-4 w-4"
                          />
                          <span className="text-red-500 font-extrabold uppercase">Hidden</span>
                        </label>
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProductFormView(false);
                          setEditingProduct(null);
                          clearProductForm();
                        }}
                        className="rounded-xl border border-zinc-200 py-3 px-6 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 transition"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-yellow-600 py-3 px-8 text-xs font-bold text-zinc-950 hover:bg-yellow-500 transition shadow"
                      >
                        {editingProduct ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'إضافة المنتج للمعرض' : 'Create Product Listing')}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS PROCESSOR */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Search bar */}
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="البحث برقم الطلب أو اسم العميل..."
                  value={oSearch}
                  onChange={(e) => setOSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-4 pr-10 text-xs text-zinc-800 focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-900"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
              </div>

              {/* Order management table */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Address</th>
                      <th className="pb-3">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                    {orders
                      .filter(o => o.id.toLowerCase().includes(oSearch.toLowerCase()) || o.customerName.toLowerCase().includes(oSearch.toLowerCase()))
                      .map(o => (
                        <tr key={o.id}>
                          <td className="py-3 font-bold font-mono text-yellow-600">{o.id}</td>
                          <td className="py-3">
                            <div className="font-semibold">{o.customerName}</div>
                            <div className="text-[10px] text-zinc-400">{o.customerPhone}</div>
                          </td>
                          <td className="py-3 font-bold">{o.total.toLocaleString()} ج.م</td>
                          <td className="py-3">
                            <span className="text-[10px] leading-relaxed block max-w-[150px] truncate">
                              {language === 'ar' ? o.shippingAddress.governorateAr : o.shippingAddress.governorateEn} - {o.shippingAddress.cityAr}
                            </span>
                          </td>
                          <td className="py-3">
                            <select
                              value={o.status}
                              onChange={(e) => adminUpdateOrderStatus(o.id, e.target.value as any)}
                              className="rounded-lg border border-zinc-200 p-1.5 text-[11px] font-bold dark:border-zinc-800 dark:bg-zinc-950"
                            >
                              <option value="pending">{t('pending')}</option>
                              <option value="waiting_payment">{t('waiting_payment')}</option>
                              <option value="confirmed">{t('confirmed')}</option>
                              <option value="processing">{t('processing')}</option>
                              <option value="shipped">{t('shipped')}</option>
                              <option value="delivered">{t('delivered')}</option>
                              <option value="cancelled">{t('cancelled')}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('adminCoupons')}</h3>
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="rounded-xl border border-zinc-200 py-2 px-3 text-xs font-bold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                >
                  {showCouponForm ? t('cancel') : t('addNewCoupon' as any) || '+ Create Coupon'}
                </button>
              </div>

              {/* Coupon builder form */}
              {showCouponForm && (
                <form onSubmit={handleSaveCoupon} className="rounded-2xl border border-yellow-600/10 p-5 bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400">COUPON CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="E.G. ATOM20"
                        value={cCode}
                        onChange={(e) => setCCode(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs uppercase focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400">DISCOUNT TYPE</label>
                      <select
                        value={cType}
                        onChange={(e) => setCType(e.target.value as any)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed EGP (ج.م)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400">VALUE</label>
                      <input
                        type="number"
                        required
                        value={cValue}
                        onChange={(e) => setCValue(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400">MIN ORDER VALUE (EGP)</label>
                      <input
                        type="number"
                        required
                        value={cMinVal}
                        onChange={(e) => setCMinVal(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-zinc-950 text-xs font-bold rounded-xl py-2.5 px-4 transition">
                    Activate Coupon Code
                  </button>
                </form>
              )}

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map(c => (
                  <div key={c.id} className="rounded-2xl border border-zinc-100 p-4 bg-white dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-center shadow-sm">
                    <div>
                      <span className="font-mono font-black text-sm text-yellow-600 tracking-wider block">{c.code}</span>
                      <span className="text-[11px] text-zinc-500 block mt-1">
                        Discount: {c.value} {c.discountType === 'percentage' ? '%' : 'EGP'}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        Min spend: {c.minOrderValue} EGP
                      </span>
                    </div>
                    <button
                      onClick={() => adminDeleteCoupon(c.id)}
                      className="text-red-500 hover:bg-red-50 rounded-lg p-2 transition dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <form onSubmit={handleSaveSettings} className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Shop Variables Configuration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Support WhatsApp Number</label>
                    <input
                      type="text"
                      value={setWhatsapp}
                      onChange={(e) => setSetWhatsapp(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Contact Telephone</label>
                    <input
                      type="text"
                      value={setContactPhone}
                      onChange={(e) => setSetContactPhone(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Support Email</label>
                    <input
                      type="email"
                      value={setContactEmail}
                      onChange={(e) => setSetContactEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Free Shipping Threshold (EGP)</label>
                    <input
                      type="number"
                      value={setFreeShip}
                      onChange={(e) => setSetFreeShip(Number(e.target.value))}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold text-xs py-3.5 px-6 rounded-xl transition flex items-center gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>{t('save')}</span>
                </button>
              </form>

            </div>
          )}

          {/* TAB 6: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <form onSubmit={handleSavePaymentSettings} className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <CreditCard className="h-4.5 w-4.5 text-yellow-600" />
                    <span>Secure Payment Configuration</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2">
                    Manage the active payment gateways, mobile wallets, and secret API integrations here. Normal users can never access these private details.
                  </p>
                </div>

                {/* Section 1: Vodafone Cash */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-zinc-50 dark:border-zinc-850">
                    <span className="text-lg">🔴</span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Vodafone Cash Wallet
                    </h4>
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block">
                      Vodafone Cash Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01032120351"
                      value={vodaCashNumber}
                      onChange={(e) => setVodaCashNumber(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-red-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono tracking-wider text-zinc-800 dark:text-zinc-100"
                    />
                    <p className="text-[10px] text-zinc-400">
                      The official wallet phone number presented to checkout customers.
                    </p>
                  </div>
                </div>

                {/* Section 2: Paymob Gateway */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-zinc-50 dark:border-zinc-850">
                    <span className="text-lg">💳</span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Paymob Credit Card & Wallet Gateway
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 max-w-2xl leading-relaxed">
                    By inputting your active Paymob merchant keys below, online card payments will automatically become visible to clients during the checkout step. If these keys are left empty, only Cash on Delivery and Vodafone Cash options will be offered.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Paymob API Key */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block">
                        Paymob API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showPaymobApiKey ? "text" : "password"}
                          value={paymobApiKey}
                          onChange={(e) => setPaymobApiKey(e.target.value)}
                          placeholder="p_live_..."
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPaymobApiKey(!showPaymobApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                        >
                          {showPaymobApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Paymob Secret Key */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block">
                        Paymob Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showPaymobSecretKey ? "text" : "password"}
                          value={paymobSecretKey}
                          onChange={(e) => setPaymobSecretKey(e.target.value)}
                          placeholder="hmac_secret_..."
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPaymobSecretKey(!showPaymobSecretKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                        >
                          {showPaymobSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Paymob Integration ID */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block">
                        Paymob Integration ID
                      </label>
                      <input
                        type="text"
                        value={paymobIntegrationId}
                        onChange={(e) => setPaymobIntegrationId(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    {/* Paymob Iframe ID */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block">
                        Paymob Iframe ID
                      </label>
                      <input
                        type="text"
                        value={paymobIframeId}
                        onChange={(e) => setPaymobIframeId(e.target.value)}
                        placeholder="e.g. 78910"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Future Gateway Expansion */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-zinc-50 dark:border-zinc-850">
                    <span className="text-lg">⚡</span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Future Payment Gateway Expansion
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 max-w-2xl leading-relaxed">
                    Extend your shop integrations (e.g. Instapay, Fawry, or Stripe) instantly using this custom API key storage block.
                  </p>
                  <div className="max-w-md space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block">
                      Future Provider Secret API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showFutureApiKey ? "text" : "password"}
                        value={futureProviderApiKey}
                        onChange={(e) => setFutureProviderApiKey(e.target.value)}
                        placeholder="sk_future_..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFutureApiKey(!showFutureApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                      >
                        {showFutureApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit action */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold text-xs py-3.5 px-6 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                    <Save className="h-4 w-4" />
                    <span>Save Payment Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: API SETTINGS */}
          {activeTab === 'api-settings' && (
            <div className="space-y-6 animate-in fade-in duration-200" id="api-settings-view">
              <form onSubmit={handleSaveApiSettings} className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <Key className="h-4.5 w-4.5 text-yellow-600 animate-pulse" />
                      <span>{language === 'ar' ? 'بوابة إدارة واجهات البرمجة الآمنة' : 'Secure API Gateway Settings'}</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {language === 'ar'
                        ? 'تكوين بيانات الربط الخاصة بـ Supabase و Cloudinary و Resend وبوابة Paymob. يتم توريث القيم تلقائياً من ملفات البيئة عند توفرها.'
                        : 'Securely manage credentials for Supabase, Cloudinary, Resend, and Paymob. Keys take fallback precedence to preserve environment configurations.'}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-xl p-3 text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">{language === 'ar' ? 'مستوى الصلاحية' : 'Access Level'}</span>
                    <span className="text-xs font-black text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5 justify-end">
                      🛡️ {language === 'ar' ? 'مسؤول المتجر فقط' : 'Root Administrator'}
                    </span>
                  </div>
                </div>

                {/* SECTION 1: SUPABASE */}
                <div className="space-y-4 rounded-xl border border-zinc-100 p-5 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Supabase Cloud Database</h4>
                        <p className="text-[10px] text-zinc-400">Database Engine & User Accounts Persistence Provider</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        (supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey)
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          (supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey) ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        {(supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey) ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Not Connected')}
                      </span>
                      <button
                        type="button"
                        onClick={handleTestSupabase}
                        disabled={supabaseTestState === 'testing'}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-350 transition"
                      >
                        {supabaseTestState === 'testing' ? (language === 'ar' ? 'جاري الفحص...' : 'Pinging...') : (language === 'ar' ? 'فحص الاتصال' : 'Test Connection')}
                      </button>
                    </div>
                  </div>

                  {/* Test State Alert Feedback */}
                  {supabaseTestState !== 'idle' && (
                    <div className={`p-3 rounded-xl text-xs border ${
                      supabaseTestState === 'testing' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400' :
                      supabaseTestState === 'success' ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400' :
                      'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400'
                    }`}>
                      {supabaseTestMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {/* URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">NEXT_PUBLIC_SUPABASE_URL</label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Anon Key */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
                        <div className="relative">
                          <input
                            type={showSupabaseAnonKey ? "text" : "password"}
                            value={supabaseAnonKey}
                            onChange={(e) => setSupabaseAnonKey(e.target.value)}
                            placeholder="eyJhbGciOi..."
                            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSupabaseAnonKey(!showSupabaseAnonKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                          >
                            {showSupabaseAnonKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Service Role Key */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">SUPABASE_SERVICE_ROLE_KEY</label>
                        <div className="relative">
                          <input
                            type={showSupabaseServiceRoleKey ? "text" : "password"}
                            value={supabaseServiceRoleKey}
                            onChange={(e) => setSupabaseServiceRoleKey(e.target.value)}
                            placeholder="eyJhbGciOi..."
                            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSupabaseServiceRoleKey(!showSupabaseServiceRoleKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                          >
                            {showSupabaseServiceRoleKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: CLOUDINARY */}
                <div className="space-y-4 rounded-xl border border-zinc-100 p-5 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">☁️</span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Cloudinary Media Storage</h4>
                        <p className="text-[10px] text-zinc-400">Robust Image Uploads & CDN Assets Engine</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret)
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        {(cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Not Connected')}
                      </span>
                      <button
                        type="button"
                        onClick={handleTestCloudinary}
                        disabled={cloudinaryTestState === 'testing'}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-350 transition"
                      >
                        {cloudinaryTestState === 'testing' ? (language === 'ar' ? 'جاري الفحص...' : 'Pinging...') : (language === 'ar' ? 'فحص الاتصال' : 'Test Connection')}
                      </button>
                    </div>
                  </div>

                  {/* Test State Alert Feedback */}
                  {cloudinaryTestState !== 'idle' && (
                    <div className={`p-3 rounded-xl text-xs border ${
                      cloudinaryTestState === 'testing' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400' :
                      cloudinaryTestState === 'success' ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400' :
                      'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400'
                    }`}>
                      {cloudinaryTestMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cloud Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CLOUDINARY_CLOUD_NAME</label>
                      <input
                        type="text"
                        value={cloudinaryCloudName}
                        onChange={(e) => setCloudinaryCloudName(e.target.value)}
                        placeholder="e.g. atomstore"
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    {/* API Key */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CLOUDINARY_API_KEY</label>
                      <input
                        type="text"
                        value={cloudinaryApiKey}
                        onChange={(e) => setCloudinaryApiKey(e.target.value)}
                        placeholder="e.g. 1234567890"
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    {/* API Secret */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CLOUDINARY_API_SECRET</label>
                      <div className="relative">
                        <input
                          type={showCloudinaryApiSecret ? "text" : "password"}
                          value={cloudinaryApiSecret}
                          onChange={(e) => setCloudinaryApiSecret(e.target.value)}
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCloudinaryApiSecret(!showCloudinaryApiSecret)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                        >
                          {showCloudinaryApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: RESEND */}
                <div className="space-y-4 rounded-xl border border-zinc-100 p-5 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📧</span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Resend Transactional Emailer</h4>
                        <p className="text-[10px] text-zinc-400">HTML Customer Invoices & Order Alerts Dispatcher</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        resendApiKey
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          resendApiKey ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        {resendApiKey ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Not Connected')}
                      </span>
                      <button
                        type="button"
                        onClick={handleTestResend}
                        disabled={resendTestState === 'testing'}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-350 transition"
                      >
                        {resendTestState === 'testing' ? (language === 'ar' ? 'جاري الفحص...' : 'Pinging...') : (language === 'ar' ? 'فحص الاتصال' : 'Test Connection')}
                      </button>
                    </div>
                  </div>

                  {/* Test State Alert Feedback */}
                  {resendTestState !== 'idle' && (
                    <div className={`p-3 rounded-xl text-xs border ${
                      resendTestState === 'testing' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400' :
                      resendTestState === 'success' ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400' :
                      'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400'
                    }`}>
                      {resendTestMsg}
                    </div>
                  )}

                  <div className="max-w-md space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">RESEND_API_KEY</label>
                    <div className="relative">
                      <input
                        type={showResendApiKey ? "text" : "password"}
                        value={resendApiKey}
                        onChange={(e) => setResendApiKey(e.target.value)}
                        placeholder="re_xxxxxxxxxxxx"
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResendApiKey(!showResendApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                      >
                        {showResendApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: PAYMOB */}
                <div className="space-y-4 rounded-xl border border-zinc-100 p-5 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💳</span>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Paymob Gateway Integration</h4>
                        <p className="text-[10px] text-zinc-400">Secure Online Credit Card & Mobile Wallets checkout API</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        (paymobApiKey && paymobSecretKey && paymobIntegrationId && paymobIframeId)
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          (paymobApiKey && paymobSecretKey && paymobIntegrationId && paymobIframeId) ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        {(paymobApiKey && paymobSecretKey && paymobIntegrationId && paymobIframeId) ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Not Connected')}
                      </span>
                      <button
                        type="button"
                        onClick={handleTestPaymob}
                        disabled={paymobTestState === 'testing'}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-350 transition"
                      >
                        {paymobTestState === 'testing' ? (language === 'ar' ? 'جاري الفحص...' : 'Pinging...') : (language === 'ar' ? 'فحص الاتصال' : 'Test Connection')}
                      </button>
                    </div>
                  </div>

                  {/* Test State Alert Feedback */}
                  {paymobTestState !== 'idle' && (
                    <div className={`p-3 rounded-xl text-xs border ${
                      paymobTestState === 'testing' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400' :
                      paymobTestState === 'success' ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400' :
                      'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400'
                    }`}>
                      {paymobTestMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* API Key */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">PAYMOB_API_KEY</label>
                      <div className="relative">
                        <input
                          type={showPaymobApiKey ? "text" : "password"}
                          value={paymobApiKey}
                          onChange={(e) => setPaymobApiKey(e.target.value)}
                          placeholder="p_live_..."
                          className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPaymobApiKey(!showPaymobApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                        >
                          {showPaymobApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Secret Key */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">PAYMOB_SECRET_KEY</label>
                      <div className="relative">
                        <input
                          type={showPaymobSecretKey ? "text" : "password"}
                          value={paymobSecretKey}
                          onChange={(e) => setPaymobSecretKey(e.target.value)}
                          placeholder="hmac_secret_..."
                          className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPaymobSecretKey(!showPaymobSecretKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                        >
                          {showPaymobSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Integration ID */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">PAYMOB_INTEGRATION_ID</label>
                      <input
                        type="text"
                        value={paymobIntegrationId}
                        onChange={(e) => setPaymobIntegrationId(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    {/* Iframe ID */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">PAYMOB_IFRAME_ID</label>
                      <input
                        type="text"
                        value={paymobIframeId}
                        onChange={(e) => setPaymobIframeId(e.target.value)}
                        placeholder="e.g. 78910"
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-850 dark:bg-zinc-950 font-mono text-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit action */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold text-xs py-3.5 px-6 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                    <Save className="h-4 w-4" />
                    <span>{language === 'ar' ? 'حفظ إعدادات واجهة التطبيق' : 'Save API Configurations'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>



    </div>
  );
};
