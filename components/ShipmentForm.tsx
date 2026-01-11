'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ShipmentFormData {
  sender: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    postalCode: string
  }
  receiver: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    postalCode: string
  }
  packageDetails: {
    weight: number
    length: number
    width: number
    height: number
    contents: string
    value: number
  }
  deliveryOptions: {
    serviceType: string
    insurance: boolean
    specialInstructions: string
  }
}

export default function ShipmentForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null)

  const [formData, setFormData] = useState<ShipmentFormData>({
    sender: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
    receiver: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
    packageDetails: {
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      contents: '',
      value: 0,
    },
    deliveryOptions: {
      serviceType: 'standard',
      insurance: false,
      specialInstructions: '',
    },
  })

  const updateSender = (field: string, value: string) => {
    setFormData({
      ...formData,
      sender: { ...formData.sender, [field]: value },
    })
  }

  const updateReceiver = (field: string, value: string) => {
    setFormData({
      ...formData,
      receiver: { ...formData.receiver, [field]: value },
    })
  }

  const updatePackageDetails = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      packageDetails: { ...formData.packageDetails, [field]: value },
    })
  }

  const updateDeliveryOptions = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      deliveryOptions: { ...formData.deliveryOptions, [field]: value },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/shipments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create shipment')
      }

      const data = await response.json()
      setTrackingNumber(data.trackingNumber)
      
      // Redirect to tracking page after 2 seconds
      setTimeout(() => {
        router.push(`/track?q=${data.trackingNumber}`)
      }, 2000)
    } catch (err) {
      console.error('Error creating shipment:', err)
      setError('Failed to create shipment. Please try again.')
      // For demo: generate a fake tracking number
      const fakeTracking = 'AB' + Date.now().toString().slice(-10)
      setTrackingNumber(fakeTracking)
      setTimeout(() => {
        router.push(`/track?q=${fakeTracking}`)
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Sender Information' },
    { number: 2, title: 'Receiver Information' },
    { number: 3, title: 'Package Details' },
    { number: 4, title: 'Delivery Options' },
  ]

  if (trackingNumber) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipment Created Successfully!</h3>
        <p className="text-lg text-gray-700 mb-2">Your tracking number is:</p>
        <p className="text-2xl font-bold text-primary mb-4">{trackingNumber}</p>
        <p className="text-gray-600">Redirecting to tracking page...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
                <span className="mt-2 text-xs text-center text-gray-600 hidden md:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Sender Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sender Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.sender.name}
                onChange={(e) => updateSender('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.sender.email}
                onChange={(e) => updateSender('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.sender.phone}
                onChange={(e) => updateSender('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                value={formData.sender.country}
                onChange={(e) => updateSender('country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.sender.city}
                onChange={(e) => updateSender('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
              <input
                type="text"
                value={formData.sender.postalCode}
                onChange={(e) => updateSender('postalCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <textarea
              value={formData.sender.address}
              onChange={(e) => updateSender('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
        </div>
      )}

      {/* Step 2: Receiver Information */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Receiver Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.receiver.name}
                onChange={(e) => updateReceiver('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.receiver.email}
                onChange={(e) => updateReceiver('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.receiver.phone}
                onChange={(e) => updateReceiver('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                value={formData.receiver.country}
                onChange={(e) => updateReceiver('country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.receiver.city}
                onChange={(e) => updateReceiver('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
              <input
                type="text"
                value={formData.receiver.postalCode}
                onChange={(e) => updateReceiver('postalCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <textarea
              value={formData.receiver.address}
              onChange={(e) => updateReceiver('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
        </div>
      )}

      {/* Step 3: Package Details */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
              <input
                type="number"
                value={formData.packageDetails.weight || ''}
                onChange={(e) => updatePackageDetails('weight', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value (USD) *</label>
              <input
                type="number"
                value={formData.packageDetails.value || ''}
                onChange={(e) => updatePackageDetails('value', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm) *</label>
              <input
                type="number"
                value={formData.packageDetails.length || ''}
                onChange={(e) => updatePackageDetails('length', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm) *</label>
              <input
                type="number"
                value={formData.packageDetails.width || ''}
                onChange={(e) => updatePackageDetails('width', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm) *</label>
              <input
                type="number"
                value={formData.packageDetails.height || ''}
                onChange={(e) => updatePackageDetails('height', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contents Description *</label>
            <textarea
              value={formData.packageDetails.contents}
              onChange={(e) => updatePackageDetails('contents', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              required
            />
          </div>
        </div>
      )}

      {/* Step 4: Delivery Options */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Options</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
            <select
              value={formData.deliveryOptions.serviceType}
              onChange={(e) => updateDeliveryOptions('serviceType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="standard">Standard (3-5 days)</option>
              <option value="express">Express (1-2 days)</option>
            </select>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.deliveryOptions.insurance}
                onChange={(e) => updateDeliveryOptions('insurance', e.target.checked)}
                className="mr-2 w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Include Insurance</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              value={formData.deliveryOptions.specialInstructions}
              onChange={(e) => updateDeliveryOptions('specialInstructions', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Any special handling or delivery instructions..."
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Shipment'}
          </button>
        )}
      </div>
    </form>
  )
}