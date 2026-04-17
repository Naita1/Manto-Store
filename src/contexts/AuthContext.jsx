import { useState, useEffect, createContext, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signUp(email, password, name) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", newUser.uid), { name, email, createdAt: new Date() });
    return newUser;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth); 
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signUp, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}