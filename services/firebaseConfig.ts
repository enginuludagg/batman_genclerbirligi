
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * BGB AKADEMİ FIREBASE YAPILANDIRMASI
 * Firebase Console > Project Settings > Your Apps > Web App (</>) kısmından 
 * aldığınız bilgileri buraya yapıştırın.
 */
const firebaseConfig = {
  apiKey: "BURAYA_KENDI_API_KEYINI_YAPISTIR",
  authDomain: "PROJE-ID.firebaseapp.com",
  projectId: "PROJE-ID",
  storageBucket: "PROJE-ID.appspot.com",
  messagingSenderId: "SENDER-ID",
  appId: "APP_ID"
};

// Yapılandırma kontrolü
export const isConfigured = firebaseConfig.apiKey !== "BURAYA_KENDI_API_KEYINI_YAPISTIR";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
