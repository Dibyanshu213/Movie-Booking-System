// src/config/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
 apiKey: "AIzaSyCqv_7YruVbmxJ7pwZ8klCJ1LmRl0C1nMM",
  authDomain: "movie-booking-system-434e1.firebaseapp.com",
  projectId: "movie-booking-system-434e1",
  storageBucket: "movie-booking-system-434e1.firebasestorage.app",
  messagingSenderId: "236636091486",
  appId: "1:236636091486:web:b56362947519897d8e30cf",
  measurementId: "G-F4K255F5N7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these so other files can import them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;