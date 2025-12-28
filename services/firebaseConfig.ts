
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- FIREBASE KURULUM ADIMLARI ---
// 1. https://console.firebase.google.com adresine gidin.
// 2. Yeni bir proje oluşturun.
// 3. Sol menüden "Project Settings" (Ayarlar) > "General" kısmına gelin.
// 4. Aşağıdaki "Your apps" bölümünden </> (Web) ikonuna tıklayın.
// 5. Size verilen "firebaseConfig" nesnesindeki değerleri aşağıya yapıştırın.

const firebaseConfig = {
  apiKey: "BURAYA_API_KEY_YAPISTIRIN",
  authDomain: "BURAYA_AUTH_DOMAIN_YAPISTIRIN",
  projectId: "BURAYA_PROJECT_ID_YAPISTIRIN",
  storageBucket: "BURAYA_STORAGE_BUCKET_YAPISTIRIN",
  messagingSenderId: "BURAYA_SENDER_ID_YAPISTIRIN",
  appId: "BURAYA_APP_ID_YAPISTIRIN"
};

// Veritabanı bağlantısı kontrolü
export const isConfigured = firebaseConfig.apiKey !== "BURAYA_API_KEY_YAPISTIRIN" && firebaseConfig.apiKey !== "";

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
