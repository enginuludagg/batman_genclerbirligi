
import { db } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * BGB Veri Servisi (Cloud Modu)
 * LocalStorage yerine verileri Firestore'da tutar.
 */
// Added missing keys for data entities to fix App.tsx property access errors
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
  // Veriyi buluta kaydet
  saveToCloud: async (colName: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, colName), data);
      return docRef.id;
    } catch (e) {
      console.error("Firebase Save Error:", e);
    }
  },

  // Verileri buluttan çek
  loadFromCloud: async (colName: string) => {
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Klasik yükleme (State başlatma için hala localStorage kullanılabilir)
  load: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  },

  syncAll: (data: any) => {
    // Mevcut yerel kaydı korur
    localStorage.setItem('bgb_backup', JSON.stringify(data));
  }
};
