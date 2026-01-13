import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, Shipment, Tracking } from '@/lib/firebase/collections'
import { Timestamp } from 'firebase-admin/firestore'

// Generate unique tracking number
function generateTrackingNumber(): string {
  const prefix = 'AB'
  const timestamp = Date.now().toString().slice(-10)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { sender, receiver, packageDetails, deliveryOptions } = body

    // Validate required fields
    if (!sender || !receiver || !packageDetails || !deliveryOptions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique tracking number (normalized to uppercase)
    let trackingNumber: string = ''
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10
    
    while (!isUnique && attempts < maxAttempts) {
      trackingNumber = generateTrackingNumber().toUpperCase()
      const shipmentsRef = collections.shipments()
      const existing = await shipmentsRef
        .doc(trackingNumber)
        .get()
      
      if (!existing.exists) {
        isUnique = true
      }
      attempts++
    }
    
    if (!isUnique || !trackingNumber) {
      return NextResponse.json(
        { error: 'Failed to generate unique tracking number. Please try again.' },
        { status: 500 }
      )
    }

    // Calculate estimated delivery date (3-5 days for standard, 1-2 days for express)
    const estimatedDeliveryDate = new Date()
    if (deliveryOptions.serviceType === 'express') {
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 2)
    } else {
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5)
    }

    const now = new Date()
    const estimatedDelivery = Timestamp.fromDate(estimatedDeliveryDate)

    // Create shipment document
    const shipmentData: Omit<Shipment, 'createdAt' | 'updatedAt'> = {
      trackingNumber,
      sender,
      receiver,
      packageDetails,
      deliveryOptions,
          status: 'Pending',
      currentLocation: `${sender.city}, ${sender.country}`,
      estimatedDelivery,
    }

    // Save shipment to Firestore
    const shipmentsRef = collections.shipments()
    await shipmentsRef.doc(trackingNumber).set({
      ...shipmentData,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    })

    // Create initial tracking entry
        const trackingData: Tracking = {
          trackingNumber,
          status: 'Pending',
          location: `${sender.city}, ${sender.country}`,
          description: 'Shipment created and collected',
          timestamp: Timestamp.fromDate(now),
        }

    // Save tracking to Firestore
    const trackingsRef = collections.trackings()
    await trackingsRef.add(trackingData)

    // Return shipment data (convert Timestamp to ISO string for JSON response)
    const shipmentResponse = {
      _id: trackingNumber,
      trackingNumber,
      sender,
      receiver,
      packageDetails,
      deliveryOptions,
      status: 'Pending',
      currentLocation: `${sender.city}, ${sender.country}`,
      estimatedDelivery: estimatedDelivery.toDate().toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    return NextResponse.json(
      {
        message: 'Shipment created successfully',
        trackingNumber,
        shipment: shipmentResponse,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    )
  }
}