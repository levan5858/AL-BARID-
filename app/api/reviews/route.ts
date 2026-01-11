import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import { collections, convertTimestampToDate, Review } from '@/lib/firebase/collections'
import { Timestamp } from 'firebase-admin/firestore'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const reviewsRef = collections.reviews()
    // Note: This query requires a composite index: approved (asc) + createdAt (desc)
    // Firestore will provide a link to create it automatically if missing
    const reviewsSnapshot = await reviewsRef
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50)
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
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { customerName, rating, reviewText, location } = body

    // Validate required fields
    if (!customerName || !rating || !reviewText || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Basic spam check (simple keyword filtering)
    const spamKeywords = ['spam', 'test', 'fake', 'scam']
    const reviewLower = reviewText.toLowerCase()
    const isSpam = spamKeywords.some((keyword) => reviewLower.includes(keyword))

    // Create review (approved = false by default for moderation)
    const now = new Date()
    const reviewData: Review = {
      customerName,
      rating,
      reviewText,
      location,
      approved: !isSpam && rating >= 4, // Auto-approve high ratings unless spam
      createdAt: Timestamp.fromDate(now),
    }

    // Save review to Firestore
    const reviewsRef = collections.reviews()
    const reviewRef = await reviewsRef.add(reviewData)
    const reviewDoc = await reviewRef.get()
    const review = reviewDoc.data()

    if (!review) {
      throw new Error('Failed to retrieve created review')
    }

    // Return review with ID and formatted date
    const reviewResponse = {
      _id: reviewRef.id,
      ...review,
      createdAt: convertTimestampToDate(review.createdAt || now).toISOString(),
    }

    return NextResponse.json(
      {
        message: 'Review submitted successfully',
        review: reviewResponse,
        approved: review.approved,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}