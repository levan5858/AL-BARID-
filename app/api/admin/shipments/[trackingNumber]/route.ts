import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, Tracking } from '@/lib/firebase/collections'
import { Timestamp } from 'firebase-admin/firestore'

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

    const shipment = shipmentDoc.data()
    
    // Get tracking history
    const trackingsRef = collections.trackings()
    const trackingHistorySnapshot = await trackingsRef
      .where('trackingNumber', '==', trackingNumber)
      .orderBy('timestamp', 'desc')
      .get()

    const history = trackingHistorySnapshot.docs.map((doc: any) => {
      const entry = doc.data()
      return {
        id: doc.id,
        status: entry.status,
        location: entry.location,
        description: entry.description,
        timestamp: entry.timestamp?.toDate?.() ? entry.timestamp.toDate().toISOString() : new Date().toISOString(),
      }
    })

    return NextResponse.json({
      ...shipment,
      history,
    })
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await connectDB()

    const { trackingNumber } = params
    const body = await request.json()
    const { status, location, description, estimatedDelivery } = body

    const shipmentsRef = collections.shipments()
    const shipmentDoc = await shipmentsRef.doc(trackingNumber).get()

    if (!shipmentDoc.exists) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Prepare update object
    const updateData: any = {
      updatedAt: Timestamp.fromDate(new Date()),
    }

    // Update shipment status and location
    if (status) {
      updateData.status = status
      updateData.currentLocation = location || shipmentDoc.data()?.currentLocation
    }

    // Update estimated delivery date
    if (estimatedDelivery) {
      const deliveryDate = new Date(estimatedDelivery)
      if (!isNaN(deliveryDate.getTime())) {
        updateData.estimatedDelivery = Timestamp.fromDate(deliveryDate)
      } else {
        return NextResponse.json(
          { error: 'Invalid date format for estimated delivery' },
          { status: 400 }
        )
      }
    }

    // Update shipment
    await shipmentsRef.doc(trackingNumber).update(updateData)

    // Add tracking entry (only if status update with location and description)
    if (status && location && description) {
      const trackingsRef = collections.trackings()
      const trackingData: Tracking = {
        trackingNumber,
        status,
        location,
        description,
        timestamp: Timestamp.fromDate(new Date()),
      }
      await trackingsRef.add(trackingData)
    }

    return NextResponse.json({
      message: 'Shipment updated successfully',
      trackingNumber,
    })
  } catch (error) {
    console.error('Error updating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to update shipment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Delete associated tracking history
    const trackingsRef = collections.trackings()
    const trackingHistorySnapshot = await trackingsRef
      .where('trackingNumber', '==', trackingNumber)
      .get()

    const deletePromises = trackingHistorySnapshot.docs.map((doc) => doc.ref.delete())
    await Promise.all(deletePromises)

    // Delete the shipment
    await shipmentsRef.doc(trackingNumber).delete()

    return NextResponse.json({
      message: 'Shipment deleted successfully',
      trackingNumber,
    })
  } catch (error) {
    console.error('Error deleting shipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete shipment' },
      { status: 500 }
    )
  }
}
