import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, convertTimestampToDate } from '@/lib/firebase/collections'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await connectDB()

    const { trackingNumber } = params
    const shipmentsRef = collections.shipments()
    const shipmentDoc = await shipmentsRef.doc(trackingNumber).get()

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