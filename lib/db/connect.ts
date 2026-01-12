// Firebase Firestore connection utility
// This replaces the MongoDB connection for compatibility
import { getFirestoreDB } from '@/lib/firebase/admin'

async function connectDB() {
  // Initialize and return Firestore database
  // This function maintains the same interface as MongoDB connection
  // for easy migration of API routes
  try {
    const db = getFirestoreDB()
    return db
  } catch (error: any) {
    // During build time, env vars might not be available
    // This is expected and will work at runtime
    if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
      // Re-throw with a clearer message
      throw new Error(
        'Firebase connection cannot be established during build. ' +
        'This is expected - ensure FIREBASE_SERVICE_ACCOUNT is set in Vercel environment variables.'
      )
    }
    console.error('Firebase connection error:', error)
    throw error
  }
}

export default connectDB