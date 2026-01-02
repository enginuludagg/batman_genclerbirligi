
import { db } from "./firebaseConfig";

export const KEYS = {
  STUDENTS: 'students',
  TRAINERS: 'trainers',
  NOTES: 'notes',
  SESSIONS: 'sessions',
  FINANCE: 'finance',
  MEDIA: 'media',
  DRILLS: 'drills',
  FIXTURES: 'fixtures'
};

export const storageService = {
  saveToCloud: async (colName: string, data: any) => {
    try {
      const { id, ...rest } = data;
      const cleanData = {
        ...rest,
        updatedAt: new Date().toISOString()
      };

      if (id && !id.toString().startsWith('temp-')) {
        await db.collection(colName).doc(id.toString()).set(cleanData, { merge: true });
        return id;
      } else {
        const docRef = await db.collection(colName).add({
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
   * Bulut Veri Çekme - forceServer aktifse yerel cache'i (IndexedDB) tamamen baypas eder.
   */
  loadFromCloud: async (colName: string, forceServer: boolean = false) => {
    try {
      // source: 'server' Firestore SDK'nın yerel cache'e bakmadan doğrudan sunucuya gitmesini sağlar.
      const options = forceServer ? { source: 'server' as const } : {};
      const querySnapshot = await db.collection(colName).get(options);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (e) {
      console.warn(`[BGB-Cloud] Okuma Hatası (${colName}): Yerel veriler kullanılıyor.`);
      const querySnapshot = await db.collection(colName).get();
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  deleteFromCloud: async (colName: string, docId: string) => {
    try {
      if (!docId || docId.toString().startsWith('temp-')) return true;
      await db.collection(colName).doc(docId.toString()).delete();
      return true;
    } catch (e) {
      console.error(`[BGB-Cloud] Silme Hatası (${colName}):`, e);
      return false;
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`bgb_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  saveLocal: (key: string, data: any) => {
    try {
      localStorage.setItem(`bgb_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage kayıt hatası", e);
    }
  }
};
