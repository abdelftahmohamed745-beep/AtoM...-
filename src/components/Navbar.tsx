/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, ShoppingBag, Heart, User, Sun, Moon, Globe, Menu, X, Bell, LogOut, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    navigateTo,
    t,
    cart,
    wishlist,
    currentUser,
    logout,
    categories,
    notifications,
    markAllNotificationsRead,
    searchQuery,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('products', { query: localSearch });
  };

  const handleCategorySelect = (id: string) => {
    navigateTo('products', { categoryId: id });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-zinc-950/95" id="navbar-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')} id="nav-logo">
            <span className="bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-2xl font-black tracking-widest text-transparent dark:from-yellow-400 dark:to-amber-500">
              AtoM
            </span>
            <span className="hidden text-xs uppercase tracking-widest text-zinc-400 sm:block dark:text-zinc-500 font-mono">
              FOOTWEAR
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4 rtl:space-x-reverse" id="nav-desktop-menu">
            <button
              onClick={() => navigateTo('home')}
              className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-yellow-600 dark:text-zinc-300 dark:hover:text-yellow-400 transition"
            >
              {t('home')}
            </button>
            
            {/* Mega Menu Dropdown */}
            <div className="group relative">
              <button className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-yellow-600 dark:text-zinc-300 dark:hover:text-yellow-400 transition">
                {t('categories')}
              </button>
              <div className="invisible absolute top-full left-1/2 z-50 w-80 -translate-x-1/2 transform rounded-xl border border-zinc-100 bg-white p-4 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2">
                  {t('featuredCategories')}
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="flex items-center gap-3 rounded-lg p-2 text-left rtl:text-right hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition text-sm text-zinc-800 dark:text-zinc-200"
                    >
                      <img src={cat.image} alt={cat.nameEn} className="h-10 w-10 rounded-md object-cover" />
                      <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                    </button>
                  ))}
                  <div className="border-t border-zinc-100 dark:border-zinc-800 mt-2 pt-2">
                    <button
                      onClick={() => navigateTo('products', { categoryId: '' })}
                      className="w-full text-center text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline"
                    >
                      {t('allProducts')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('about')}
              className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-yellow-600 dark:text-zinc-300 dark:hover:text-yellow-400 transition"
            >
              {t('about')}
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-yellow-600 dark:text-zinc-300 dark:hover:text-yellow-400 transition"
            >
              {t('contact')}
            </button>
            <button
              onClick={() => navigateTo('faq')}
              className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-yellow-600 dark:text-zinc-300 dark:hover:text-yellow-400 transition"
            >
              {t('faq')}
            </button>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex max-w-xs items-center relative" id="desktop-search-form">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-64 rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-4 pr-10 text-xs text-zinc-800 focus:border-yellow-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-yellow-400"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1 sm:gap-3" id="nav-toolbar">
            
            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 transition"
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 transition"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notifications Panel */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 transition"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notification Box */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-zinc-100 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{t('notifications')}</span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={() => {
                          markAllNotificationsRead();
                          setNotifOpen(false);
                        }}
                        className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-zinc-400 py-4">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded-lg text-xs transition ${n.read ? 'bg-transparent' : 'bg-zinc-50 dark:bg-zinc-800/40'}`}>
                          <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                            {language === 'ar' ? n.titleAr : n.titleEn}
                          </p>
                          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                            {language === 'ar' ? n.descAr : n.descEn}
                          </p>
                          <span className="text-[10px] text-zinc-400 block mt-1">
                            {new Date(n.createdAt).toLocaleTimeString(language, {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="relative rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 transition"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Link */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 transition"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-600 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Quick Panel */}
            <div className="relative group">
              <button
                onClick={() => currentUser ? navigateTo('profile') : navigateTo('login')}
                className="flex items-center gap-1 rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 transition"
              >
                <User className="h-5 w-5" />
                {currentUser && (
                  <span className="hidden md:inline text-xs font-semibold max-w-16 truncate text-zinc-800 dark:text-zinc-200">
                    {currentUser.name}
                  </span>
                )}
              </button>

              {currentUser && (
                <div className="invisible absolute right-0 mt-1 z-50 w-48 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="px-3 py-2 border-b border-zinc-50 dark:border-zinc-800 mb-1">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{currentUser.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => navigateTo('profile')}
                    className="w-full text-left rtl:text-right px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400"
                  >
                    {t('myProfile')}
                  </button>
                  <button
                    onClick={() => navigateTo('orders')}
                    className="w-full text-left rtl:text-right px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400"
                  >
                    {t('myOrders')}
                  </button>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => navigateTo('admin')}
                      className="w-full text-left rtl:text-right flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-600 hover:bg-zinc-50 dark:text-amber-400 dark:hover:bg-zinc-800"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {t('adminPanel')}
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left rtl:text-right flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-yellow-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-yellow-400 md:hidden transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-4 px-4 shadow-inner dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4 flex w-full items-center">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-4 pr-10 text-xs text-zinc-800 focus:border-yellow-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button type="submit" className="absolute right-3 top-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}
              className="text-left rtl:text-right py-1.5 text-sm font-medium text-zinc-800 hover:text-yellow-600 dark:text-zinc-200"
            >
              {t('home')}
            </button>

            {/* Categories segment */}
            <div className="py-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                {t('categories')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-100 hover:border-yellow-500 dark:border-zinc-900 dark:hover:border-yellow-500 text-xs transition"
                  >
                    <img src={cat.image} alt={cat.nameEn} className="h-10 w-10 rounded-full object-cover mb-1.5" />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {language === 'ar' ? cat.nameAr : cat.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { navigateTo('about'); setMobileMenuOpen(false); }}
              className="text-left rtl:text-right py-1.5 text-sm font-medium text-zinc-800 hover:text-yellow-600 dark:text-zinc-200"
            >
              {t('about')}
            </button>
            <button
              onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }}
              className="text-left rtl:text-right py-1.5 text-sm font-medium text-zinc-800 hover:text-yellow-600 dark:text-zinc-200"
            >
              {t('contact')}
            </button>
            <button
              onClick={() => { navigateTo('faq'); setMobileMenuOpen(false); }}
              className="text-left rtl:text-right py-1.5 text-sm font-medium text-zinc-800 hover:text-yellow-600 dark:text-zinc-200"
            >
              {t('faq')}
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                className="text-left rtl:text-right py-2 text-sm font-bold text-amber-600 dark:text-amber-400 border-t border-zinc-100 dark:border-zinc-800 pt-3"
              >
                {t('adminPanel')}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
