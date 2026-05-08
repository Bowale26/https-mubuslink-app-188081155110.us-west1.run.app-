import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export function useSubscription() {
  const [subscription, setSubscription] = useState<{status: string, role: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // 1. Clean up any existing subscription listener
      if (unsubscribeSnap) {
        unsubscribeSnap();
        unsubscribeSnap = null;
      }

      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      // 2. Set up new listener for the current user
      const subRef = collection(db, 'customers', user.uid, 'subscriptions');
      const q = query(subRef); // Get all to see status history

      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          setSubscription(null);
        } else {
          // Stripe extension subcollection documents are usually one-per-subscription
          const data = snapshot.docs[0].data();
          setSubscription({
            status: data.status,
            role: data.role || 'premium'
          });
        }
        setLoading(false);
      }, (error) => {
        // If the error is due to missing permissions after logout, ignore it
        if (auth.currentUser) {
          handleFirestoreError(error, OperationType.LIST, `customers/${user.uid}/subscriptions`);
        }
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const isPaid = subscription?.status === 'active' || subscription?.status === 'trialing';

  return { subscription, isPaid, loading };
}
