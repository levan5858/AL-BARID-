// Firebase client configuration (for future client-side features)
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore as ClientFirestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA3GxTWveOkFL3AilEx0XxJ7pNqHabdPwA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'al-barid-logistics.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'al-barid-logistics',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'al-barid-logistics.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '525777580034',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:525777580034:web:98ed9ecdf9ca854e64b71b',
}

let app: FirebaseApp | undefined
let firestore: ClientFirestore | undefined
let auth: Auth | undefined

export function getFirebaseClient() {
  if (app && firestore && auth) {
    return { app, firestore, auth }
  }

  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
    firestore = getFirestore(app)
    auth = getAuth(app)
    return { app, firestore, auth }
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig)
  firestore = getFirestore(app)
  auth = getAuth(app)

  return { app, firestore, auth }
}

export default getFirebaseClient