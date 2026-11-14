import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const getLocalBanners = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANNERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalBanners = (banners) => {
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
};

export const bannerService = {
  async getBanners(activeOnly = true) {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'banners'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          return activeOnly ? list.filter(b => b.active) : list;
        }
      } catch (e) {
        console.warn('Firestore banners fetch failed:', e);
      }
    }
    const banners = getLocalBanners();
    return activeOnly ? banners.filter(b => b.active) : banners;
  },

  async createBanner(data) {
    const newBanner = {
      ...data,
      id: data.id || `banner-${Date.now()}`,
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'banners', newBanner.id), newBanner);
      } catch (e) {
        console.warn('Firestore banner create failed:', e);
      }
    }

    const local = getLocalBanners();
    local.push(newBanner);
    saveLocalBanners(local);
    return newBanner;
  },

  async updateBanner(id, data) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'banners', id), data);
      } catch (e) {
        console.warn('Firestore banner update failed:', e);
      }
    }

    const local = getLocalBanners();
    const idx = local.findIndex(b => b.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
      saveLocalBanners(local);
      return local[idx];
    }
    return null;
  },

  async deleteBanner(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'banners', id));
      } catch (e) {
        console.warn('Firestore banner delete failed:', e);
      }
    }

    const local = getLocalBanners().filter(b => b.id !== id);
    saveLocalBanners(local);
    return true;
  },
};
