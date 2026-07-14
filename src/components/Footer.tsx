/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { Mail, Phone, MessageCircle, ArrowRight, ArrowLeft, Facebook, Instagram, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t, navigateTo, settings, categories } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900 transition-colors dark:bg-black" id="footer-section">
      
      {/* Brand Values Row */}
      <div className="border-b border-zinc-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left rtl:md:text-right">
          
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="rounded-full bg-zinc-900 p-3 text-yellow-500">
              <Truck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('freeShipping')}</h4>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              {language === 'ar' 
                ? `شحن مجاني وسريع لكافة المحافظات في مصر للطلبات التي تتخطى ${settings.freeShippingThreshold} جنيه.`
                : `Fast and complimentary delivery across Egypt for fine orders exceeding ${settings.freeShippingThreshold} EGP.`}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="rounded-full bg-zinc-900 p-3 text-yellow-500">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">14-Day Returns</h4>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              {language === 'ar'
                ? 'استرجاع واستبدال مريح وسلس بدون شروط طالما كان المقتنى مغلفاً بعبوته الأصلية.'
                : 'Enjoy stress-free returns and sizing exchange within 14 days, keeping items in original packaging.'}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="rounded-full bg-zinc-900 p-3 text-yellow-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Authentic Curation</h4>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              {language === 'ar'
                ? 'نضمن جودة وأصالة كافة الأحذية المصنوعة يدوياً من أفخم خامات الجلود الطبيعية وبأعلى درجات المتانة والراحة.'
                : 'We guarantee 100% premium quality, authentic handcrafted leather footwear built for durability and comfort.'}
            </p>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Support */}
        <div className="space-y-4">
          <span className="text-2xl font-black tracking-widest text-white">AtoM</span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {language === 'ar'
              ? 'دار التصميم المصرية للأحذية الفاخرة، نقدم تشكيلة راقية من الأحذية الرياضية والكلاسيكية المصنوعة يدوياً بأجود الخامات المحلية والعالمية.'
              : 'The leading Egyptian premium footwear brand, offering handcrafted athletic, casual, and formal leather shoes designed for ultimate distinction.'}
          </p>
          
          <div className="space-y-2.5 pt-2 text-xs">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-green-500 transition"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>{t('whatsappSupport')}: {settings.whatsappNumber}</span>
            </a>
            <div className="flex items-center gap-2 text-zinc-400">
              <Phone className="h-4 w-4 text-zinc-500" />
              <span>{settings.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Mail className="h-4 w-4 text-zinc-500" />
              <span>{settings.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('categories')}</h4>
          <ul className="space-y-2 text-xs">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => navigateTo('products', { categoryId: cat.id })} className="text-zinc-400 hover:text-white transition">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AtoM Club</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigateTo('about')} className="text-zinc-400 hover:text-white transition">{t('about')}</button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="text-zinc-400 hover:text-white transition">{t('contact')}</button>
            </li>
            <li>
              <button onClick={() => navigateTo('faq')} className="text-zinc-400 hover:text-white transition">{t('faq')}</button>
            </li>
            <li>
              <button onClick={() => navigateTo('privacy')} className="text-zinc-400 hover:text-white transition">{t('privacyPolicy')}</button>
            </li>
            <li>
              <button onClick={() => navigateTo('terms')} className="text-zinc-400 hover:text-white transition">{t('terms')}</button>
            </li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('newsletterTitle')}</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">{t('newsletterDesc')}</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 relative">
            <div className="flex w-full relative">
              <input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني...' : 'Email Address...'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-yellow-600 focus:bg-zinc-900/50"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-yellow-600 hover:bg-yellow-500 rounded-md p-1.5 text-zinc-950 transition rtl:right-auto rtl:left-1"
              >
                {language === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>

            {subscribed && (
              <span className="text-[11px] text-green-400 block animate-pulse">
                {language === 'ar' ? 'تم تسجيل بريدك بنجاح! شكراً لك.' : 'Subscribed successfully! Thank you.'}
              </span>
            )}
          </form>

          <div className="flex gap-4 pt-2">
            <a href="https://facebook.com/atom.egypt" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-500 transition">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://instagram.com/atom.egypt" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-pink-500 transition">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright row */}
      <div className="bg-zinc-900/60 py-6 border-t border-zinc-900 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AtoM Luxury. All Rights Reserved. Crafted for Egypt.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span>🇪🇬 {t('currency')} (EGP)</span>
            <span>English / العربية</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
