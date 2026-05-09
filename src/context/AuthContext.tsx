import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, Workspace } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (w: Workspace | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef).catch(e => handleFirestoreError(e, OperationType.GET, `/users/${firebaseUser.uid}`));
          
          if (userDoc && userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            
            // Trigger Stripe extension to ensure customer exists
            await setDoc(doc(db, 'customers', firebaseUser.uid), {
              email: firebaseUser.email,
            }, { merge: true }).catch(e => handleFirestoreError(e, OperationType.WRITE, `/customers/${firebaseUser.uid}`));

            setProfile(data);
          } else {
            const role = firebaseUser.email === 'isadewum@gmail.com' ? 'admin' : 'free';
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || '',
              role: role,
              subscriptionStatus: 'none', // Default to none until Stripe checkout
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile).catch(e => handleFirestoreError(e, OperationType.WRITE, `/users/${firebaseUser.uid}`));
            
            // Trigger Stripe extension to create customer for new user
            await setDoc(doc(db, 'customers', firebaseUser.uid), {
              email: firebaseUser.email,
            }).catch(e => handleFirestoreError(e, OperationType.WRITE, `/customers/${firebaseUser.uid}`));

            setProfile(newProfile);
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, currentWorkspace, setCurrentWorkspace }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
