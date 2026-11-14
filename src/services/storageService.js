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

const CURRENT_VERSION = 'v2_men_exclusive';

// Seed initial data if not present or if upgrading to men's exclusive catalog
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
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
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
    const initialReviews = [
      {
        id: 'rev-1',
        productId: 'prod-001',
        productName: 'Sultanate Dehn Al Oud Royale',
        userId: 'usr-1',
        userName: 'Hamdan Al-Maktoum',
        userEmail: 'hamdan@example.com',
        rating: 5,
        title: 'True Vintage Cambodian Royalty',
        comment: 'The depth of this agarwood is breathtaking. I have worn high-end artisanal oud for twenty years, and this is on par with royal private distillations. Lasted over 26 hours on my linen shirt.',
        status: 'approved',
        verifiedPurchase: true,
        createdAt: '2026-11-01T10:30:00Z',
      },
      {
        id: 'rev-2',
        productId: 'prod-002',
        productName: 'Noor Al Layl Pour Homme',
        userId: 'usr-2',
        userName: 'Farhan Qureshi',
        userEmail: 'farhan@example.com',
        rating: 5,
        title: 'Commanding night incense & dark amber',
        comment: 'Wore this to a formal banquet. The drydown of smoky woods, frankincense, and dark amber is phenomenal. Heavy luxury bottle with magnetic cap.',
        status: 'approved',
        verifiedPurchase: true,
        createdAt: '2026-11-05T14:20:00Z',
      },
      {
        id: 'rev-3',
        productId: 'prod-004',
        productName: 'Sahara Cuir Noir',
        userId: 'usr-3',
        userName: 'Zayd Merchant',
        userEmail: 'zayd@example.com',
        rating: 5,
        title: 'The ultimate gentleman fragrance',
        comment: 'Dark Tuscan leather with roasted coffee and smoky woods. Very masculine, projects with intense authority.',
        status: 'approved',
        verifiedPurchase: true,
        createdAt: '2026-11-09T08:15:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const initialOrders = [
      {
        id: 'ORD-984210',
        orderNumber: 'ABN-2026-9842',
        userId: 'usr-demo-1',
        customerSnapshot: {
          name: 'Tariq Al-Mansoor',
          email: 'tariq.mansoor@example.com',
          phone: '+91 98200 12345',
        },
        itemsSnapshot: [
          {
            productId: 'prod-001',
            productName: 'Sultanate Dehn Al Oud Royale',
            variantSize: '50ml',
            sku: 'SULT-OUD-50',
            price: 10999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=300&q=80',
          },
          {
            productId: 'prod-005',
            productName: 'Musk Al Ghazal Pure Royal Attar',
            variantSize: '6ml',
            sku: 'ATTAR-GHAZAL-6',
            price: 2999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1608528577891-9855f4c864e0?auto=format&fit=crop&w=300&q=80',
          },
        ],
        addressSnapshot: {
          fullName: 'Tariq Al-Mansoor',
          phone: '+91 98200 12345',
          houseNumber: 'Villa 14, Royal Crest',
          street: 'Altamount Road',
          locality: 'Cumballa Hill',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400026',
          addressType: 'Home',
        },
        subtotal: 13998,
        discount: 500,
        couponCode: 'NOORROYAL',
        shippingCharge: 0,
        tax: 0,
        totalAmount: 13498,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        paymentDetails: {
          razorpayPaymentId: 'pay_N982hfk298a',
          paidAt: '2026-11-12T11:20:00Z',
        },
        orderStatus: 'shipped',
        courier: 'Blue Dart Luxury Express',
        trackingNumber: 'BD-982348719IN',
        statusHistory: [
          { status: 'placed', timestamp: '2026-11-12T11:20:00Z', note: 'Order placed successfully' },
          { status: 'confirmed', timestamp: '2026-11-12T12:00:00Z', note: 'Order verified by concierge' },
          { status: 'packed', timestamp: '2026-11-12T15:30:00Z', note: 'Sealed in signature emerald box' },
          { status: 'shipped', timestamp: '2026-11-13T09:15:00Z', note: 'Handed over to Blue Dart Express' },
        ],
        createdAt: '2026-11-12T11:20:00Z',
        updatedAt: '2026-11-13T09:15:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS)) {
    const initialLogs = [
      {
        id: 'log-1',
        productId: 'prod-001',
        productName: 'Sultanate Dehn Al Oud Royale',
        variantSize: '50ml',
        type: 'STOCK_IN',
        quantity: 15,
        reason: 'New distillation batch received from Cambodia',
        staffName: 'Master Nose Faisal',
        createdAt: '2026-11-10T09:00:00Z',
      },
      {
        id: 'log-2',
        productId: 'prod-001',
        productName: 'Sultanate Dehn Al Oud Royale',
        variantSize: '50ml',
        type: 'STOCK_OUT',
        quantity: -1,
        reason: 'Order #ABN-2026-9842 fulfillment',
        staffName: 'System',
        createdAt: '2026-11-12T11:20:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify(initialLogs));
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
      announcementMessage: '✨ The Royal Winter Oud Collection has arrived | Complimentary Luxury Gift Box on orders above ₹4,999',
      announcementActive: true,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
  }
};

// Initialize once on module load
initializeDataStore();

export { STORAGE_KEYS };
