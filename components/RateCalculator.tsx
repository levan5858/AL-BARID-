'use client'

import { useState, useEffect } from 'react'

interface RateRequest {
  origin: string
  destination: string
  weight: number
  length: number
  width: number
  height: number
  serviceType: string
}

interface RateResponse {
  cost: number
  estimatedDelivery: string
  currency: string
}

export default function RateCalculator() {
  const [formData, setFormData] = useState<RateRequest>({
    origin: '',
    destination: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    serviceType: 'standard',
  })
  const [rate, setRate] = useState<RateResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateRate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setRate(null)

    try {
      const response = await fetch('/api/rates/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate rate')
      }

      const data = await response.json()
      setRate(data)
    } catch (err) {
      console.error('Error calculating rate:', err)
      setError('Failed to calculate rate. Please try again.')
      // Fallback calculation for demo
      const baseRate = 50
      const weightFactor = formData.weight * 2
      const distanceFactor = 30
      const serviceFactor = formData.serviceType === 'express' ? 1.5 : 1
      const volumeFactor = (formData.length * formData.width * formData.height) / 1000 * 0.5
      
      setRate({
        cost: Math.round((baseRate + weightFactor + distanceFactor + volumeFactor) * serviceFactor),
        estimatedDelivery: formData.serviceType === 'express' ? '1-2 days' : '3-5 days',
        currency: 'USD',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Rate Calculator</h3>
      <form onSubmit={calculateRate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
              Origin
            </label>
            <input
              type="text"
              id="origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="City, Country"
              required
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="City, Country"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={formData.weight || ''}
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            min="0.1"
            step="0.1"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
              Length (cm)
            </label>
            <input
              type="number"
              id="length"
              value={formData.length || ''}
              onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
              Width (cm)
            </label>
            <input
              type="number"
              id="width"
              value={formData.width || ''}
              onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              value={formData.height || ''}
              onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <select
            id="serviceType"
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="standard">Standard (3-5 days)</option>
            <option value="express">Express (1-2 days)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Calculating...' : 'Calculate Rate'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {rate && (
        <div className="mt-6 p-6 bg-primary-light bg-opacity-10 border border-primary rounded-lg">
          <h4 className="text-lg font-bold text-gray-900 mb-2">Estimated Rate</h4>
          <div className="text-3xl font-bold text-primary mb-2">
            {rate.currency} {rate.cost.toFixed(2)}
          </div>
          <p className="text-gray-600">
            Estimated Delivery: <span className="font-semibold">{rate.estimatedDelivery}</span>
          </p>
        </div>
      )}
    </div>
  )
}