import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections } from '@/lib/firebase/collections'

export async function GET(request: NextRequest) {
  try {
    // Test Firestore connection
    await connectDB()
    
    // Try to access a collection to verify connection
    const shipmentsRef = collections.shipments()
    await shipmentsRef.limit(1).get()

    return NextResponse.json({
      status: 'OK',
      message: 'Al Barid Logistics API is running',
      database: 'connected',
      databaseType: 'Firestore',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Database connection failed',
        database: 'disconnected',
        databaseType: 'Firestore',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}