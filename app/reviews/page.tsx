'use client'

import { useState, useEffect } from 'react'
import ReviewCard from '@/components/ReviewCard'

interface Review {
  _id?: string
  customerName: string
  rating: number
  reviewText: string
  location: string
  createdAt: string | Date
  approved?: boolean
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    reviewText: '',
    location: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/reviews')

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      setReviews(data.filter((r: Review) => r.approved !== false))
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews')
      // Mock reviews for demo
      setReviews([
        {
          _id: '1',
          customerName: 'Ahmed Al-Mansouri',
          rating: 5,
          reviewText: 'Excellent service! My package arrived on time and in perfect condition. The tracking system is very accurate and customer service was very helpful.',
          location: 'Dubai, UAE',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          approved: true,
        },
        {
          _id: '2',
          customerName: 'Fatima Hassan',
          rating: 5,
          reviewText: 'Al Barid Logistics has been my go-to shipping partner for over 3 years. Reliable, fast, and professional service every time. Highly recommended!',
          location: 'Riyadh, Saudi Arabia',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          approved: true,
        },
        {
          _id: '3',
          customerName: 'Mohammed Ibrahim',
          rating: 5,
          reviewText: 'Great experience from start to finish. The express delivery option was worth it - received my shipment in 24 hours! Will definitely use again.',
          location: 'Kuwait City, Kuwait',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          approved: true,
        },
        {
          _id: '4',
          customerName: 'Sara Al-Zahra',
          rating: 4,
          reviewText: 'Very professional and efficient service. The only reason I gave 4 stars instead of 5 is because the delivery was slightly later than estimated, but still acceptable.',
          location: 'Doha, Qatar',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          approved: true,
        },
        {
          _id: '5',
          customerName: 'Khalid Abdullah',
          rating: 5,
          reviewText: 'Outstanding logistics company! They handled my international shipment with ease. Customs clearance was smooth and communication was excellent throughout.',
          location: 'Abu Dhabi, UAE',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          approved: true,
        },
        {
          _id: '6',
          customerName: 'Noor Al-Mutawa',
          rating: 5,
          reviewText: 'Fast, reliable, and affordable. The best logistics service I have used in the Middle East. Their customer support team is always available to help.',
          location: 'Manama, Bahrain',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          approved: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
          approved: false, // Reviews need approval
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      const newReview = await response.json()
      alert('Thank you for your review! It will be published after approval.')
      setShowForm(false)
      setFormData({
        customerName: '',
        rating: 5,
        reviewText: '',
        location: '',
      })
      fetchReviews()
    } catch (err) {
      console.error('Error submitting review:', err)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-xl text-gray-100">
            See what our customers say about Al Barid Logistics
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Customer Testimonials</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Add Review Form */}
          {showForm && (
            <div className="mb-12 bg-white rounded-lg shadow-md p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className={`text-3xl ${
                          rating <= formData.rating ? 'text-accent' : 'text-gray-300'
                        } hover:text-accent transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={5}
                    placeholder="Share your experience with Al Barid Logistics..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <ReviewCard key={review._id || review.customerName + review.createdAt} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}