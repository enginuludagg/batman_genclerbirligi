import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqocnbfd-InC4hID01jXp2D5Y5dUHA6Wo",
  authDomain: "goldenlig-batman.firebaseapp.com",
  projectId: "goldenlig-batman",
  storageBucket: "goldenlig-batman.firebasestorage.app",
  messagingSenderId: "325419372570",
  appId: "1:325419372570:web:b6ebec427b52daf62681a3",
  measurementId: "G-VJ4J106C1S"
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışa aktar
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics sadece tarayıcı ortamında çalışır
export const analytics = null;

// Konfigürasyon tamamlandı (Artık her zaman true)
export const isConfigured = true;