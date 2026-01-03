import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Safe access to environment variables.
// Checks if import.meta.env exists before accessing properties.
// Provides hardcoded fallbacks to ensure app stability if env vars are missing.

const firebaseConfig = {
  apiKey: (import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) || "AIzaSyCELptObWbgYOALoNZaqJOPVssqJqDHVUs",
  authDomain: (import.meta.env && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || "batmangenclerbirligi.firebaseapp.com",
  projectId: (import.meta.env && import.meta.env.VITE_FIREBASE_PROJECT_ID) || "batmangenclerbirligi",
  storageBucket: (import.meta.env && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || "batmangenclerbirligi.firebasestorage.app",
  messagingSenderId: (import.meta.env && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "727250786350",
  appId: (import.meta.env && import.meta.env.VITE_FIREBASE_APP_ID) || "1:727250786350:web:2fd79f3c61bea7a95ca7bf",
  measurementId: (import.meta.env && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || "G-4D3MQ55VJD"
};

// Initialize Firebase using Namespaced SDK (compat/v8 style)
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const db = app.firestore();
export const auth = app.auth();
export const isConfigured = true;

export default app;