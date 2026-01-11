'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrackingInput({ className = '' }: { className?: string }) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setIsLoading(true)
    // Navigate to track page with tracking number
    router.push(`/track?q=${encodeURIComponent(trackingNumber.trim())}`)
  }

  return (
    <form onSubmit={handleTrack} className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter your tracking number"
          className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-lg"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-accent hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Tracking...' : 'Track Shipment'}
        </button>
      </div>
    </form>
  )
}