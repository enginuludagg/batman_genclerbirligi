
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCELptObWbgYOALoNZaqJOPVssqJqDHVUs",
  authDomain: "batmangenclerbirligi.firebaseapp.com",
  projectId: "batmangenclerbirligi",
  storageBucket: "batmangenclerbirligi.firebasestorage.app",
  messagingSenderId: "727250786350",
  appId: "1:727250786350:web:2fd79f3c61bea7a95ca7bf",
  measurementId: "G-4D3MQ55VJD"
};

// Basit kontrol: API anahtarı varsayılan değilse yapılandırıldı say
export const isConfigured = firebaseConfig.apiKey !== "BURAYA_API_KEY_GELECEK" && firebaseConfig.apiKey !== "";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
