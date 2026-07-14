/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { EGYPT_GOVERNORATES } from '../constants';
import { Address } from '../types';
import { ShieldCheck, MapPin, Truck, Plus, Trash2, LogOut, ArrowRight, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    login,
    register,
    logout,
    addAddress,
    deleteAddress,
    orders,
    navigateTo,
  } = useStore();

  // Auth panel modes
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [profileTab, setProfileTab] = useState<'orders' | 'addresses'>('orders');

  // Login inputs
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Address inputs
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [govId, setGovId] = useState('cairo');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');

  const [loading, setLoading] = useState(false);

  // --- SUBMISSIONS ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!email) return;

    setLoading(true);
    const success = await login(email);
    setLoading(false);

    if (!success) {
      setLoginError(language === 'ar' ? 'فشل تسجيل الدخول. يرجى مراجعة بريدك الإلكتروني.' : 'Login failed. Please check your email.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName || !regEmail || !regPhone) return;

    setLoading(true);
    const success = await register(regName, regEmail, regPhone);
    setLoading(false);

    if (!success) {
      setRegError(language === 'ar' ? 'البريد الإلكتروني مسجل بالفعل.' : 'Email is already registered.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setAuthMode('login');
    }, 4000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city || !street || !building || !apartment) return;

    const gov = EGYPT_GOVERNORATES.find(g => g.id === govId) || EGYPT_GOVERNORATES[0];

    addAddress({
      fullName,
      phone,
      governorateAr: gov.nameAr,
      governorateEn: gov.nameEn,
      cityAr: city,
      cityEn: city,
      street,
      building,
      apartment,
      isDefault: true,
    });

    // Reset and close
    setShowAddressForm(false);
    setFullName('');
    setPhone('');
    setCity('');
    setStreet('');
    setBuilding('');
    setApartment('');
  };

  // --- AUTH FORMS ---
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 dark:text-zinc-100" id="auth-panel-view">
        
        {/* LOGIN SCREEN */}
        {authMode === 'login' && (
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center">
              <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                {t('login')}
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                {language === 'ar' ? 'أدخل بريدك الإلكتروني للدخول السريع لحسابك في أتوم.' : 'Access your luxury account details and addresses.'}
              </p>
            </div>

            {loginError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold dark:bg-red-950/20 dark:text-red-400">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-xs font-bold">
                <label className="text-[10px] uppercase text-zinc-400 tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-4 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs transition duration-300 flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>{t('login')}</span>}
              </button>
            </form>

            <div className="flex flex-col gap-2.5 items-center text-xs border-t border-zinc-50 dark:border-zinc-800 pt-4">
              <button onClick={() => setAuthMode('register')} className="text-yellow-600 dark:text-yellow-400 hover:underline">
                {language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : 'No account? Sign up here'}
              </button>
              <button onClick={() => setAuthMode('forgot')} className="text-zinc-400 hover:text-zinc-500 hover:underline text-[11px]">
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </button>
            </div>
          </div>
        )}

        {/* REGISTER SCREEN */}
        {authMode === 'register' && (
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center">
              <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                {t('register')}
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                {language === 'ar' ? 'انضم إلينا كعضو مميز لمتابعة طلباتك بخصوصية.' : 'Join AtoM for tracking addresses and purchases.'}
              </p>
            </div>

            {regError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold dark:bg-red-950/20 dark:text-red-400">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1 text-xs font-bold">
                <label className="text-[10px] uppercase text-zinc-400 tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aly Maher"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-4 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div className="space-y-1 text-xs font-bold">
                <label className="text-[10px] uppercase text-zinc-400 tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-4 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div className="space-y-1 text-xs font-bold">
                <label className="text-[10px] uppercase text-zinc-400 tracking-wider">Egyptian Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01212345678"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-4 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs transition duration-300 flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>{t('register')}</span>}
              </button>
            </form>

            <div className="text-center border-t border-zinc-50 dark:border-zinc-800 pt-4">
              <button onClick={() => setAuthMode('login')} className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-semibold">
                {language === 'ar' ? 'لديك حساب بالفعل؟ سجل دخولك' : 'Already have an account? Log in'}
              </button>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD SCREEN */}
        {authMode === 'forgot' && (
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center">
              <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                We will email you a secure link to reset your account credentials.
              </p>
            </div>

            {forgotSent ? (
              <div className="rounded-xl bg-green-50 p-4 text-xs text-green-600 font-semibold dark:bg-green-950/20 dark:text-green-400">
                ✔️ Reset link sent successfully to {forgotEmail}. Redirecting...
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1 text-xs font-bold">
                  <label className="text-[10px] uppercase text-zinc-400 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-4 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-bold py-3 px-4 rounded-xl text-xs transition duration-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  Send Recovery Email
                </button>
              </form>
            )}

            <div className="text-center">
              <button onClick={() => setAuthMode('login')} className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline">
                {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- LOGGED IN CUSTOMER DASHBOARD ---
  const customerOrders = orders.filter(o => o.userId === currentUser.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 dark:text-zinc-100" id="customer-profile-dashboard">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-zinc-100 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4 text-left rtl:text-right">
          <div className="rounded-full bg-yellow-600 p-4 text-zinc-950 font-black text-lg">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider">{currentUser.name}</h2>
            <p className="text-xs text-zinc-400 mt-1">{currentUser.email} • {currentUser.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin')}
              className="rounded-xl border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-zinc-950 py-2.5 px-5 text-xs font-bold transition"
            >
              Control Panel
            </button>
          )}
          <button
            onClick={logout}
            className="rounded-xl bg-zinc-100 hover:bg-red-50 hover:text-red-600 py-2.5 px-5 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:text-zinc-200 transition flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Grid: Tabs & Panel Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation panel */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 pb-2 border-b border-zinc-100 lg:border-b-0 lg:pb-0 overflow-x-auto lg:overflow-x-visible scrollbar-none">
          <button
            onClick={() => setProfileTab('orders')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              profileTab === 'orders'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>{t('myOrders')} ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setProfileTab('addresses')}
            className={`flex items-center gap-2.5 rounded-xl py-3 px-4 text-xs font-bold transition whitespace-nowrap w-full ${
              profileTab === 'addresses'
                ? 'bg-zinc-950 text-white dark:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>{t('savedAddresses')} ({currentUser.addresses.length})</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="lg:col-span-9">
          
          {/* TAB: ORDERS */}
          {profileTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('myOrders')}</h3>

              {customerOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
                  <Truck className="h-10 w-10 mx-auto mb-4" />
                  <p className="text-xs font-bold">{t('noOrders')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map(o => (
                    <div key={o.id} className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Order ID</span>
                          <span className="text-xs font-black text-yellow-600 font-mono">{o.id}</span>
                        </div>
                        <div className="text-right rtl:text-left">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Status</span>
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                            o.status === 'delivered' ? 'bg-green-50 text-green-700 dark:bg-green-950/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                          }`}>
                            {t(o.status as any)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {o.items.map((item, index) => (
                          <div key={index} className="flex gap-3 text-xs items-center">
                            <img src={item.image} alt={item.nameEn} className="h-8 w-8 rounded-md object-cover bg-zinc-50" />
                            <span className="flex-1 text-zinc-600 dark:text-zinc-300">
                              {language === 'ar' ? item.nameAr : item.nameEn} x {item.quantity}
                            </span>
                            <span className="font-bold">{item.price.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                        <span className="text-zinc-400">{new Date(o.createdAt).toLocaleDateString(language, {year: 'numeric', month: 'long', day: 'numeric'})}</span>
                        <span className="font-black text-zinc-900 dark:text-white text-sm">Total: {o.total.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {profileTab === 'addresses' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('savedAddresses')}</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="rounded-xl bg-yellow-600 hover:bg-yellow-500 text-zinc-950 text-xs font-bold py-2.5 px-4 transition flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('addAddress')}</span>
                </button>
              </div>

              {/* Address builder form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="rounded-2xl border border-yellow-600/10 bg-zinc-50 p-5 dark:bg-zinc-900/40 space-y-4 animate-in slide-in-from-top-4 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">{t('fullName')}</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">{t('phoneNumber')}</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">{t('governorate')}</label>
                      <select
                        value={govId}
                        onChange={(e) => setGovId(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        {EGYPT_GOVERNORATES.map(g => (
                          <option key={g.id} value={g.id}>
                            {language === 'ar' ? g.nameAr : g.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">{t('city')}</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-zinc-400">{t('street')}</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">{t('building')}</label>
                      <input
                        type="text"
                        required
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">{t('apartment')}</label>
                      <input
                        type="text"
                        required
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold text-xs rounded-xl py-2.5 px-4 transition">
                      {t('save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="rounded-xl border border-zinc-200 text-zinc-600 py-2.5 px-4 text-xs transition hover:bg-zinc-100"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses List */}
              {currentUser.addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
                  <MapPin className="h-10 w-10 mx-auto mb-4" />
                  <p className="text-xs font-bold">{t('noAddresses')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.addresses.map(a => (
                    <div key={a.id} className="rounded-2xl border border-zinc-100 p-5 bg-white text-left rtl:text-right dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex justify-between items-start">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-800 dark:text-zinc-100">{a.fullName}</span>
                          {a.isDefault && (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider dark:bg-zinc-800">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 font-mono mt-0.5">{a.phone}</p>
                        <p className="text-zinc-500 dark:text-zinc-400 pt-1 leading-relaxed">
                          {language === 'ar' ? a.governorateAr : a.governorateEn}, {a.cityAr}<br />
                          {a.street}, Building {a.building}, Apt {a.apartment}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteAddress(a.id)}
                        className="text-zinc-400 hover:text-red-500 p-1 rounded-lg transition"
                        title="Delete Address"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
