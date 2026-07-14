/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Ticket } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    language,
    t,
    cart,
    updateCartQty,
    removeFromCart,
    navigateTo,
    settings,
    appliedCoupon,
    couponError,
    applyPromoCode,
    removePromoCode,
    categories,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Free Shipping Threshold Progress
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const remainingForFreeShipping = settings.freeShippingThreshold - subtotal;
  const progressPercent = Math.min((subtotal / settings.freeShippingThreshold) * 100, 100);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center" id="empty-cart-view">
        <div className="rounded-full bg-zinc-50 p-6 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 mb-6">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{t('emptyCart')}</h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2 max-w-xs">
          {language === 'ar'
            ? 'تصفح تشكيلة الأحذية الراقية والمتميزة وأضف حذائك الرياضي أو الكلاسيكي المفضل لحقيبتك.'
            : 'Explore our premium footwear collections and add your favorite athletic or classic shoes to your bag.'}
        </p>
        <button
          onClick={() => navigateTo('products')}
          className="mt-8 rounded-xl bg-yellow-600 py-3.5 px-8 text-xs font-bold text-zinc-950 hover:bg-yellow-500 transition duration-300"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="cart-drawer-page">
      <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-8">
        {t('cart')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Free Shipping Alert banner */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              <span>
                {isFreeShipping 
                  ? t('freeShipping') + ' ✔' 
                  : language === 'ar' 
                  ? `باقي ${remainingForFreeShipping.toLocaleString()} ج.م للشحن المجاني` 
                  : `${remainingForFreeShipping.toLocaleString()} EGP away from Free Shipping`}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden dark:bg-zinc-800">
              <div 
                className="h-full bg-yellow-600 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
            {cart.map(item => {
              const cat = categories.find(c => c.id === item.product.categoryId);
              return (
                <div key={item.product.id} className="flex py-6 items-center gap-4 sm:gap-6" id={`cart-item-${item.product.id}`}>
                  
                  {/* Product thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.nameEn}
                    className="h-20 w-20 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                      {cat ? (language === 'ar' ? cat.nameAr : cat.nameEn) : item.product.categoryId}
                    </span>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate mt-1">
                    {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                  </h3>
                  <div className="text-xs font-black text-zinc-900 dark:text-white mt-1.5">
                    {item.product.price.toLocaleString()} {t('currency')}
                  </div>
                </div>

                {/* Quantity triggers */}
                <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-2 py-1.5 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <button
                    onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                    className="p-1 hover:text-yellow-600 dark:hover:text-yellow-400 transition"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                    className="p-1 hover:text-yellow-600 dark:hover:text-yellow-400 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Subtotal & Delete action */}
                <div className="flex flex-col items-end gap-2.5">
                  <span className="text-sm font-black text-zinc-800 dark:text-zinc-100">
                    {(item.product.price * item.quantity).toLocaleString()} {t('currency')}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition"
                    title={language === 'ar' ? 'حذف من الحقيبة' : 'Remove item'}
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            );})}
          </div>
        </div>

        {/* Order summary card */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-zinc-100 p-6 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
            
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              {language === 'ar' ? 'ملخص الحساب والأسعار' : 'Bag Summary'}
            </h2>

            {/* Calculations */}
            <div className="space-y-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="text-zinc-900 dark:text-white font-bold">{subtotal.toLocaleString()} {t('currency')}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-500">
                  <span className="flex items-center gap-1">
                    <Ticket className="h-3.5 w-3.5" />
                    <span>{t('couponApplied')} ({appliedCoupon.code})</span>
                  </span>
                  <span>-{discount.toLocaleString()} {t('currency')}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <span>{t('shipping')}</span>
                <span className="text-green-500 font-bold">
                  {isFreeShipping ? t('freeShipping') : language === 'ar' ? 'يُحسب عند الدفع' : 'Calculated next'}
                </span>
              </div>

              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                <span>{t('total')}</span>
                <span className="text-zinc-950 dark:text-white font-black text-base">{grandTotal.toLocaleString()} {t('currency')}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-950/20 p-3 text-xs text-green-600 dark:text-green-400">
                  <span className="font-semibold">{appliedCoupon.code} Applied</span>
                  <button onClick={removePromoCode} className="font-bold hover:underline">
                    {language === 'ar' ? 'إزالة' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('couponCode')}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 uppercase rounded-xl border border-zinc-200 bg-zinc-50 py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-900"
                  />
                  <button type="submit" className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-4 py-2 text-xs font-bold dark:bg-zinc-800 dark:hover:bg-zinc-700">
                    {t('apply')}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500 mt-1.5 px-1">{couponError}</p>
              )}
            </div>

            {/* Checkouts triggers */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold py-4 px-4 rounded-xl text-xs transition duration-300 flex items-center justify-center gap-1.5"
            >
              <span>{t('checkout')}</span>
              {language === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Secure Payment details */}
            <div className="text-center">
              <span className="text-[10px] text-zinc-400 leading-relaxed block max-w-[200px] mx-auto">
                🔒 All orders in Egypt are securely delivered under Cash on Delivery rules.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
