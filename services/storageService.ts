
import { db } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const KEYS = {
  STUDENTS: 'students',
  TRAINERS: 'trainers',
  NOTES: 'notes',
  SESSIONS: 'sessions',
  FINANCE: 'finance',
  MEDIA: 'media',
  DRILLS: 'drills'
};

export const storageService = {
  /**
   * Herhangi bir veriyi Firestore'a kaydeder veya günceller.
   */
  saveToCloud: async (colName: string, data: any) => {
    try {
      const { id, ...rest } = data;
      const cleanData = {
        ...rest,
        updatedAt: new Date().toISOString()
      };

      if (id && !id.toString().startsWith('temp-') && !id.toString().includes('founder')) {
        const docRef = doc(db, colName, id.toString());
        await setDoc(docRef, cleanData, { merge: true });
        return id;
      } else {
        const docRef = await addDoc(collection(db, colName), {
          ...cleanData,
          createdAt: new Date().toISOString()
        });
        return docRef.id;
      }
    } catch (e) {
      console.error(`[BGB-Cloud] Kayıt Hatası (${colName}):`, e);
      return null;
    }
  },

  /**
   * Buluttaki tüm verileri koleksiyon bazlı çeker.
   */
  loadFromCloud: async (colName: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, colName));
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (e) {
      console.warn(`[BGB-Cloud] Okuma Hatası (${colName}): Veriler sadece yerel depodan yüklenecek.`);
      return [];
    }
  },

  /**
   * Belirtilen dokümanı buluttan siler.
   */
  deleteFromCloud: async (colName: string, docId: string) => {
    try {
      if (!docId || docId.toString().startsWith('temp-')) return true;
      await deleteDoc(doc(db, colName, docId.toString()));
      return true;
    } catch (e) {
      console.error(`[BGB-Cloud] Silme Hatası (${colName}):`, e);
      return false;
    }
  },

  // Offline destek için yerel metodlar
  load: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(`bgb_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  },

  saveLocal: (key: string, data: any) => {
    localStorage.setItem(`bgb_${key}`, JSON.stringify(data));
  }
};
