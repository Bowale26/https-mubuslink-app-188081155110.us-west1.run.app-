import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

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
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection successful.");
  } catch (error: any) {
    console.error("Firestore connection test failed:", error.code, error.message);
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const user = auth.currentUser;
  
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: user?.uid || null,
      email: user?.email || null,
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || false,
      tenantId: user?.tenantId || null,
      providerInfo: user?.providerData.map(provider => ({
        providerId: provider.providerId || 'unknown',
        displayName: provider.displayName || null,
        email: provider.email || null,
        photoUrl: provider.photoURL || null
      })) || []
    },
    operationType,
    path: path || 'unknown'
  }
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  // Log to Maintenance Logs for the "Auto Maintenance Agent"
  try {
    // Only log if we have a network connection
    if (navigator.onLine) {
      addDoc(collection(db, 'maintenance_logs'), {
        actionType: 'firestore_error',
        description: `Error during ${operationType} on path: ${path || 'unknown'}`,
        status: 'error',
        metadata: {
          ...errInfo,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        },
        createdAt: serverTimestamp()
      }).catch(e => console.warn("Background log failed:", e));
    }
  } catch (logErr) {
    console.error("Failed to log error to Firestore:", logErr);
  }

  throw new Error(JSON.stringify(errInfo));
}
