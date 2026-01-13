'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

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
    email?: string
    phone?: string
    address?: string
    city: string
    country: string
    postalCode?: string
  }
  receiver: {
    name: string
    email?: string
    phone?: string
    address?: string
    city: string
    country: string
    postalCode?: string
  }
  packageDetails: {
    weight: number
    dimensions: string
    contents: string
  }
}

interface TrackingResultProps {
  tracking: TrackingStatus | null
  isLoading?: boolean
  error?: string | null
}

export default function TrackingResult({ tracking, isLoading, error }: TrackingResultProps) {
  const timelineRef = useRef(null)
  const isInView = useInView(timelineRef, { once: true, margin: '-50px' })
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const statusSteps = [
    { key: 'Pending', label: 'Pending', icon: '📋' },
    { key: 'Picked Up', label: 'Picked Up', icon: '📦' },
    { key: 'In Transit', label: 'In Transit', icon: '🚚' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🚛' },
    { key: 'Delivered', label: 'Delivered', icon: '✅' },
  ]

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex((step) => step.key === status)
    return index >= 0 ? index : 0
  }

  const currentStatusIndex = tracking ? getStatusIndex(tracking.status) : -1

  // Calculate progress percentage (0-100%)
  const progressPercentage = tracking && tracking.status !== 'Exception'
    ? ((currentStatusIndex + 1) / statusSteps.length) * 100
    : 0

  // Animate progress bar
  useEffect(() => {
    if (isInView && tracking && tracking.status !== 'Exception') {
      const duration = 1500
      const steps = 60
      const increment = progressPercentage / steps
      let current = 0
      
      const interval = setInterval(() => {
        current += increment
        if (current >= progressPercentage) {
          setAnimatedProgress(progressPercentage)
          clearInterval(interval)
        } else {
          setAnimatedProgress(current)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [isInView, progressPercentage, tracking])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tracking information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!tracking) {
    return null
  }

  // Exception status handling
  if (tracking.status === 'Exception') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6 md:p-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tracking Number: <span className="text-primary">{tracking.trackingNumber}</span>
          </h2>
          <div className="inline-block px-4 py-2 rounded-full font-semibold bg-red-100 text-red-800">
            Status: Exception
          </div>
        </div>

        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">⚠️</span>
            <h4 className="text-xl font-bold text-red-800">Exception Status</h4>
          </div>
          {tracking.history.length > 0 && (
            <div className="text-sm text-red-700">
              <p className="font-semibold mb-1">Location: {tracking.currentLocation}</p>
              <p className="text-gray-600">{tracking.history[tracking.history.length - 1]?.description || 'An exception has occurred with this shipment.'}</p>
              <p className="text-gray-500 mt-2">{tracking.history[tracking.history.length - 1]?.timestamp}</p>
            </div>
          )}
        </div>

        {/* Package Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Sender</h4>
            <p className="text-gray-600">{tracking.sender.name}</p>
            <p className="text-gray-600">{tracking.sender.city}, {tracking.sender.country}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Receiver</h4>
            <p className="text-gray-600">{tracking.receiver.name}</p>
            <p className="text-gray-600">{tracking.receiver.city}, {tracking.receiver.country}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-md p-6 md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tracking Number: <span className="text-primary">{tracking.trackingNumber}</span>
        </h2>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`inline-block px-4 py-2 rounded-full font-semibold ${
            tracking.status === 'Delivered' ? 'bg-green-100 text-green-800' :
            tracking.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
            tracking.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
            tracking.status === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}
        >
          Status: {tracking.status}
        </motion.div>
      </div>

      {/* Traditional Vertical Timeline */}
      <div className="mb-8" ref={timelineRef}>
        <h3 className="text-lg font-bold text-gray-900 mb-6">Shipping Status</h3>
        
        {tracking.history.length > 0 ? (
          <div className="relative pl-8 md:pl-12">
            {/* Vertical Timeline Line Background */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute left-4 md:left-6 top-0 bottom-0 w-1 bg-gray-200 origin-top"
            ></motion.div>
            
            {/* Animated Progress Fill */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
              className="absolute left-4 md:left-6 top-0 w-1 bg-primary origin-top"
              style={{ 
                height: tracking.history.length > 0 
                  ? `${(tracking.history.length / (tracking.history.length + 1)) * 100}%` 
                  : '0%' 
              }}
            ></motion.div>

            {/* Timeline Items from History */}
            <div className="space-y-6">
              {tracking.history.map((entry, index) => {
                const entryStatus = entry.status
                const statusIndex = getStatusIndex(entryStatus)
                const isCompleted = statusIndex <= currentStatusIndex
                const isLast = index === tracking.history.length - 1
                
                // Format date nicely
                const date = new Date(entry.timestamp)
                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                const formattedTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    className="relative flex items-start"
                  >
                    {/* Timeline Node */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 200,
                        delay: index * 0.15 + 0.2 
                      }}
                      className={`absolute left-0 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        isCompleted ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      style={{ left: '16px' }}
                    >
                      {isCompleted && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.15 + 0.3 }}
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </motion.div>

                    {/* Timeline Content */}
                    <div className="ml-8 md:ml-12 flex-1">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: index * 0.15 + 0.4 }}
                        className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-primary"
                      >
                        <h4 className={`text-lg font-bold mb-3 ${
                          isCompleted ? 'text-primary' : 'text-gray-500'
                        }`}>
                          {entryStatus}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <strong>Location:</strong> {entry.location}
                          </p>
                          <p className="text-gray-600">
                            <strong>Date:</strong> {formattedDate} at {formattedTime}
                          </p>
                          {entry.description && (
                            <p className="text-gray-600 mt-2 italic">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Moving Package Icon (animated along timeline) */}
            {tracking.history.length > 0 && (
              <motion.div
                initial={{ top: 0, opacity: 0 }}
                animate={isInView ? { 
                  top: `${Math.min((tracking.history.length / (tracking.history.length + 1)) * 100, 100)}%`, 
                  opacity: 1 
                } : { top: 0, opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute left-4 md:left-6 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-2xl"
                >
                  📦
                </motion.div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tracking history available yet.</p>
          </div>
        )}
      </div>

      {/* Package Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h4 className="font-bold text-gray-900 mb-3">Sender Information</h4>
          <p className="text-gray-900 font-semibold mb-1">{tracking.sender.name}</p>
          {tracking.sender.address && (
            <p className="text-gray-600 text-sm mb-1">{tracking.sender.address}</p>
          )}
          <p className="text-gray-600 text-sm mb-1">{tracking.sender.city}, {tracking.sender.country}</p>
          {tracking.sender.postalCode && (
            <p className="text-gray-500 text-xs mb-1">Postal Code: {tracking.sender.postalCode}</p>
          )}
          {tracking.sender.phone && (
            <p className="text-gray-500 text-xs mb-1">Phone: {tracking.sender.phone}</p>
          )}
          {tracking.sender.email && (
            <p className="text-gray-500 text-xs">Email: {tracking.sender.email}</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h4 className="font-bold text-gray-900 mb-3">Receiver Information</h4>
          <p className="text-gray-900 font-semibold mb-1">{tracking.receiver.name}</p>
          {tracking.receiver.address && (
            <p className="text-gray-600 text-sm mb-1">{tracking.receiver.address}</p>
          )}
          <p className="text-gray-600 text-sm mb-1">{tracking.receiver.city}, {tracking.receiver.country}</p>
          {tracking.receiver.postalCode && (
            <p className="text-gray-500 text-xs mb-1">Postal Code: {tracking.receiver.postalCode}</p>
          )}
          {tracking.receiver.phone && (
            <p className="text-gray-500 text-xs mb-1">Phone: {tracking.receiver.phone}</p>
          )}
          {tracking.receiver.email && (
            <p className="text-gray-500 text-xs">Email: {tracking.receiver.email}</p>
          )}
        </motion.div>
      </div>

      {/* Package Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 p-4 rounded-lg mb-8"
      >
        <h4 className="font-bold text-gray-900 mb-2">Package Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Weight: </span>
            <span className="font-semibold">{tracking.packageDetails.weight} kg</span>
          </div>
          <div>
            <span className="text-gray-600">Dimensions: </span>
            <span className="font-semibold">{tracking.packageDetails.dimensions}</span>
          </div>
          <div>
            <span className="text-gray-600">Contents: </span>
            <span className="font-semibold">{tracking.packageDetails.contents}</span>
          </div>
        </div>
      </motion.div>

      {/* Estimated Delivery */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-primary-light bg-opacity-10 border border-primary rounded-lg p-4"
      >
        <p className="text-gray-700">
          <span className="font-bold">Estimated Delivery: </span>
          {tracking.estimatedDelivery}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Current Location: {tracking.currentLocation}
        </p>
      </motion.div>

    </motion.div>
  )
}
