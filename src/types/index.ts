export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  brandAr?: string;
  brandEn?: string;
  sizes?: string[];
  colors?: string[];
  hidden?: boolean;
  specificationsAr?: string;
  specificationsEn?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  image: string;
}

export interface OrderItem {
  productId: string;
  nameAr: string;
  nameEn: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus = 'pending' | 'waiting_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: 'COD' | 'Paymob' | 'Vodafone Cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  governorateAr: string;
  governorateEn: string;
  cityAr: string;
  cityEn: string;
  street: string;
  building: string;
  apartment: string;
  notes?: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  value: number;
  minOrderValue: number;
  active: boolean;
  expiresAt: string;
}

export interface WebsiteSettings {
  siteNameAr: string;
  siteNameEn: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  shippingFeeEgypt: number;
  freeShippingThreshold: number;
  vodafoneCashNumber?: string;
  paymobApiKey?: string;
  paymobSecretKey?: string;
  paymobIntegrationId?: string;
  paymobIframeId?: string;
  futureProviderApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  resendApiKey?: string;
}

// Translation keys
export type TranslationKey =
  | 'appName'
  | 'searchPlaceholder'
  | 'categories'
  | 'featuredCategories'
  | 'bestSellers'
  | 'newArrivals'
  | 'offers'
  | 'addToCart'
  | 'addedToCart'
  | 'buyNow'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'myProfile'
  | 'myOrders'
  | 'adminPanel'
  | 'logout'
  | 'login'
  | 'register'
  | 'currency'
  | 'home'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacyPolicy'
  | 'terms'
  | 'whatsappSupport'
  | 'newsletterTitle'
  | 'newsletterDesc'
  | 'subscribe'
  | 'allProducts'
  | 'filterBy'
  | 'sortBy'
  | 'priceLowHigh'
  | 'priceHighLow'
  | 'ratingHighLow'
  | 'stockStatus'
  | 'inStock'
  | 'outOfStock'
  | 'emptyCart'
  | 'emptyWishlist'
  | 'subtotal'
  | 'shipping'
  | 'freeShipping'
  | 'total'
  | 'checkoutTitle'
  | 'fullName'
  | 'phoneNumber'
  | 'governorate'
  | 'city'
  | 'street'
  | 'building'
  | 'apartment'
  | 'orderNotes'
  | 'placeOrder'
  | 'orderSuccess'
  | 'orderSuccessDesc'
  | 'orderId'
  | 'orderStatus'
  | 'pending'
  | 'waiting_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'cashOnDelivery'
  | 'continueShopping'
  | 'noOrders'
  | 'adminDashboard'
  | 'adminProducts'
  | 'adminOrders'
  | 'adminCustomers'
  | 'adminCoupons'
  | 'adminSettings'
  | 'totalSales'
  | 'totalOrders'
  | 'activeCustomers'
  | 'activeCoupons'
  | 'recentOrders'
  | 'productManagement'
  | 'addNewProduct'
  | 'editProduct'
  | 'deleteProduct'
  | 'save'
  | 'cancel'
  | 'productNameAr'
  | 'productNameEn'
  | 'descriptionAr'
  | 'descriptionEn'
  | 'priceLabel'
  | 'comparePriceLabel'
  | 'stockLabel'
  | 'categoryLabel'
  | 'imageUrls'
  | 'viewStore'
  | 'searchProducts'
  | 'filters'
  | 'reviews'
  | 'writeReview'
  | 'rating'
  | 'comment'
  | 'submitReview'
  | 'allCategories'
  | 'couponCode'
  | 'apply'
  | 'couponApplied'
  | 'invalidCoupon'
  | 'savedAddresses'
  | 'addAddress'
  | 'noAddresses'
  | 'addressDeleted'
  | 'notifications'
  | 'markAllRead'
  | 'error404Title'
  | 'error404Desc'
  | 'backToHome'
  | 'unauthorized'
  | 'unauthorizedDesc'
  | 'searchResultFor';
