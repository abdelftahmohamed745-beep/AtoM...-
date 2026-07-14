import { WebsiteSettings } from '../types';

function getSettingsFromStorage(): Partial<WebsiteSettings> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('atom_settings');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

// FORMAT VALIDATORS
export const isValidSupabaseUrl = (url: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  return /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/?$/.test(trimmed);
};

export const isValidSupabaseKey = (key: string): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.startsWith('eyJ') && trimmed.length > 50;
};

export const isValidResendApiKey = (key: string): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.startsWith('re_') && trimmed.length > 10;
};

export const isValidPaymobApiKey = (key: string): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  // Paymob keys typically start with p_live_ or p_test_ or similar
  return (trimmed.startsWith('p_live_') || trimmed.startsWith('p_test_') || trimmed.length > 30);
};

export const isValidCloudinaryCloudName = (name: string): boolean => {
  if (!name) return false;
  return name.trim().length >= 2;
};

export const isValidCloudinaryApiKey = (key: string): boolean => {
  if (!key) return false;
  // Cloudinary API Key is typically a 15-digit number
  return /^\d+$/.test(key.trim());
};

export const getSupabaseUrl = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_SUPABASE_URL as string) ||
    (env.NEXT_PUBLIC_SUPABASE_URL as string) ||
    getSettingsFromStorage().supabaseUrl ||
    ''
  ).trim();
};

export const getSupabaseAnonKey = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_SUPABASE_ANON_KEY as string) ||
    (env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
    getSettingsFromStorage().supabaseAnonKey ||
    ''
  ).trim();
};

export const getSupabaseServiceRoleKey = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.SUPABASE_SERVICE_ROLE_KEY as string) ||
    (env.VITE_SUPABASE_SERVICE_ROLE_KEY as string) ||
    (env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string) ||
    getSettingsFromStorage().supabaseServiceRoleKey ||
    ''
  ).trim();
};

export const getCloudinaryCloudName = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_CLOUDINARY_CLOUD_NAME as string) ||
    (env.CLOUDINARY_CLOUD_NAME as string) ||
    getSettingsFromStorage().cloudinaryCloudName ||
    ''
  ).trim();
};

export const getCloudinaryApiKey = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_CLOUDINARY_API_KEY as string) ||
    (env.CLOUDINARY_API_KEY as string) ||
    getSettingsFromStorage().cloudinaryApiKey ||
    ''
  ).trim();
};

export const getCloudinaryApiSecret = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.CLOUDINARY_API_SECRET as string) ||
    (env.VITE_CLOUDINARY_API_SECRET as string) ||
    getSettingsFromStorage().cloudinaryApiSecret ||
    ''
  ).trim();
};

export const getResendApiKey = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.RESEND_API_KEY as string) ||
    (env.VITE_RESEND_API_KEY as string) ||
    getSettingsFromStorage().resendApiKey ||
    ''
  ).trim();
};

export const getPaymobApiKey = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_PAYMOB_API_KEY as string) ||
    (env.PAYMOB_API_KEY as string) ||
    getSettingsFromStorage().paymobApiKey ||
    ''
  ).trim();
};

export const getPaymobSecretKey = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.PAYMOB_SECRET_KEY as string) ||
    (env.VITE_PAYMOB_SECRET_KEY as string) ||
    getSettingsFromStorage().paymobSecretKey ||
    ''
  ).trim();
};

export const getPaymobIntegrationId = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_PAYMOB_INTEGRATION_ID as string) ||
    (env.PAYMOB_INTEGRATION_ID as string) ||
    getSettingsFromStorage().paymobIntegrationId ||
    ''
  ).trim();
};

export const getPaymobIframeId = (): string => {
  const env = (import.meta as any).env || {};
  return (
    (env.VITE_PAYMOB_IFRAME_ID as string) ||
    (env.PAYMOB_IFRAME_ID as string) ||
    getSettingsFromStorage().paymobIframeId ||
    ''
  ).trim();
};
