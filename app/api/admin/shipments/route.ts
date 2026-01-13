import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, convertTimestampToDate } from '@/lib/firebase/collections'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const shipmentsRef = collections.shipments()
    
    // Try to order by createdAt descending (requires Firestore index)
    try {
      const shipmentsSnapshot = await shipmentsRef
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get()

      const shipments = shipmentsSnapshot.docs.map((doc: any) => {
        const data = doc.data()
        return {
          _id: doc.id,
          trackingNumber: data.trackingNumber,
          sender: data.sender,
          receiver: data.receiver,
          packageDetails: data.packageDetails,
          deliveryOptions: data.deliveryOptions,
          status: data.status,
          currentLocation: data.currentLocation,
          estimatedDelivery: data.estimatedDelivery ? convertTimestampToDate(data.estimatedDelivery).toISOString() : null,
          createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : null,
          updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : null,
        }
      })

      // Add cache-control headers to prevent caching
      return NextResponse.json(shipments, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    } catch (orderError: any) {
      // If ordering fails (index missing), fallback to unordered query and sort in memory
      console.warn('OrderBy index not found, using fallback query:', orderError.message)
      const shipmentsSnapshot = await shipmentsRef.limit(100).get()
      
      const shipments = shipmentsSnapshot.docs.map((doc: any) => {
        const data = doc.data()
        return {
          _id: doc.id,
          trackingNumber: data.trackingNumber,
          sender: data.sender,
          receiver: data.receiver,
          packageDetails: data.packageDetails,
          deliveryOptions: data.deliveryOptions,
          status: data.status,
          currentLocation: data.currentLocation,
          estimatedDelivery: data.estimatedDelivery ? convertTimestampToDate(data.estimatedDelivery).toISOString() : null,
          createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : null,
          updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : null,
        }
      })
      
      // Sort in memory by createdAt descending
      shipments.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
      
      return NextResponse.json(shipments, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    }
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}
