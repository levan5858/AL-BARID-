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

    // Find shipment - try exact match first
    const shipmentsRef = collections.shipments()
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

    // Get tracking history - use the actual tracking number from shipment
    const actualTrackingNumber = shipment.trackingNumber || normalizedTracking
    const trackingsRef = collections.trackings()
    let trackingHistorySnapshot
    
    try {
      // Try ordered query first (requires index)
      trackingHistorySnapshot = await trackingsRef
        .where('trackingNumber', '==', actualTrackingNumber)
        .orderBy('timestamp', 'desc')
        .get()
    } catch (indexError: any) {
      // If index missing, get all and sort in memory
      console.warn('Tracking index not found, using fallback query:', indexError.message)
      const allTrackingsSnapshot = await trackingsRef
        .where('trackingNumber', '==', actualTrackingNumber)
        .get()
      
      trackingHistorySnapshot = allTrackingsSnapshot
    }

    // Format tracking history and sort chronologically (oldest first for display)
    // Ensure history is always an array, never undefined
    const history = trackingHistorySnapshot.docs && trackingHistorySnapshot.docs.length > 0
      ? trackingHistorySnapshot.docs.map((doc: any) => {
          const entry = doc.data()
          return {
            status: entry.status || 'Pending',
            location: entry.location || shipment.currentLocation || `${shipment.sender?.city || ''}, ${shipment.sender?.country || ''}`,
            timestamp: entry.timestamp ? convertTimestampToDate(entry.timestamp).toISOString() : new Date().toISOString(),
            description: entry.description || '',
          }
        }).sort((a, b) => {
          // Sort by timestamp ascending (oldest first)
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        })
      : [] // Always return an array, never undefined

    // Build response with complete shipment data
    const estimatedDeliveryDate = convertTimestampToDate(shipment.estimatedDelivery)
    
    const response = {
      trackingNumber: actualTrackingNumber,
      status: shipment.status || 'Pending',
      currentLocation: shipment.currentLocation || `${shipment.sender?.city || ''}, ${shipment.sender?.country || ''}`,
      estimatedDelivery: estimatedDeliveryDate.toISOString().split('T')[0],
      history: history || [], // Ensure it's always an array
      sender: {
        name: shipment.sender?.name || '',
        email: shipment.sender?.email || '',
        phone: shipment.sender?.phone || '',
        address: shipment.sender?.address || '',
        city: shipment.sender?.city || '',
        country: shipment.sender?.country || '',
        postalCode: shipment.sender?.postalCode || '',
      },
      receiver: {
        name: shipment.receiver?.name || '',
        email: shipment.receiver?.email || '',
        phone: shipment.receiver?.phone || '',
        address: shipment.receiver?.address || '',
        city: shipment.receiver?.city || '',
        country: shipment.receiver?.country || '',
        postalCode: shipment.receiver?.postalCode || '',
      },
      packageDetails: {
        weight: shipment.packageDetails?.weight || 0,
        length: shipment.packageDetails?.length || 0,
        width: shipment.packageDetails?.width || 0,
        height: shipment.packageDetails?.height || 0,
        dimensions: shipment.packageDetails 
          ? `${shipment.packageDetails.length} x ${shipment.packageDetails.width} x ${shipment.packageDetails.height} cm`
          : '0 x 0 x 0 cm',
        contents: shipment.packageDetails?.contents || '',
        value: shipment.packageDetails?.value || 0,
      },
      deliveryOptions: {
        serviceType: shipment.deliveryOptions?.serviceType || 'standard',
        insurance: shipment.deliveryOptions?.insurance || false,
        specialInstructions: shipment.deliveryOptions?.specialInstructions || '',
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