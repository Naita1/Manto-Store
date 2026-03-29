import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
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
const analytics = getAnalytics(app);

export const db = getFirestore(app);