import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getLocalSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveLocalSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const settingsService = {
  async getSettings() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          return { ...getLocalSettings(), ...snap.data() };
        }
      } catch (e) {
        console.warn('Firestore settings fetch failed:', e);
      }
    }
    return getLocalSettings();
  },

  async updateSettings(data) {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
      } catch (e) {
        console.warn('Firestore settings update failed:', e);
      }
    }

    const current = getLocalSettings();
    const updated = { ...current, ...data };
    saveLocalSettings(updated);
    return updated;
  },
};
