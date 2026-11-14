import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const getLocalCoupons = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalCoupons = (coupons) => {
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
};

export const couponService = {
  async getCoupons() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'coupons'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {
        console.warn('Firestore coupons fetch failed:', e);
      }
    }
    return getLocalCoupons();
  },

  async validateCoupon(code, subtotal) {
    const coupons = await this.getCoupons();
    const cleanCode = code?.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, message: 'Invalid or inactive coupon code.' };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, message: 'This coupon has expired.' };
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { 
        valid: false, 
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrder.toLocaleString('en-IN')}.` 
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}.`,
    };
  },

  async createCoupon(data) {
    const newCoupon = {
      ...data,
      id: data.id || `coup-${Date.now()}`,
      code: data.code.trim().toUpperCase(),
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'coupons', newCoupon.id), newCoupon);
      } catch (e) {
        console.warn('Firestore coupon create failed:', e);
      }
    }

    const local = getLocalCoupons();
    local.push(newCoupon);
    saveLocalCoupons(local);
    return newCoupon;
  },

  async updateCoupon(id, data) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'coupons', id), data);
      } catch (e) {
        console.warn('Firestore coupon update failed:', e);
      }
    }

    const local = getLocalCoupons();
    const idx = local.findIndex(c => c.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      saveLocalCoupons(local);
      return local[idx];
    }
    return null;
  },

  async deleteCoupon(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
      } catch (e) {
        console.warn('Firestore coupon delete failed:', e);
      }
    }

    const local = getLocalCoupons().filter(c => c.id !== id);
    saveLocalCoupons(local);
    return true;
  },
};
