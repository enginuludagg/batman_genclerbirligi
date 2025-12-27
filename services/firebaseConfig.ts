
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * BGB AKADEMİ - FİNAL FIREBASE YAPILANDIRMASI
 * Firebase Console > Project Settings > Web App yolunu izleyerek bilgileri buraya yapıştırın.
 */
const firebaseConfig = {
  apiKey: "BURAYA_API_KEY_GELECEK",
  authDomain: "PROJE_ID.firebaseapp.com",
  projectId: "PROJE_ID",
  storageBucket: "PROJE_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Yapılandırma kontrolü
export const isConfigured = firebaseConfig.apiKey !== "BURAYA_API_KEY_GELECEK";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
