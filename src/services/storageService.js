import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  SEED_PRODUCTS, 
  SEED_CATEGORIES, 
  SEED_BRANDS, 
  SEED_BANNERS, 
  SEED_COUPONS, 
  SEED_BLOGS 
} from '../constants/seedData';

// Storage keys for local fallback
const STORAGE_KEYS = {
  VERSION: 'ab_noor_store_version',
  PRODUCTS: 'ab_noor_products',
  CATEGORIES: 'ab_noor_categories',
  BRANDS: 'ab_noor_brands',
  ORDERS: 'ab_noor_orders',
  BANNERS: 'ab_noor_banners',
  COUPONS: 'ab_noor_coupons',
  REVIEWS: 'ab_noor_reviews',
  BLOGS: 'ab_noor_blogs',
  INVENTORY_LOGS: 'ab_noor_inventory_logs',
  SETTINGS: 'ab_noor_settings',
  USERS: 'ab_noor_users',
};

const CURRENT_VERSION = 'v5_clean_production_store';

// Seed initial data if not present or if upgrading store version
export const initializeDataStore = () => {
  if (typeof window === 'undefined') return;

  const version = localStorage.getItem(STORAGE_KEYS.VERSION);
  if (version !== CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(SEED_BRANDS));
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(SEED_BANNERS));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(SEED_COUPONS));
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(SEED_BLOGS));
    
    // Clear dummy orders, dummy reviews, and dummy logs for clean production state
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify([]));

    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);

    // Seed master admin
    const masterAdmin = {
      uid: 'usr-admin-master',
      displayName: 'AB Noor Store Admin',
      fullName: 'AB Noor Master Perfumer & Store Admin',
      email: 'abnoorperfumes@gmail.com',
      phone: '+91 98765 43210',
      role: 'super_admin',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([masterAdmin]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BRANDS)) {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(SEED_BRANDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(SEED_BANNERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(SEED_COUPONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(SEED_BLOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    const initialSettings = {
      storeName: 'AB Noor Perfumes',
      supportEmail: 'concierge@abnoorperfumes.com',
      supportPhone: '+91 98765 43210',
      freeShippingThreshold: 2499,
      standardShippingRate: 150,
      expressShippingRate: 350,
      taxPercentage: 0,
      codEnabled: true,
      codMinAmount: 999,
      codMaxAmount: 25000,
      maintenanceMode: false,
      announcementMessage: '',
      announcementActive: false,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
  }
};

// Initialize once on module load
initializeDataStore();

export { STORAGE_KEYS };
