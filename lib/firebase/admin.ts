import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let app: App | undefined
let db: Firestore | undefined

function getFirebaseAdmin() {
  if (app && db) {
    return { app, db }
  }

  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
    db = getFirestore(app)
    return { app, db }
  }

  // Get service account from environment variable
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT

  if (!serviceAccountEnv) {
    throw new Error(
      'Please define the FIREBASE_SERVICE_ACCOUNT environment variable inside .env.local'
    )
  }

  let serviceAccount: any

  try {
    // Parse the JSON string from environment variable
    serviceAccount = JSON.parse(serviceAccountEnv)
  } catch (error) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT must be a valid JSON string. Make sure all quotes are properly escaped.'
    )
  }

  // Initialize Firebase Admin
  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || 'al-barid-logistics',
  })

  db = getFirestore(app)
  console.log('Connected to Firebase Firestore')

  return { app, db }
}

export function getFirestoreDB(): Firestore {
  const { db } = getFirebaseAdmin()
  if (!db) {
    throw new Error('Firestore database not initialized')
  }
  return db
}

export default getFirebaseAdmin