import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections } from '@/lib/firebase/collections'

// PATCH to approve/reject a review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    await connectDB()

    const { reviewId } = params
    const { approved } = await request.json()

    const reviewsRef = collections.reviews()
    const reviewDoc = await reviewsRef.doc(reviewId).get()

    if (!reviewDoc.exists) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    await reviewsRef.doc(reviewId).update({
      approved: approved === true,
    })

    return NextResponse.json({
      message: approved ? 'Review approved successfully' : 'Review rejected successfully',
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE to remove a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    await connectDB()

    const { reviewId } = params
    const reviewsRef = collections.reviews()
    const reviewDoc = await reviewsRef.doc(reviewId).get()

    if (!reviewDoc.exists) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    await reviewsRef.doc(reviewId).delete()

    return NextResponse.json({
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
