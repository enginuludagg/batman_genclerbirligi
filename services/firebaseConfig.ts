
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// BURAYI FIREBASE CONSOLE'DAN ALDIĞIN BİLGİLERLE DEĞİŞTİR
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "projen-id.firebaseapp.com",
  projectId: "projen-id",
  storageBucket: "projen-id.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
