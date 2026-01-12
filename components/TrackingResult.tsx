'use client'

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

  const statusSteps = [
    { key: 'Pending', label: 'Pending' },
    { key: 'Picked Up', label: 'Picked Up' },
    { key: 'In Transit', label: 'In Transit' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' },
    { key: 'Exception', label: 'Exception' },
  ]

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex((step) => step.key === status)
    return index >= 0 ? index : 0
  }

  const currentStatusIndex = getStatusIndex(tracking.status)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tracking Number: <span className="text-primary">{tracking.trackingNumber}</span>
        </h2>
        <div className={`inline-block px-4 py-2 rounded-full font-semibold ${
          tracking.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          tracking.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
          tracking.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
          tracking.status === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
          tracking.status === 'Exception' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          Status: {tracking.status}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Status</h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStatusIndex && tracking.status !== 'Exception'
              const isCurrent = index === currentStatusIndex
              const isException = tracking.status === 'Exception' && step.key === 'Exception'
              
              return (
                <div key={step.key} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    isException ? 'bg-red-500' :
                    isCompleted ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                    {isCompleted && !isException && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isException && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className={`font-semibold ${isCompleted || isException ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                    {(isCurrent || isException) && tracking.history.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{tracking.currentLocation}</p>
                        <p className="text-gray-500">{tracking.history[tracking.history.length - 1]?.timestamp}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
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

      {/* Package Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
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
      </div>

      {/* Estimated Delivery */}
      <div className="bg-primary-light bg-opacity-10 border border-primary rounded-lg p-4">
        <p className="text-gray-700">
          <span className="font-bold">Estimated Delivery: </span>
          {tracking.estimatedDelivery}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Current Location: {tracking.currentLocation}
        </p>
      </div>

      {/* Tracking History */}
      {tracking.history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking History</h3>
          <div className="space-y-4">
            {tracking.history.map((entry, index) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900">{entry.status}</span>
                  <span className="text-sm text-gray-500">{entry.timestamp}</span>
                </div>
                <p className="text-gray-600">{entry.location}</p>
                {entry.description && (
                  <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}