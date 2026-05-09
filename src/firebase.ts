import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { handleFirestoreError, OperationType } from './lib/firestoreErrorHandler';

const app = initializeApp(firebaseConfig);
console.log("Initializing Firestore with Database ID:", firebaseConfig.firestoreDatabaseId || "(default)");
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test connection to Firestore
async function testConnection() {
  console.log("Testing Firestore connection...");
  try {
    // Add a small delay to allow network to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    // getDocFromServer will fail with 'PERMISSION_DENIED' if rules don't permit it
    // which allows us to verify the "Master Gate" logic.
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection check performed.");
  } catch (error: any) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    } else {
      console.warn("Initial handshake check (standardized):", error.message);
    }
  }
}
testConnection();

export { handleFirestoreError, OperationType };
