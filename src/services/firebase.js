import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyAgW1MntPmcBPiC-0CWBo7zfK3WxVW83NM",
  authDomain: "manto-store.firebaseapp.com",
  projectId: "manto-store",
  storageBucket: "manto-store.firebasestorage.app",
  messagingSenderId: "800829111295",
  appId: "1:800829111295:web:93c97f2ab02356fbcdc5ca",
  measurementId: "G-L3CKG5ME54"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
