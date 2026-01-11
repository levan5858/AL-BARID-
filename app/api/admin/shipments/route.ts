import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, convertTimestampToDate } from '@/lib/firebase/collections'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const shipmentsRef = collections.shipments()
    // Get shipments (limit 100, will sort in memory if needed)
    const shipmentsSnapshot = await shipmentsRef
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

    return NextResponse.json(shipments)
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}
