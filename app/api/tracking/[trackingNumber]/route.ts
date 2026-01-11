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

    // Find shipment
    const shipmentsRef = collections.shipments()
    const shipmentDoc = await shipmentsRef.doc(trackingNumber).get()

    if (!shipmentDoc.exists) {
      return NextResponse.json(
        { error: 'Tracking number not found' },
        { status: 404 }
      )
    }

    const shipment = shipmentDoc.data()
    if (!shipment) {
      return NextResponse.json(
        { error: 'Tracking number not found' },
        { status: 404 }
      )
    }

    // Get tracking history
    // Note: This query requires a composite index: trackingNumber (asc) + timestamp (desc)
    // Firestore will provide a link to create it automatically if missing
    const trackingsRef = collections.trackings()
    const trackingHistorySnapshot = await trackingsRef
      .where('trackingNumber', '==', trackingNumber)
      .orderBy('timestamp', 'desc')
      .get()

    // Format tracking history
    const history = trackingHistorySnapshot.docs.map((doc) => {
      const entry = doc.data()
      return {
        status: entry.status,
        location: entry.location,
        timestamp: convertTimestampToDate(entry.timestamp).toISOString(),
        description: entry.description,
      }
    })

    // Build response
    const estimatedDeliveryDate = convertTimestampToDate(shipment.estimatedDelivery)
    const response = {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: estimatedDeliveryDate.toISOString().split('T')[0],
      history,
      sender: {
        name: shipment.sender.name,
        city: shipment.sender.city,
        country: shipment.sender.country,
      },
      receiver: {
        name: shipment.receiver.name,
        city: shipment.receiver.city,
        country: shipment.receiver.country,
      },
      packageDetails: {
        weight: shipment.packageDetails.weight,
        dimensions: `${shipment.packageDetails.length} x ${shipment.packageDetails.width} x ${shipment.packageDetails.height} cm`,
        contents: shipment.packageDetails.contents,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    )
  }
}