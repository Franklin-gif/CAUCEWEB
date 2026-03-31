import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Cambiado de Firestore a Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBH3OMCamiI4s1EXQDJ4k5EdZEZNIIdS68",
  authDomain: "caucepanama-3f5ce.firebaseapp.com",
  projectId: "caucepanama-3f5ce",
  storageBucket: "caucepanama-3f5ce.firebasestorage.app",
  messagingSenderId: "399446980989",
  appId: "1:399446980989:web:af21612a59c89527bcf414",
  measurementId: "G-SQ8MLVKB5M",
  databaseURL: "https://caucepanama-3f5ce-default-rtdb.firebaseio.com" // Añadida la URL de tu base de datos
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app); // Ahora exporta la Realtime Database
export default app;
