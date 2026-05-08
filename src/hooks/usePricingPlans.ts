import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

export interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  interval: string;
  type: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  active: boolean;
  prices: Price[];
}

/**
 * Hook to fetch pricing plans (products and their prices) from Firestore.
 * These are synced from Stripe by the "Run Payments with Stripe" extension.
 */
export function usePricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsPath = 'products';
    const productsQuery = query(collection(db, productsPath), where('active', '==', true));

    const unsubscribe = onSnapshot(productsQuery, async (snapshot) => {
      try {
        const plansWithPrices: Plan[] = await Promise.all(
          snapshot.docs.map(async (productDoc) => {
            const productData = productDoc.data();
            const pricesPath = `products/${productDoc.id}/prices`;
            const pricesSnapshot = await getDocs(collection(db, pricesPath));
            
            const prices = pricesSnapshot.docs.map((priceDoc) => ({
              id: priceDoc.id,
              ...priceDoc.data(),
            })) as Price[];

            return {
              id: productDoc.id,
              name: productData.name,
              description: productData.description,
              active: productData.active,
              prices,
            };
          })
        );

        // Sort plans (e.g., by price or name)
        setPlans(plansWithPrices.sort((a, b) => {
          const aPrice = a.prices[0]?.unit_amount || 0;
          const bPrice = b.prices[0]?.unit_amount || 0;
          return aPrice - bPrice;
        }));
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, productsPath);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, productsPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { plans, loading };
}
