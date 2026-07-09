import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDataConnect } from "firebase-admin/data-connect";
import { connectorConfig } from "@/lib/dataconnect-admin";

// Inizializza l'app Admin SDK per KALEX (singola istanza)
const app = getApps().length === 0 ? initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kalex-dev"
}) : getApp();

const adminAuth = getAuth(app);

// Inizializza l'istanza Data Connect per l'Admin SDK
const adminDataConnect = getDataConnect(connectorConfig);

export { app, adminAuth, adminDataConnect };

