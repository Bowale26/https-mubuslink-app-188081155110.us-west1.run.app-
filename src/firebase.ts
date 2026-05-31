import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

// Securely compute authDomain to resolve third-party cookie issues on custom domains,
// ensuring the alignment of authentication flows and callback origins.
const getSecureAuthDomain = (): string => {
  // Use VITE_AUTH_DOMAIN environment variable if explicitly defined
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_AUTH_DOMAIN) {
    return metaEnv.VITE_AUTH_DOMAIN;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Apply domain-alignment configuration if this is a production custom domain
    // (excluding localhost, development Cloud Run sandboxes, and stock Firebase domains)
    if (
      hostname && 
      hostname !== 'localhost' && 
      hostname !== '127.0.0.1' && 
      !hostname.endsWith('.run.app') &&
      !hostname.endsWith('.web.app') &&
      !hostname.endsWith('.firebaseapp.com')
    ) {
      // Standard recommended proxy pattern for secure custom domain sub-routing
      return `auth.${hostname}`;
    }
  }
  return firebaseConfig.authDomain;
};

const app = initializeApp({
  ...firebaseConfig,
  authDomain: getSecureAuthDomain()
});

// Initialize the database instance using the database ID from configuration if specified
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Export secure Firebase Authentication instance with custom domain mapping
export const auth = getAuth(app);

// Export firestore as an alias of db to ensure compatibility with all import conventions
export const firestore = db;
export const dbInstance = db;

