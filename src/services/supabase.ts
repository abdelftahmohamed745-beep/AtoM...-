/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Supabase Integration Service
// Connects the application to a real Supabase project for all persistent operations.
// Supports lazy initialization to prevent startup crashes when keys are missing.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Product, Category, Order, Review, Coupon, WebsiteSettings, Address } from '../types';
import { getSupabaseUrl, getSupabaseAnonKey } from './config';

/*
================================================================================
SQL SCHEMA FOR YOUR SUPABASE DATABASE
Copy and paste this script into your Supabase SQL Editor to provision the tables:
================================================================================

-- Create profiles/users table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  addresses JSONB DEFAULT '[]'::jsonb,
  wishlist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  nameAr TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  nameAr TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  descriptionAr TEXT,
  descriptionEn TEXT,
  price NUMERIC NOT NULL,
  compareAtPrice NUMERIC,
  images TEXT[] DEFAULT '{}',
  categoryId TEXT,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  bestSeller BOOLEAN DEFAULT false,
  newArrival BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  reviewsCount INTEGER DEFAULT 0,
  brandAr TEXT,
  brandEn TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  hidden BOOLEAN DEFAULT false,
  specificationsAr TEXT,
  specificationsEn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  userId TEXT,
  customerName TEXT NOT NULL,
  customerPhone TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  paymentMethod TEXT NOT NULL,
  paymentStatus TEXT DEFAULT 'pending',
  shippingAddress JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shippingFee NUMERIC NOT NULL,
  discount NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discountType TEXT NOT NULL,
  value NUMERIC NOT NULL,
  minOrderValue NUMERIC NOT NULL,
  active BOOLEAN DEFAULT true,
  expiresAt TIMESTAMPTZ NOT NULL
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  siteNameAr TEXT,
  siteNameEn TEXT,
  contactPhone TEXT,
  contactEmail TEXT,
  whatsappNumber TEXT,
  facebookUrl TEXT,
  instagramUrl TEXT,
  shippingFeeEgypt NUMERIC,
  freeShippingThreshold NUMERIC,
  vodafoneCashNumber TEXT,
  paymobApiKey TEXT,
  paymobSecretKey TEXT,
  paymobIntegrationId TEXT,
  paymobIframeId TEXT,
  futureProviderApiKey TEXT
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  userName TEXT NOT NULL,
  rating NUMERIC NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create public policies so the anon key can read and write
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow anon insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow anon select categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow anon insert categories" ON public.categories FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon select products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow anon insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow anon select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow anon select coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Allow anon insert coupons" ON public.coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete coupons" ON public.coupons FOR DELETE USING (true);

CREATE POLICY "Allow anon select settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow anon insert settings" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update settings" ON public.settings FOR UPDATE USING (true);

CREATE POLICY "Allow anon select reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow anon insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
================================================================================
*/

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabase(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  if (!url || !key) {
    throw new Error('Supabase integration credentials are missing. Please configure them in your Admin Panel or environment variables.');
  }
  
  if (!supabaseInstance || lastUrl !== url || lastKey !== key) {
    supabaseInstance = createClient(url, key);
    lastUrl = url;
    lastKey = key;
  }
  
  return supabaseInstance;
}

export interface ISupabaseService {
  getCurrentUser(): Promise<User | null>;
  signUp(email: string, name: string, phone: string): Promise<User>;
  signIn(email: string): Promise<User>;
  updateUserAddresses(userId: string, addresses: Address[]): Promise<boolean>;
  updateUserWishlist(userId: string, wishlist: Product[]): Promise<boolean>;
  
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  createCategory(category: Category): Promise<Category>;
  
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Promise<Order>;
  
  getCoupons(): Promise<Coupon[]>;
  createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon>;
  deleteCoupon(id: string): Promise<boolean>;
  validateCoupon(code: string, cartTotal: number): Promise<Coupon | null>;
  
  getSettings(): Promise<WebsiteSettings | null>;
  updateSettings(settings: WebsiteSettings): Promise<boolean>;
  
  getReviews(productId?: string): Promise<Review[]>;
  createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
}

export class SupabaseService implements ISupabaseService {
  // Helper to fallback to localStorage during transitional phases if tables aren't ready yet
  private getStorageItem<T>(key: string, fallback: T): T {
    const item = localStorage.getItem(`atom_${key}`);
    return item ? JSON.parse(item) : fallback;
  }

