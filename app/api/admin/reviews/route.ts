import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, convertTimestampToDate } from '@/lib/firebase/collections'

// GET all reviews (including unapproved) for admin
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const reviewsRef = collections.reviews()
    const reviewsSnapshot = await reviewsRef
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    const reviews = reviewsSnapshot.docs.map((doc: any) => {
      const data = doc.data()
      return {
        _id: doc.id,
        ...data,
        createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : new Date().toISOString(),
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
