/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { EGYPT_GOVERNORATES } from '../constants';
import { Address, Order } from '../types';
import { CheckCircle, Truck, MessageCircle, ArrowRight, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    language,
    t,
    cart,
    appliedCoupon,
    placeOrder,
    settings,
  } = useStore();

  // Address Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGovId, setSelectedGovId] = useState('cairo');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Vodafone Cash' | 'Paymob'>('COD');
  const [vodafoneSender, setVodafoneSender] = useState('');

  // Execution states
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;

  // Selected Governorate calculations
  const gov = EGYPT_GOVERNORATES.find(g => g.id === selectedGovId) || EGYPT_GOVERNORATES[0];
  const shippingFee = isFreeShipping ? 0 : gov.shippingFee;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal + shippingFee - discount;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validations
    if (!fullName.trim() || !phone.trim() || !city.trim() || !street.trim() || !building.trim() || !apartment.trim()) {
      setFormError(language === 'ar' ? 'يرجى ملء كافة الخانات المطلوبة قبل الإرسال.' : 'Please fill out all required fields.');
      return;
    }

    // Phone number validations
    const egyptPhoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!egyptPhoneRegex.test(phone.replace(/\s+/g, ''))) {
      setFormError(
        language === 'ar'
          ? 'يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)'
          : 'Please enter a valid Egyptian mobile number (e.g. 01012345678)'
      );
      return;
    }

    if (paymentMethod === 'Vodafone Cash') {
      const vPhone = vodafoneSender.replace(/\s+/g, '');
      if (!egyptPhoneRegex.test(vPhone)) {
        setFormError(
          language === 'ar'
            ? 'يرجى إدخال رقم محفظة فودافون كاش صحيح مكون من 11 رقماً (مثال: 01012345678)'
            : 'Please enter a valid 11-digit Vodafone Cash wallet number (e.g. 01012345678)'
        );
        return;
      }
    }

    setLoading(true);

    const addressPayload: Address = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      phone,
      governorateAr: gov.nameAr,
      governorateEn: gov.nameEn,
      cityAr: city,
      cityEn: city,
      street,
      building,
      apartment,
      notes,
    };

    const finalNotes = paymentMethod === 'Vodafone Cash'
      ? `${notes ? notes + '\n' : ''}[Vodafone Cash Wallet: ${vodafoneSender}]`
      : notes;

    try {
      const order = await placeOrder(addressPayload, finalNotes, paymentMethod);
      
      if (paymentMethod === 'Paymob') {
        const { paymobService } = await import('../services/paymob');
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || 'Guest';
        const lastName = nameParts.slice(1).join(' ') || 'Customer';

        const billingData = {
          first_name: firstName,
          last_name: lastName,
          email: 'customer@atom-egypt.com',
          phone_number: phone,
          street: street,
          building: building,
          floor: '1',
          apartment: apartment,
          city: city,
          country: 'EGP',
          state: gov.nameEn,
        };

        const result = await paymobService.initiateCardPayment(grandTotal, billingData);
        setFormError(language === 'ar' 
          ? 'تم تسجيل طلبك بنجاح. جاري توجيهك لبوابة الدفع الإلكتروني...' 
          : 'Order placed successfully. Redirecting to Paymob checkout...');
        
        setTimeout(() => {
          window.location.href = result.checkoutUrl;
        }, 1500);
      } else {
        setCreatedOrder(order);
      }
    } catch (err: any) {
      setFormError(language === 'ar' 
        ? `حدث خطأ أثناء معالجة الطلب: ${err.message || err}` 
        : `An error occurred while placing order: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS ORDER SCREEN
  if (createdOrder) {
    // Generate text message for whatsapp tracking
    const whatsappText = encodeURIComponent(
      language === 'ar'
        ? `مرحباً أتوم، أرغب في تأكيد طلبي ذو الرمز ${createdOrder.id}. الاسم: ${createdOrder.customerName}.`
        : `Hello AtoM, I would like to track my order ${createdOrder.id}. Name: ${createdOrder.customerName}.`
    );
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace('+', '')}?text=${whatsappText}`;

    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center dark:text-zinc-100" id="order-success-stage">
        <div className="inline-flex rounded-full bg-green-50 p-6 text-green-500 dark:bg-green-950/30 mb-6">
          <CheckCircle className="h-16 w-16" />
        </div>
        
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-wider">
          {t('orderSuccess')}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
          {t('orderSuccessDesc')}
        </p>

        {/* Invoice Summary */}
        <div className="mt-8 rounded-2xl border border-zinc-100 p-6 bg-white text-left rtl:text-right dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400 uppercase">{t('orderId')}</span>
            <span className="text-sm font-black text-yellow-600 dark:text-yellow-400 font-mono">{createdOrder.id}</span>
          </div>

          <div className="space-y-2 text-xs">
            {createdOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {language === 'ar' ? item.nameAr : item.nameEn} x {item.quantity}
                </span>
                <span className="font-bold">{(item.price * item.quantity).toLocaleString()} ج.م</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">{t('shipping')}</span>
              <span className="font-bold text-green-500">
                {createdOrder.shippingFee === 0 ? t('freeShipping') : `${createdOrder.shippingFee} ج.م`}
              </span>
            </div>
            {createdOrder.discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>{t('couponApplied')}</span>
                <span>-{createdOrder.discount} ج.m</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-sm font-black text-zinc-800 dark:text-zinc-100">
              <span>{t('total')}</span>
              <span>{createdOrder.total.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>

        {/* Customer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 font-bold text-white text-xs px-6 py-4 shadow-md transition"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            <span>تأكيد وشحن عبر واتساب | Confirm on WhatsApp</span>
          </a>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-zinc-200 hover:bg-zinc-50 font-bold text-zinc-700 text-xs px-6 py-4 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-200 transition"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT REDIRECT
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center" id="empty-checkout-redirect">
        <div className="rounded-full bg-zinc-50 p-6 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 mb-6">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">حقيبتك فارغة ولا يمكنك إتمام الطلب</h2>
        <button
          onClick={() => window.location.hash = 'home'}
          className="mt-6 rounded-xl bg-yellow-600 py-3 px-6 text-xs font-bold text-zinc-950 hover:bg-yellow-500 transition"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="checkout-panel">
      <h1 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-8">
        {t('checkout')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form fields */}
        <div className="lg:col-span-7">
          <form onSubmit={handleOrderSubmit} className="space-y-6">
            
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Truck className="h-4.5 w-4.5 text-yellow-600" />
                <span>{t('checkoutTitle')}</span>
              </h2>

              {formError && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold dark:bg-red-950/20 dark:text-red-400 animate-pulse">
                  {formError}
                </div>
              )}

              {/* Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('fullName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم الثلاثي أو الثنائي' : 'John Doe'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('phoneNumber')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('governorate')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedGovId}
                    onChange={(e) => setSelectedGovId(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    {EGYPT_GOVERNORATES.map(g => (
                      <option key={g.id} value={g.id}>
                        {language === 'ar' ? g.nameAr : g.nameEn} (+{g.shippingFee} ج.م شحن)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('city')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={language === 'ar' ? 'اسم المدينة أو الحي الرئيسي' : 'City or District'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('street')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder={language === 'ar' ? 'اسم الشارع، الميدان، أو العلامة المميزة' : 'Street name or landmark'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('building')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder={language === 'ar' ? 'رقم أو اسم المبنى' : 'Building number or name'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('apartment')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder={language === 'ar' ? 'الشقة والرووف / الطابق' : 'Apartment and floor number'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 block">
                    {t('orderNotes')}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'تعليمات خاصة بالتسليم للطيار' : 'e.g. deliver after 4 PM'}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 block">
                  {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                </label>
                {/* Dynamically adjust grid depending on whether Paymob is configured */}
                <div className={`grid gap-3 ${
                  (settings.paymobApiKey && settings.paymobSecretKey && settings.paymobIntegrationId && settings.paymobIframeId)
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-2'
                }`}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-yellow-600 bg-yellow-500/5 text-zinc-900 dark:text-white font-extrabold'
                        : 'border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    <span className="text-xl mb-1">💵</span>
                    <span className="text-xs">{language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Vodafone Cash')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'Vodafone Cash'
                        ? 'border-red-500 bg-red-500/5 text-zinc-900 dark:text-white font-extrabold'
                        : 'border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    <span className="text-xl mb-1">🔴</span>
                    <span className="text-xs">{language === 'ar' ? 'فودافون كاش' : 'Vodafone Cash'}</span>
                  </button>

                  {/* Paymob Option */}
                  {settings.paymobApiKey && settings.paymobSecretKey && settings.paymobIntegrationId && settings.paymobIframeId && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Paymob')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'Paymob'
                          ? 'border-yellow-600 bg-yellow-500/5 text-zinc-900 dark:text-white font-extrabold'
                          : 'border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      <span className="text-xl mb-1">💳</span>
                      <span className="text-xs">{language === 'ar' ? 'بطاقة ائتمانية / محفظة' : 'Credit Card / Wallet (Paymob)'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* COD description info */}
              {paymentMethod === 'COD' && (
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-100">💵 {t('cashOnDelivery')}</span>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    {language === 'ar'
                      ? 'ستدفع نقداً لمندوب الشحن عند باب منزلك فور فحص واستلام طلبيتك بسلامة.'
                      : 'You will settle the amount in cash directly to our delivery courier upon physical verification and handover.'}
                  </p>
                </div>
              )}

              {/* Vodafone Cash description info */}
              {paymentMethod === 'Vodafone Cash' && (
                <div className="rounded-xl border border-red-100 bg-red-50/30 p-4 dark:border-red-950/20 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-red-600 dark:text-red-400">🔴 فودافون كاش | Vodafone Cash Instructions</span>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? `يرجى تحويل القيمة الإجمالية للطلب (${grandTotal.toLocaleString()} ج.م) إلى رقم محفظة فودافون كاش التالي:`
                        : `Please transfer the exact total amount (${grandTotal.toLocaleString()} EGP) to our official Vodafone Cash wallet below:`}
                    </p>
                    <div className="mt-2 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-red-100 dark:border-red-900/40 text-center font-bold">
                      <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono tracking-wider block">
                        {settings.vodafoneCashNumber || '01032120351'}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">اسم الحساب: AtoM Store</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 block">
                      {language === 'ar' ? 'رقم الهاتف المرسل منه التحويل *' : 'Sender Wallet Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={vodafoneSender}
                      onChange={(e) => setVodafoneSender(e.target.value)}
                      placeholder="e.g. 01012345678"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <p className="text-[10px] text-zinc-400">
                      {language === 'ar'
                        ? 'سنقوم بالتحقق من استلام المبلغ تلقائياً وتأكيد طلبك فوراً.'
                        : 'We will verify the incoming transfer and approve your order automatically.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Paymob description info */}
              {paymentMethod === 'Paymob' && (
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-100">💳 {language === 'ar' ? 'الدفع الإلكتروني عبر بيموب' : 'Paymob Online Payment'}</span>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    {language === 'ar'
                      ? 'سيتم توجيهك لبوابة الدفع الآمنة لاستكمال عملية الدفع باستخدام بطاقتك الائتمانية أو محفظتك الإلكترونية.'
                      : 'You will be securely routed to Paymob checkout to complete the payment via card or mobile wallet.'}
                  </p>
                </div>
              )}

            </div>

            {/* Submission triggers */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold py-4 px-4 rounded-xl text-xs transition duration-300 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري تسجيل الطلب الفاخر...</span>
                </>
              ) : (
                <>
                  <span>{t('placeOrder')}</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Dynamic checkout sidebar items summary */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6 sticky top-24">
            
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              {language === 'ar' ? 'محتويات الحقيبة' : 'Order Items'}
            </h2>

            {/* Item list */}
            <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.nameEn}
                    className="h-14 w-14 rounded-lg object-cover bg-zinc-50 dark:bg-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                      {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                    </h4>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">
                      {item.product.price.toLocaleString()} x {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                    {(item.product.price * item.quantity).toLocaleString()} ج.م
                  </span>
                </div>
              ))}
            </div>

            {/* Sums */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="text-zinc-900 dark:text-white font-bold">{subtotal.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {isFreeShipping ? (
                    <span className="text-green-500 font-bold">{t('freeShipping')}</span>
                  ) : (
                    `${shippingFee} ج.م`
                  )}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-500">
                  <span>{t('couponApplied')} ({appliedCoupon.code})</span>
                  <span>-{discount.toLocaleString()} ج.م</span>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                <span>{t('total')}</span>
                <span className="text-zinc-950 dark:text-white font-black text-base">{grandTotal.toLocaleString()} ج.م</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
