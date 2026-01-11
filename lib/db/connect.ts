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
  } catch (error) {
    console.error('Firebase connection error:', error)
    throw error
  }
}

export default connectDB