
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
  /**
   * BGB Veri Kayıt Portalı
   * Veriyi Firestore'a kaydeder (ID varsa günceller, yoksa ekler).
   */
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
      // Hata olsa bile uygulamayı kırmamak için null döndür
      return null;
    }
  },

  /**
   * Bulut Veri Çekme
   */
  loadFromCloud: async (colName: string) => {
    try {
      const querySnapshot = await db.collection(colName).get();
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (e) {
      console.warn(`[BGB-Cloud] Okuma Hatası (${colName}): Yerel veriler kullanılacak.`);
      return [];
    }
  },

  /**
   * Veri Silme
   */
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

  // Yerel Depolama (Offline & Cache)
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`bgb_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.warn("LocalStorage okuma hatası", e);
      return defaultValue;
    }
  },

  saveLocal: (key: string, data: any) => {
    try {
      localStorage.setItem(`bgb_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage kayıt hatası (Muhtemelen kota doldu)", e);
    }
  }
};
