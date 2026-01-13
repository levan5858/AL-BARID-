'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TrackingInput from '@/components/TrackingInput'
import TrackingResult from '@/components/TrackingResult'

interface TrackingStatus {
  trackingNumber: string
  status: string
  currentLocation: string
  estimatedDelivery: string
  history: Array<{
    status: string
    location: string
    timestamp: string
    description: string
  }>
  sender: {
    name: string
    city: string
    country: string
  }
  receiver: {
    name: string
    city: string
    country: string
  }
  packageDetails: {
    weight: number
    dimensions: string
    contents: string
  }
}

function TrackPageContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q')
  
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([])
  const [trackingResults, setTrackingResults] = useState<Map<string, TrackingStatus | null>>(new Map())
  const [isLoading, setIsLoading] = useState<Map<string, boolean>>(new Map())
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (queryParam) {
      const numbers = queryParam.split(',').map((n) => n.trim()).filter((n) => n)
      if (numbers.length > 0) {
        setTrackingNumbers(numbers)
        numbers.forEach((num) => {
          fetchTracking(num)
        })
      }
    }
  }, [queryParam])

  const fetchTracking = async (trackingNumber: string) => {
    // Normalize tracking number (uppercase, trim)
    const normalizedTracking = trackingNumber.trim().toUpperCase()
    
    setIsLoading((prev) => new Map(prev).set(normalizedTracking, true))
    setErrors((prev) => {
      const newMap = new Map(prev)
      newMap.delete(normalizedTracking)
      return newMap
    })

    try {
      const response = await fetch(`/api/tracking/${normalizedTracking}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Tracking number not found' }))
        throw new Error(errorData.error || 'Tracking number not found')
      }

      const data = await response.json()
      
      // Verify we got valid data
      if (!data || !data.trackingNumber) {
        throw new Error('Invalid tracking data received')
      }
      
      setTrackingResults((prev) => new Map(prev).set(normalizedTracking, data))
      setErrors((prev) => {
        const newMap = new Map(prev)
        newMap.delete(normalizedTracking)
        return newMap
      })
    } catch (err) {
      console.error('Error fetching tracking:', err)
      const errorMessage = err instanceof Error ? err.message : 'Tracking number not found'
      setErrors((prev) => new Map(prev).set(normalizedTracking, errorMessage))
      setTrackingResults((prev) => new Map(prev).set(normalizedTracking, null))
      // Removed mock data fallback - show actual error instead
    } finally {
      setIsLoading((prev) => new Map(prev).set(normalizedTracking, false))
    }
  }

  const handleTrack = (trackingNumber: string) => {
    const numbers = trackingNumber.split(',').map((n) => n.trim().toUpperCase()).filter((n) => n)
    if (numbers.length === 0) return

    setTrackingNumbers(numbers)
    numbers.forEach((num) => {
      const normalized = num.trim().toUpperCase()
      if (!trackingResults.has(normalized) && !isLoading.get(normalized)) {
        fetchTracking(normalized)
      }
    })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Track Shipment</h1>
          <p className="text-xl text-gray-100">
            Enter your tracking number(s) to view real-time shipment status
          </p>
        </div>
      </section>

      {/* Tracking Input Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Your Shipment</h2>
            <p className="text-gray-600 mb-6">
              Enter one or multiple tracking numbers (separated by commas) to track your shipments
            </p>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter tracking number(s), e.g., AB1234567890 or AB123, AB456, AB789"
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTrack(e.currentTarget.value)
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Enter tracking number"]') as HTMLInputElement
                if (input && input.value) {
                  handleTrack(input.value)
                }
              }}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Track Shipment
            </button>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingNumbers.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tracking Results</h2>
            <div className="space-y-8">
              {trackingNumbers.map((trackingNumber) => (
                <div key={trackingNumber}>
                  <TrackingResult
                    tracking={trackingResults.get(trackingNumber) || null}
                    isLoading={isLoading.get(trackingNumber) || false}
                    error={errors.get(trackingNumber) || null}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {trackingNumbers.length === 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Tracking Results Yet
            </h2>
            <p className="text-gray-600 mb-8">
              Enter a tracking number above to see your shipment status and location
            </p>
          </div>
        </section>
      )}
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  )
}