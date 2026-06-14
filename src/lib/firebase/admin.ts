import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDataConnect } from "firebase-admin/data-connect";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { connectorConfig } from "@/lib/dataconnect-admin";

// Inizializza l'app Admin SDK per KALEX (singola istanza)
const app = getApps().length === 0 ? initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kalex-cloud",
  databaseURL: process.env.NEXT_PUBLIC_RTDB_URL || `https://${process.env.NEXT_PUBLIC_RTDB_DATABASE_ID || "kalex-cloud-default-rtdb"}.${process.env.NEXT_PUBLIC_RTDB_REGION || "europe-west1"}.firebasedatabase.app`,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID || "kalex-cloud.firebasestorage.app"
}) : getApp();

const adminAuth = getAuth(app);

// Inizializza l'istanza Data Connect per l'Admin SDK
const adminDataConnect = getDataConnect(connectorConfig);

// Inizializza Firestore per l'Admin SDK (usando il database ID dall'env)
const firestoreDbId = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID || "default";
const adminDb = getFirestore(app, firestoreDbId);

// Inizializza Realtime Database per l'Admin SDK
const adminRtdb = getDatabase(app);

// Inizializza Cloud Storage per l'Admin SDK (utilizza il default bucket configurato in initializeApp)
const adminStorage = getStorage(app).bucket();

export { app, adminAuth, adminDataConnect, adminDb, adminRtdb, adminStorage };

