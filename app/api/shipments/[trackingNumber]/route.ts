import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, convertTimestampToDate } from '@/lib/firebase/collections'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await connectDB()

    // Normalize tracking number (uppercase, trim)
    const normalizedTracking = params.trackingNumber.trim().toUpperCase()
    const shipmentsRef = collections.shipments()
    
    // Try exact match first
    let shipmentDoc = await shipmentsRef.doc(normalizedTracking).get()

    // If not found, try case-insensitive search
    if (!shipmentDoc.exists) {
      const allShipmentsSnapshot = await shipmentsRef.limit(500).get()
      for (const doc of allShipmentsSnapshot.docs) {
        const data = doc.data()
        if (data.trackingNumber && data.trackingNumber.toUpperCase() === normalizedTracking) {
          shipmentDoc = doc
          break
        }
      }
    }

    if (!shipmentDoc.exists) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    const shipmentData = shipmentDoc.data()
    if (!shipmentData) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Convert Firestore Timestamps to ISO strings for JSON response
    const shipment = {
      ...shipmentData,
      estimatedDelivery: convertTimestampToDate(shipmentData.estimatedDelivery).toISOString(),
      createdAt: shipmentData.createdAt ? convertTimestampToDate(shipmentData.createdAt).toISOString() : undefined,
      updatedAt: shipmentData.updatedAt ? convertTimestampToDate(shipmentData.updatedAt).toISOString() : undefined,
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipment' },
      { status: 500 }
    )
  }
}