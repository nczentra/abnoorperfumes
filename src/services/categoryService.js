import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const getLocalCategories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalCategories = (cats) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
};

export const categoryService = {
  async getCategories() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {
        console.warn('Firestore fetch failed for categories:', e);
      }
    }
    return getLocalCategories();
  },

  async getCategoryBySlug(slug) {
    const categories = await this.getCategories();
    return categories.find(c => c.slug === slug || c.id === slug) || null;
  },

  async createCategory(data) {
    const newCat = {
      ...data,
      id: data.id || `cat-${Date.now()}`,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'categories', newCat.id), newCat);
      } catch (e) {
        console.warn('Firestore save failed for category:', e);
      }
    }

    const local = getLocalCategories();
    local.push(newCat);
    saveLocalCategories(local);
    return newCat;
  },

  async updateCategory(id, data) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'categories', id), data);
      } catch (e) {
        console.warn('Firestore update failed for category:', e);
      }
    }

    const local = getLocalCategories();
    const idx = local.findIndex(c => c.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      saveLocalCategories(local);
      return local[idx];
    }
    return null;
  },

  async deleteCategory(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (e) {
        console.warn('Firestore delete failed for category:', e);
      }
    }

    const local = getLocalCategories().filter(c => c.id !== id);
    saveLocalCategories(local);
    return true;
  },
};
