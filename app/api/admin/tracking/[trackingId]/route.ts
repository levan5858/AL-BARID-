import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections } from '@/lib/firebase/collections'
import { Timestamp } from 'firebase-admin/firestore'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    await connectDB()

    const { trackingId } = params
    const body = await request.json()
    const { status, location, description, timestamp } = body

    const trackingsRef = collections.trackings()
    const trackingDoc = await trackingsRef.doc(trackingId).get()

    if (!trackingDoc.exists) {
      return NextResponse.json(
        { error: 'Tracking entry not found' },
        { status: 404 }
      )
    }

    // Prepare update object
    const updateData: any = {}

    if (status) {
      updateData.status = status
    }

    if (location) {
      updateData.location = location
    }

    if (description !== undefined) {
      updateData.description = description
    }

    if (timestamp) {
      const date = new Date(timestamp)
      if (!isNaN(date.getTime())) {
        updateData.timestamp = Timestamp.fromDate(date)
      } else {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }
    }

    // Update tracking entry
    await trackingsRef.doc(trackingId).update(updateData)

    return NextResponse.json({
      message: 'Tracking entry updated successfully',
      trackingId,
    })
  } catch (error) {
    console.error('Error updating tracking entry:', error)
    return NextResponse.json(
      { error: 'Failed to update tracking entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    await connectDB()

    const { trackingId } = params
    const trackingsRef = collections.trackings()
    const trackingDoc = await trackingsRef.doc(trackingId).get()

    if (!trackingDoc.exists) {
      return NextResponse.json(
        { error: 'Tracking entry not found' },
        { status: 404 }
      )
    }

    await trackingsRef.doc(trackingId).delete()

    return NextResponse.json({
      message: 'Tracking entry deleted successfully',
      trackingId,
    })
  } catch (error) {
    console.error('Error deleting tracking entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete tracking entry' },
      { status: 500 }
    )
  }
}
