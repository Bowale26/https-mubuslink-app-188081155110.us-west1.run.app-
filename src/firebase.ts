import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Initialize FireStore using the correct database instance ID if specified
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