  private setStorageItem<T>(key: string, value: T): void {
    localStorage.setItem(`atom_${key}`, JSON.stringify(value));
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const client = getSupabase();
      const localUser = this.getStorageItem<User | null>('current_user', null);
      if (!localUser) return null;
      
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', localUser.id)
        .single();
        
      if (error || !data) return localUser;
      
      const mappedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role as 'customer' | 'admin',
        addresses: Array.isArray(data.addresses) ? data.addresses : [],
        createdAt: data.created_at || new Date().toISOString()
      };
      return mappedUser;
    } catch {
      return this.getStorageItem<User | null>('current_user', null);
    }
  }

  async signUp(email: string, name: string, phone: string): Promise<User> {
    const isDevAdmin = email.toLowerCase() === 'abdelftahmohamed745@gmail.com';
    const tempId = Math.random().toString(36).substring(2, 11);
    const newUser: User = {
      id: tempId,
      name,
      email: email.toLowerCase(),
      phone,
      role: (email.includes('admin') || isDevAdmin) ? 'admin' : 'customer',
      addresses: [],
      createdAt: new Date().toISOString()
    };

    try {
      const client = getSupabase();
      const { error } = await client
        .from('profiles')
        .insert([{
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          addresses: [],
          wishlist: []
        }]);
      if (error) throw error;
    } catch (err) {
      console.warn('Could not insert profile in Supabase table (table profiles may be unprovisioned), falling back to local simulation:', err);
    }

    this.setStorageItem('current_user', newUser);
    const users = this.getStorageItem<User[]>('users', []);
    users.push(newUser);
    this.setStorageItem('users', users);
    return newUser;
  }

  async signIn(email: string): Promise<User> {
    const emailLower = email.toLowerCase();
    const isDevAdmin = emailLower === 'abdelftahmohamed745@gmail.com';

    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('email', emailLower)
        .single();
        
      if (data && !error) {
        const loggedUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role as 'customer' | 'admin',
          addresses: Array.isArray(data.addresses) ? data.addresses : [],
          createdAt: data.created_at || new Date().toISOString()
        };
        this.setStorageItem('current_user', loggedUser);
        return loggedUser;
      }
    } catch (err) {
      console.warn('Supabase signIn lookup failed:', err);
    }

    // Local authentication fallback if DB profiles don't exist
    const users = this.getStorageItem<User[]>('users', []);
    let user = users.find(u => u.email.toLowerCase() === emailLower);
    if (!user) {
      user = await this.signUp(emailLower, emailLower.split('@')[0], '+201000000000');
    } else {
      if (isDevAdmin && user.role !== 'admin') {
        user.role = 'admin';
        const updatedUsers = users.map(u => u.email.toLowerCase() === emailLower ? { ...u, role: 'admin' as const } : u);
        this.setStorageItem('users', updatedUsers);
      }
      this.setStorageItem('current_user', user);
    }
    return user;
  }

  async updateUserAddresses(userId: string, addresses: Address[]): Promise<boolean> {
    try {
      const client = getSupabase();
      const { error } = await client
        .from('profiles')
        .update({ addresses })
        .eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  }

  async updateUserWishlist(userId: string, wishlist: Product[]): Promise<boolean> {
    try {
      const client = getSupabase();
      const productIds = wishlist.map(p => p.id);
      const { error } = await client
        .from('profiles')
        .update({ wishlist: productIds })
        .eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(p => ({
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionAr: p.descriptionAr,
        descriptionEn: p.descriptionEn,
        price: parseFloat(p.price),
        compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice) : undefined,
        images: Array.isArray(p.images) ? p.images : [],
        categoryId: p.categoryId,
        stock: parseInt(p.stock) || 0,
        featured: !!p.featured,
        bestSeller: !!p.bestSeller,
        newArrival: !!p.newArrival,
        rating: parseFloat(p.rating) || 5.0,
        reviewsCount: parseInt(p.reviewsCount) || 0,
        brandAr: p.brandAr,
        brandEn: p.brandEn,
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        hidden: !!p.hidden,
        specificationsAr: p.specificationsAr,
        specificationsEn: p.specificationsEn,
        createdAt: p.created_at || new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Failed to fetch products from Supabase, loading local copy:', err);
      return this.getStorageItem<Product[]>('products', []);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) return null;
      
      return {
        id: data.id,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined,
        images: Array.isArray(data.images) ? data.images : [],
        categoryId: data.categoryId,
        stock: parseInt(data.stock) || 0,
        featured: !!data.featured,
        bestSeller: !!data.bestSeller,
        newArrival: !!data.newArrival,
        rating: parseFloat(data.rating) || 5.0,
        reviewsCount: parseInt(data.reviewsCount) || 0,
        brandAr: data.brandAr,
        brandEn: data.brandEn,
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        colors: Array.isArray(data.colors) ? data.colors : [],
        hidden: !!data.hidden,
        specificationsAr: data.specificationsAr,
        specificationsEn: data.specificationsEn,
        createdAt: data.created_at || new Date().toISOString()
      };
    } catch {
      const prods = await this.getProducts();
      return prods.find(p => p.id === id) || null;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const id = Math.random().toString(36).substring(2, 11);
    const createdAt = new Date().toISOString();
    const newProd: Product = { ...product, id, createdAt };

    try {
      const client = getSupabase();
      const { error } = await client
        .from('products')
        .insert([{
          id: newProd.id,
          nameAr: newProd.nameAr,
          nameEn: newProd.nameEn,
          descriptionAr: newProd.descriptionAr,
          descriptionEn: newProd.descriptionEn,
          price: newProd.price,
          compareAtPrice: newProd.compareAtPrice,
          images: newProd.images,
          categoryId: newProd.categoryId,
          stock: newProd.stock,
          featured: newProd.featured,
          bestSeller: newProd.bestSeller,
          newArrival: newProd.newArrival,
          rating: newProd.rating,
          reviewsCount: newProd.reviewsCount,
          brandAr: newProd.brandAr,
          brandEn: newProd.brandEn,
          sizes: newProd.sizes,
          colors: newProd.colors,
          hidden: newProd.hidden,
          specificationsAr: newProd.specificationsAr,
          specificationsEn: newProd.specificationsEn
        }]);
        
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase createProduct failed, saving locally:', err);
    }

    const localProds = this.getStorageItem<Product[]>('products', []);
    localProds.push(newProd);
    this.setStorageItem('products', localProds);
    return newProd;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const client = getSupabase();
      const { error } = await client
        .from('products')
        .update(product)
        .eq('id', id);
        
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase updateProduct failed:', err);
    }

    const localProds = this.getStorageItem<Product[]>('products', []);
    const idx = localProds.findIndex(p => p.id === id);
    if (idx !== -1) {
      localProds[idx] = { ...localProds[idx], ...product };
      this.setStorageItem('products', localProds);
      return localProds[idx];
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const client = getSupabase();
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase deleteProduct failed:', err);
    }

    const localProds = this.getStorageItem<Product[]>('products', []);
    const filtered = localProds.filter(p => p.id !== id);
    this.setStorageItem('products', filtered);
    return true;
  }

  async getCategories(): Promise<Category[]> {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('categories')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(c => ({
          id: c.id,
          nameAr: c.nameAr,
          nameEn: c.nameEn,
          slug: c.slug,
          image: c.image
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch categories from Supabase:', err);
    }
    return this.getStorageItem<Category[]>('categories', []);
  }

  async createCategory(category: Category): Promise<Category> {
    try {
      const client = getSupabase();
      await client.from('categories').insert([category]);
    } catch (err) {
      console.warn('Failed to insert category in Supabase:', err);
    }
    const local = this.getStorageItem<Category[]>('categories', []);
    local.push(category);
    this.setStorageItem('categories', local);
    return category;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const client = getSupabase();
      let query = client.from('orders').select('*');
      
      if (userId) {
        query = query.eq('userId', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      return (data || []).map(o => ({
        id: o.id,
        userId: o.userId,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        items: Array.isArray(o.items) ? o.items : [],
        status: o.status as Order['status'],
        paymentMethod: o.paymentMethod as Order['paymentMethod'],
        paymentStatus: o.paymentStatus as Order['paymentStatus'],
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress,
        subtotal: parseFloat(o.subtotal),
        shippingFee: parseFloat(o.shippingFee),
        discount: parseFloat(o.discount),
        total: parseFloat(o.total),
        notes: o.notes,
        createdAt: o.created_at || new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Failed to fetch orders from Supabase:', err);
      const orders = this.getStorageItem<Order[]>('orders', []);
      if (userId) {
        return orders.filter(o => o.userId === userId);
      }
      return orders;
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) return null;
      
      return {
        id: data.id,
        userId: data.userId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        items: Array.isArray(data.items) ? data.items : [],
        status: data.status as Order['status'],
        paymentMethod: data.paymentMethod as Order['paymentMethod'],
        paymentStatus: data.paymentStatus as Order['paymentStatus'],
        shippingAddress: typeof data.shippingAddress === 'string' ? JSON.parse(data.shippingAddress) : data.shippingAddress,
        subtotal: parseFloat(data.subtotal),
        shippingFee: parseFloat(data.shippingFee),
        discount: parseFloat(data.discount),
        total: parseFloat(data.total),
        notes: data.notes,
        createdAt: data.created_at || new Date().toISOString()
      };
    } catch {
      const orders = await this.getOrders();
      return orders.find(o => o.id === id) || null;
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const id = 'ATM-' + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString();
    const newOrder: Order = { ...order, id, createdAt };

    try {
      const client = getSupabase();
      const { error } = await client
        .from('orders')
        .insert([{
          id: newOrder.id,
          userId: newOrder.userId,
          customerName: newOrder.customerName,
          customerPhone: newOrder.customerPhone,
          items: newOrder.items,
          status: newOrder.status,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          shippingAddress: newOrder.shippingAddress,
          subtotal: newOrder.subtotal,
          shippingFee: newOrder.shippingFee,
          discount: newOrder.discount,
          total: newOrder.total,
          notes: newOrder.notes
        }]);
        
      if (error) throw error;
    } catch (err) {
      console.warn('Failed to insert order in Supabase:', err);
    }

    const localOrders = this.getStorageItem<Order[]>('orders', []);
    localOrders.unshift(newOrder);
    this.setStorageItem('orders', localOrders);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Promise<Order> {
    const updates: Partial<Order> = { status };
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }

    try {
      const client = getSupabase();
      const { error } = await client
        .from('orders')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    } catch (err) {
      console.warn('Failed to update order status in Supabase:', err);
    }

    const localOrders = this.getStorageItem<Order[]>('orders', []);
    const idx = localOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      localOrders[idx].status = status;
      if (paymentStatus) {
        localOrders[idx].paymentStatus = paymentStatus;
      }
      this.setStorageItem('orders', localOrders);
      return localOrders[idx];
    }
    throw new Error('Order not found');
  }

  async getCoupons(): Promise<Coupon[]> {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('coupons')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(c => ({
          id: c.id,
          code: c.code,
          discountType: c.discountType as Coupon['discountType'],
          value: parseFloat(c.value),
          minOrderValue: parseFloat(c.minOrderValue),
          active: !!c.active,
          expiresAt: c.expiresAt
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch coupons from Supabase:', err);
    }
    return this.getStorageItem<Coupon[]>('coupons', []);
  }

  async createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
    const id = Math.random().toString(36).substring(2, 11);
    const fresh: Coupon = { ...coupon, id };

    try {
      const client = getSupabase();
      await client.from('coupons').insert([{
        id: fresh.id,
        code: fresh.code,
        discountType: fresh.discountType,
        value: fresh.value,
        minOrderValue: fresh.minOrderValue,
        active: fresh.active,
        expiresAt: fresh.expiresAt
      }]);
    } catch (err) {
      console.warn('Failed to insert coupon in Supabase:', err);
    }

    const local = this.getStorageItem<Coupon[]>('coupons', []);
    local.push(fresh);
    this.setStorageItem('coupons', local);
    return fresh;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      const client = getSupabase();
      await client.from('coupons').delete().eq('id', id);
    } catch (err) {
      console.warn('Failed to delete coupon in Supabase:', err);
    }
    const local = this.getStorageItem<Coupon[]>('coupons', []);
    const filtered = local.filter(c => c.id !== id);
    this.setStorageItem('coupons', filtered);
    return true;
  }

  async validateCoupon(code: string, cartTotal: number): Promise<Coupon | null> {
    const coupons = await this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) return null;
    if (cartTotal < coupon.minOrderValue) return null;
    return coupon;
  }

  async getSettings(): Promise<WebsiteSettings | null> {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();
        
      if (!error && data) {
        return {
          siteNameAr: data.siteNameAr,
          siteNameEn: data.siteNameEn,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          whatsappNumber: data.whatsappNumber,
          facebookUrl: data.facebookUrl,
          instagramUrl: data.instagramUrl,
          shippingFeeEgypt: parseFloat(data.shippingFeeEgypt),
          freeShippingThreshold: parseFloat(data.freeShippingThreshold),
          vodafoneCashNumber: data.vodafoneCashNumber,
          paymobApiKey: data.paymobApiKey,
          paymobSecretKey: data.paymobSecretKey,
          paymobIntegrationId: data.paymobIntegrationId,
          paymobIframeId: data.paymobIframeId,
          futureProviderApiKey: data.futureProviderApiKey,
          supabaseUrl: data.supabaseUrl,
          supabaseAnonKey: data.supabaseAnonKey,
          supabaseServiceRoleKey: data.supabaseServiceRoleKey,
          cloudinaryCloudName: data.cloudinaryCloudName,
          cloudinaryApiKey: data.cloudinaryApiKey,
          cloudinaryApiSecret: data.cloudinaryApiSecret,
          resendApiKey: data.resendApiKey
        };
      }
    } catch (err) {
      console.warn('Failed to retrieve settings from Supabase:', err);
    }
    return this.getStorageItem<WebsiteSettings | null>('settings', null);
  }

  async updateSettings(newSettings: WebsiteSettings): Promise<boolean> {
    try {
      const client = getSupabase();
      const { error } = await client
        .from('settings')
        .upsert([{
          id: 'global',
          siteNameAr: newSettings.siteNameAr,
          siteNameEn: newSettings.siteNameEn,
          contactPhone: newSettings.contactPhone,
          contactEmail: newSettings.contactEmail,
          whatsappNumber: newSettings.whatsappNumber,
          facebookUrl: newSettings.facebookUrl,
          instagramUrl: newSettings.instagramUrl,
          shippingFeeEgypt: newSettings.shippingFeeEgypt,
          freeShippingThreshold: newSettings.freeShippingThreshold,
          vodafoneCashNumber: newSettings.vodafoneCashNumber,
          paymobApiKey: newSettings.paymobApiKey,
          paymobSecretKey: newSettings.paymobSecretKey,
          paymobIntegrationId: newSettings.paymobIntegrationId,
          paymobIframeId: newSettings.paymobIframeId,
          futureProviderApiKey: newSettings.futureProviderApiKey,
          supabaseUrl: newSettings.supabaseUrl,
          supabaseAnonKey: newSettings.supabaseAnonKey,
          supabaseServiceRoleKey: newSettings.supabaseServiceRoleKey,
          cloudinaryCloudName: newSettings.cloudinaryCloudName,
          cloudinaryApiKey: newSettings.cloudinaryApiKey,
          cloudinaryApiSecret: newSettings.cloudinaryApiSecret,
          resendApiKey: newSettings.resendApiKey
        }]);
      return !error;
    } catch (err) {
      console.warn('Failed to upsert settings in Supabase:', err);
      return false;
    }
  }

  async getReviews(productId?: string): Promise<Review[]> {
    try {
      const client = getSupabase();
      let query = client.from('reviews').select('*');
      if (productId) {
        query = query.eq('productId', productId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      return (data || []).map(r => ({
        id: r.id,
        productId: r.productId,
        userName: r.userName,
        rating: parseFloat(r.rating) || 5,
        comment: r.comment,
        createdAt: r.created_at || new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Failed to fetch reviews from Supabase:', err);
      const all: Record<string, Review[]> = this.getStorageItem<Record<string, Review[]>>('reviews', {});
      if (productId) {
        return all[productId] || [];
      }
      return Object.values(all).flat();
    }
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const id = Math.random().toString(36).substring(2, 11);
    const createdAt = new Date().toISOString();
    const fresh: Review = { ...review, id, createdAt };

    try {
      const client = getSupabase();
      await client.from('reviews').insert([{
        id: fresh.id,
        productId: fresh.productId,
        userName: fresh.userName,
        rating: fresh.rating,
        comment: fresh.comment
      }]);
    } catch (err) {
      console.warn('Failed to insert review in Supabase:', err);
    }

    const all = this.getStorageItem<Record<string, Review[]>>('reviews', {});
    if (!all[review.productId]) {
      all[review.productId] = [];
    }
    all[review.productId].unshift(fresh);
    this.setStorageItem('reviews', all);
    return fresh;
  }
}

export const supabaseService = new SupabaseService();
