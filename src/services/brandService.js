import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const getLocalBrands = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRANDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalBrands = (brands) => {
  localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
};

export const brandService = {
  async getBrands() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'brands'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {
        console.warn('Firestore fetch failed for brands:', e);
      }
    }
    return getLocalBrands();
  },

  async getBrandBySlug(slug) {
    const brands = await this.getBrands();
    return brands.find(b => b.slug === slug || b.id === slug) || null;
  },

  async createBrand(data) {
    const newBrand = {
      ...data,
      id: data.id || `brand-${Date.now()}`,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'brands', newBrand.id), newBrand);
      } catch (e) {
        console.warn('Firestore save failed for brand:', e);
      }
    }

    const local = getLocalBrands();
    local.push(newBrand);
    saveLocalBrands(local);
    return newBrand;
  },

  async updateBrand(id, data) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'brands', id), data);
      } catch (e) {
        console.warn('Firestore update failed for brand:', e);
      }
    }

    const local = getLocalBrands();
    const idx = local.findIndex(b => b.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      saveLocalBrands(local);
      return local[idx];
    }
    return null;
  },

  async deleteBrand(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'brands', id));
      } catch (e) {
        console.warn('Firestore delete failed for brand:', e);
      }
    }

    const local = getLocalBrands().filter(b => b.id !== id);
    saveLocalBrands(local);
    return true;
  },
};
