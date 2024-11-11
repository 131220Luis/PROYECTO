import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Asegúrate de importar getDatabase
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA1M-aGNAIrZrIcgu8FXZvdNQgYDm1lrTA",
  authDomain: "proyectobigotesbd.firebaseapp.com",
  databaseURL: "https://proyectobigotesbd-default-rtdb.firebaseio.com",
  projectId: "proyectobigotesbd",
  storageBucket: "proyectobigotesbd.appspot.com",
  messagingSenderId: "1078683652646",
  appId: "1:1078683652646:web:74bed587839a8a9464cce7",
  measurementId: "G-208S80E7NZ"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Instancia de Realtime Database
const database = getDatabase(app); // Usa getDatabase para inicializar correctamente

const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);

export { auth, db, storage, database };
