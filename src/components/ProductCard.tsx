/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../store';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, addToCart, wishlist, toggleWishlist, navigateTo, categories } = useStore();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const isInWishlist = wishlist.some(p => p.id === product.id);

  const category = categories.find(c => c.id === product.categoryId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleCardClick = () => {
    navigateTo('product-details', { productId: product.id });
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-100 p-3 shadow-sm hover:shadow-xl hover:border-yellow-600/20 transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-yellow-400/20 cursor-pointer"
      id={`product-card-${product.id}`}
    >
      
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800">
        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 rtl:left-auto rtl:right-2.5">
          {hasDiscount && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.bestSeller && (
            <span className="rounded-full bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-yellow-500 uppercase tracking-wider dark:bg-zinc-900/90">
              {t('bestSellers')}
            </span>
          )}
          {product.newArrival && (
            <span className="rounded-full bg-yellow-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              {t('newArrivals')}
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
              {t('outOfStock')}
            </span>
          )}
        </div>

        {/* Wishlist Quick Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/90 p-2 text-zinc-600 shadow-md backdrop-blur-sm hover:bg-white hover:text-red-500 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:text-red-500 transition-all duration-300 rtl:right-auto rtl:left-2.5"
        >
          <Heart className={`h-4.5 w-4.5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Dynamic Image swaps */}
        <img
          src={hovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.nameEn}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Quick View Cover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="h-4 w-4" />
            {language === 'ar' ? 'تفاصيل المقتنى' : 'View Offering'}
          </span>
        </div>

      </div>

      {/* Meta Content */}
      <div className="flex flex-col flex-1 pt-4 pb-2 px-1">
        
        {/* Category Label */}
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          {category ? (language === 'ar' ? category.nameAr : category.nameEn) : product.categoryId}
        </span>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mt-1.5 line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
          {language === 'ar' ? product.nameAr : product.nameEn}
        </h3>

        {/* Ratings & Reviews */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Pricing Segment */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-sm font-black text-zinc-900 dark:text-white">
            {product.price.toLocaleString()} <span className="text-[10px] font-medium text-zinc-500">{t('currency')}</span>
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">
              {product.compareAtPrice!.toLocaleString()} {t('currency')}
            </span>
          )}
        </div>

        {/* Quick Add CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || added}
          className={`mt-4 w-full rounded-xl py-2.5 px-3 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 border ${
            added
              ? 'bg-green-500 text-white border-green-500'
              : isOutOfStock
              ? 'bg-zinc-100 text-zinc-400 border-zinc-100 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 dark:border-zinc-800'
              : 'bg-zinc-950 text-white border-zinc-950 hover:bg-yellow-600 hover:border-yellow-600 hover:text-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white dark:hover:bg-yellow-400 dark:hover:border-yellow-400'
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{added ? t('addedToCart') : t('addToCart')}</span>
        </button>

      </div>

    </div>
  );
};
