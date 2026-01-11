'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Shipment {
  _id: string
  trackingNumber: string
  sender: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
  }
  receiver: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
  }
  status: 'Ordered' | 'In Transit' | 'Out for Delivery' | 'Delivered'
  currentLocation: string
  createdAt?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Create shipment form state
  const [createFormData, setCreateFormData] = useState({
    trackingNumber: '',
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    senderCountry: '',
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverCity: '',
    receiverCountry: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    contents: '',
    serviceType: 'standard' as 'standard' | 'express',
  })

  // Manage shipments state
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'In Transit' as 'Ordered' | 'In Transit' | 'Out for Delivery' | 'Delivered',
    location: '',
    description: '',
  })
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if already authenticated (simple check)
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      if (activeTab === 'manage') {
        fetchShipments()
      }
    }
    setIsLoading(false)
  }, [activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: loginPassword }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        sessionStorage.setItem('admin_authenticated', 'true')
        setIsAuthenticated(true)
        setLoginPassword('')
      } else {
        setLoginError(data.error || 'Invalid password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Login failed. Please try again.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setActiveTab('create')
    setShipments([])
    setSelectedShipment(null)
  }

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/admin/shipments')
      if (response.ok) {
        const data = await response.json()
        setShipments(data)
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    }
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const shipmentData = {
        sender: {
          name: createFormData.senderName,
          email: createFormData.senderEmail,
          phone: createFormData.senderPhone,
          address: createFormData.senderAddress,
          city: createFormData.senderCity,
          country: createFormData.senderCountry,
          postalCode: '',
        },
        receiver: {
          name: createFormData.receiverName,
          email: createFormData.receiverEmail,
          phone: createFormData.receiverPhone,
          address: createFormData.receiverAddress,
          city: createFormData.receiverCity,
          country: createFormData.receiverCountry,
          postalCode: '',
        },
        packageDetails: {
          weight: parseFloat(createFormData.weight),
          length: parseFloat(createFormData.length),
          width: parseFloat(createFormData.width),
          height: parseFloat(createFormData.height),
          contents: createFormData.contents,
          value: 0,
        },
        deliveryOptions: {
          serviceType: createFormData.serviceType,
          insurance: false,
          specialInstructions: '',
        },
      }

      const response = await fetch('/api/shipments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      })

      if (response.ok) {
        alert('Shipment created successfully!')
        // Reset form
        setCreateFormData({
          trackingNumber: '',
          senderName: '',
          senderEmail: '',
          senderPhone: '',
          senderAddress: '',
          senderCity: '',
          senderCountry: '',
          receiverName: '',
          receiverEmail: '',
          receiverPhone: '',
          receiverAddress: '',
          receiverCity: '',
          receiverCountry: '',
          weight: '',
          length: '',
          width: '',
          height: '',
          contents: '',
          serviceType: 'standard',
        })
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create shipment')
      }
    } catch (error) {
      console.error('Error creating shipment:', error)
      alert('Failed to create shipment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedShipment) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/shipments/${selectedShipment.trackingNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdate),
      })

      if (response.ok) {
        alert('Status updated successfully!')
        setShowStatusModal(false)
        setStatusUpdate({
          status: 'In Transit',
          location: '',
          description: '',
        })
        fetchShipments()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Admin Login
              </h1>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                {loginError && (
                  <div className="text-red-600 text-sm">{loginError}</div>
                )}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-primary-dark text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Shipment
            </button>
            <button
              onClick={() => {
                setActiveTab('manage')
                fetchShipments()
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'manage'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Shipments
            </button>
          </div>

          {/* Create Shipment Tab */}
          {activeTab === 'create' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Shipment</h2>
              <form onSubmit={handleCreateShipment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sender Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Sender Information</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={createFormData.senderName}
                      onChange={(e) => setCreateFormData({ ...createFormData, senderName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={createFormData.senderEmail}
                      onChange={(e) => setCreateFormData({ ...createFormData, senderEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={createFormData.senderPhone}
                      onChange={(e) => setCreateFormData({ ...createFormData, senderPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={createFormData.senderCity}
                      onChange={(e) => setCreateFormData({ ...createFormData, senderCity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      value={createFormData.senderCountry}
                      onChange={(e) => setCreateFormData({ ...createFormData, senderCountry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      value={createFormData.senderAddress}
                      onChange={(e) => setCreateFormData({ ...createFormData, senderAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Receiver Information */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Receiver Information</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={createFormData.receiverName}
                      onChange={(e) => setCreateFormData({ ...createFormData, receiverName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={createFormData.receiverEmail}
                      onChange={(e) => setCreateFormData({ ...createFormData, receiverEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={createFormData.receiverPhone}
                      onChange={(e) => setCreateFormData({ ...createFormData, receiverPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={createFormData.receiverCity}
                      onChange={(e) => setCreateFormData({ ...createFormData, receiverCity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      value={createFormData.receiverCountry}
                      onChange={(e) => setCreateFormData({ ...createFormData, receiverCountry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      value={createFormData.receiverAddress}
                      onChange={(e) => setCreateFormData({ ...createFormData, receiverAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Package Details */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={createFormData.weight}
                      onChange={(e) => setCreateFormData({ ...createFormData, weight: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={createFormData.length}
                      onChange={(e) => setCreateFormData({ ...createFormData, length: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={createFormData.width}
                      onChange={(e) => setCreateFormData({ ...createFormData, width: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={createFormData.height}
                      onChange={(e) => setCreateFormData({ ...createFormData, height: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contents *</label>
                    <input
                      type="text"
                      value={createFormData.contents}
                      onChange={(e) => setCreateFormData({ ...createFormData, contents: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                    <select
                      value={createFormData.serviceType}
                      onChange={(e) => setCreateFormData({ ...createFormData, serviceType: e.target.value as 'standard' | 'express' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Shipment'}
                </button>
              </form>
            </div>
          )}

          {/* Manage Shipments Tab */}
          {activeTab === 'manage' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Shipments</h2>
              
              {shipments.length === 0 ? (
                <p className="text-gray-600">No shipments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receiver
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shipments.map((shipment) => (
                        <tr key={shipment._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {shipment.trackingNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.sender.name}
                            <br />
                            <span className="text-xs">{shipment.sender.city}, {shipment.sender.country}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.receiver.name}
                            <br />
                            <span className="text-xs">{shipment.receiver.city}, {shipment.receiver.country}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              shipment.status === 'Out for Delivery' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.currentLocation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedShipment(shipment)
                                setStatusUpdate({
                                  status: shipment.status,
                                  location: shipment.currentLocation,
                                  description: '',
                                })
                                setShowStatusModal(true)
                              }}
                              className="text-primary hover:text-primary-dark"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Status Update Modal */}
          {showStatusModal && selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Update Status: {selectedShipment.trackingNumber}
                </h3>
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="Ordered">Ordered</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={statusUpdate.location}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={statusUpdate.description}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Status'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowStatusModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
