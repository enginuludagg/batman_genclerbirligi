import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCELptObWbgYOALoNZaqJOPVssqJqDHVUs",
  authDomain: "batmangenclerbirligi.firebaseapp.com",
  projectId: "batmangenclerbirligi",
  storageBucket: "batmangenclerbirligi.firebasestorage.app",
  messagingSenderId: "727250786350",
  appId: "1:727250786350:web:2fd79f3c61bea7a95ca7bf",
  measurementId: "G-4D3MQ55VJD"
};

// Uygulamayı başlat
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Servisleri dışa aktar
export const db = firebase.firestore();
export const auth = firebase.auth();

// Analytics disabled due to export error
export const analytics = null;

// Konfigürasyon tamamlandı
export const isConfigured = true;