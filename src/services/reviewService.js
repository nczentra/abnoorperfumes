import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const getLocalReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalReviews = (reviews) => {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

export const reviewService = {
  async getReviews(productId, status = 'approved') {
    const all = await this.getAllReviews();
    return all.filter(r => (!productId || r.productId === productId) && (!status || r.status === status));
  },

  async getAllReviews() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'reviews'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {
        console.warn('Firestore reviews fetch failed:', e);
      }
    }
    const reviews = getLocalReviews();
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return reviews;
  },

  async submitReview(data) {
    const newRev = {
      ...data,
      id: data.id || `rev-${Date.now()}`,
      status: 'approved', // Auto-approved for preview, can be set to 'pending'
      verifiedPurchase: Boolean(data.verifiedPurchase),
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'reviews', newRev.id), newRev);
      } catch (e) {
        console.warn('Firestore review submit failed:', e);
      }
    }

    const local = getLocalReviews();
    local.unshift(newRev);
    saveLocalReviews(local);
    return newRev;
  },

  async updateReviewStatus(id, status) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'reviews', id), { status });
      } catch (e) {
        console.warn('Firestore review update failed:', e);
      }
    }

    const local = getLocalReviews();
    const idx = local.findIndex(r => r.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalReviews(local);
      return local[idx];
    }
    return null;
  },

  async deleteReview(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
      } catch (e) {
        console.warn('Firestore review delete failed:', e);
      }
    }

    const local = getLocalReviews().filter(r => r.id !== id);
    saveLocalReviews(local);
    return true;
  },
};
