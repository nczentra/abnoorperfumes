import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const getLocalLogs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalLogs = (logs) => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify(logs));
};

export const inventoryService = {
  async getLogs() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'inventoryLogs'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {
        console.warn('Firestore inventoryLogs fetch failed:', e);
      }
    }
    const logs = getLocalLogs();
    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return logs;
  },

  async addLog(logData) {
    const newLog = {
      ...logData,
      id: logData.id || `inv-log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'inventoryLogs', newLog.id), newLog);
      } catch (e) {
        console.warn('Firestore inventoryLog save failed:', e);
      }
    }

    const local = getLocalLogs();
    local.unshift(newLog);
    saveLocalLogs(local);
    return newLog;
  },
};
