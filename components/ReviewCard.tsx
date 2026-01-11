'use client'

interface Review {
  _id?: string
  customerName: string
  rating: number
  reviewText: string
  location: string
  createdAt: string | Date
  approved?: boolean
}

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < rating ? 'text-accent' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{review.customerName}</h3>
          <p className="text-sm text-gray-500">{review.location}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center mb-1">{renderStars(review.rating)}</div>
          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
    </div>
  )
}