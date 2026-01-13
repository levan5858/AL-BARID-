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

interface TrackingResultProps {
  tracking: TrackingStatus | null
  isLoading?: boolean
  error?: string | null
}

export default function TrackingResult({ tracking, isLoading, error }: TrackingResultProps) {
  const timelineRef = useRef(null)
  const isInView = useInView(timelineRef, { once: true, margin: '-50px' })
  const [animatedIndex, setAnimatedIndex] = useState(-1)

  const statusSteps = [
    { key: 'Pending', label: 'Pending', icon: '📋' },
    { key: 'Picked Up', label: 'Picked Up', icon: '📦' },
    { key: 'In Transit', label: 'In Transit', icon: '🚚' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🚛' },
    { key: 'Delivered', label: 'Delivered', icon: '✅' },
    { key: 'Exception', label: 'Exception', icon: '⚠️' },
  ]

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex((step) => step.key === status)
    return index >= 0 ? index : 0
  }

  const currentStatusIndex = tracking ? getStatusIndex(tracking.status) : -1

  // Animate through completed steps
  useEffect(() => {
    if (isInView && currentStatusIndex >= 0 && tracking) {
      let index = 0
      const interval = setInterval(() => {
        if (index <= currentStatusIndex) {
          setAnimatedIndex(index)
          index++
        } else {
          clearInterval(interval)
        }
      }, 300) // Delay between each step animation
      return () => clearInterval(interval)
    }
  }, [isInView, currentStatusIndex, tracking])

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

  // Calculate progress percentage for the moving package
  const progressPercentage = tracking.status === 'Exception' 
    ? 0 
    : ((currentStatusIndex + 1) / (statusSteps.length - 1)) * 100 // Exclude Exception from progress

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
            tracking.status === 'Exception' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}
        >
          Status: {tracking.status}
        </motion.div>
      </div>

      {/* USPS-Style Animated Timeline */}
      <div className="mb-8" ref={timelineRef}>
        <h3 className="text-lg font-bold text-gray-900 mb-6">Shipping Status</h3>
        
        {/* Progress Bar with Moving Package - Only show for non-exception statuses */}
        {tracking.status !== 'Exception' && (
          <div className="relative mb-12">
            {/* Background Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
            
            {/* Animated Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-1/2 left-0 h-2 bg-primary rounded-full transform -translate-y-1/2"
            ></motion.div>

            {/* Moving Package Icon */}
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-3xl"
              >
                📦
              </motion.div>
            </motion.div>

            {/* Status Steps */}
            <div className="relative flex justify-between mt-8">
              {statusSteps.filter(step => step.key !== 'Exception').map((step, index) => {
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isAnimated = animatedIndex >= index

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    {/* Step Circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isAnimated ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                        isCompleted ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      {isCompleted && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                      {!isCompleted && (
                        <span className="text-gray-500">{step.icon}</span>
                      )}
                    </motion.div>

                    {/* Step Label */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`text-center text-sm font-semibold ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </motion.div>

                    {/* Current Status Info */}
                    {isCurrent && tracking.history.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-2 text-xs text-gray-600 text-center"
                      >
                        <p className="font-semibold">{tracking.currentLocation}</p>
                        <p className="text-gray-500">{tracking.history[tracking.history.length - 1]?.timestamp}</p>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Exception Status Display */}
        {tracking.status === 'Exception' && (
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
          <h4 className="font-bold text-gray-900 mb-2">Sender</h4>
          <p className="text-gray-600">{tracking.sender.name}</p>
          <p className="text-gray-600">{tracking.sender.city}, {tracking.sender.country}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h4 className="font-bold text-gray-900 mb-2">Receiver</h4>
          <p className="text-gray-600">{tracking.receiver.name}</p>
          <p className="text-gray-600">{tracking.receiver.city}, {tracking.receiver.country}</p>
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

      {/* Tracking History */}
      {tracking.history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking History</h3>
          <div className="space-y-4">
            {tracking.history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="border-l-4 border-primary pl-4 py-2"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900">{entry.status}</span>
                  <span className="text-sm text-gray-500">{entry.timestamp}</span>
                </div>
                <p className="text-gray-600">{entry.location}</p>
                {entry.description && (
                  <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
