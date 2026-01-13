'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
  status: 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception'
  currentLocation: string
  estimatedDelivery?: string
  createdAt?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'reviews'>('create')
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
    status: 'Pending' as 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception',
    location: '',
    description: '',
  })
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditDeliveryModal, setShowEditDeliveryModal] = useState(false)
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null)
  const [deliveryDateUpdate, setDeliveryDateUpdate] = useState({
    estimatedDelivery: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Tracking history edit state
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [shipmentHistory, setShipmentHistory] = useState<any[]>([])
  const [editingHistoryEntry, setEditingHistoryEntry] = useState<any | null>(null)
  const [historyEditForm, setHistoryEditForm] = useState({
    status: 'Pending' as 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception',
    location: '',
    description: '',
    timestamp: '',
  })

  // Reviews management state
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  useEffect(() => {
    // Check if already authenticated (simple check)
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      if (activeTab === 'manage') {
        fetchShipments()
      } else if (activeTab === 'reviews') {
        fetchReviews()
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
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`/api/admin/shipments?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        setShipments(data)
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    }
  }

  const fetchReviews = async () => {
    setIsLoadingReviews(true)
    try {
      const response = await fetch('/api/admin/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const handleApproveReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      })
      if (response.ok) {
        fetchReviews()
        alert('Review approved successfully!')
      } else {
        alert('Failed to approve review')
      }
    } catch (error) {
      console.error('Error approving review:', error)
      alert('Failed to approve review')
    }
  }

  const handleRejectReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to reject this review? It will be deleted.')) {
      return
    }
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchReviews()
        alert('Review rejected and deleted successfully!')
      } else {
        alert('Failed to reject review')
      }
    } catch (error) {
      console.error('Error rejecting review:', error)
      alert('Failed to reject review')
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
        const data = await response.json()
        
        // Optimistically add to list if on manage tab
        if (activeTab === 'manage' && data.shipment) {
          setShipments(prevShipments => [data.shipment, ...prevShipments])
        }
        
        alert('Shipment created successfully!')
        
        // Wait a bit for Firestore to propagate, then refresh
        setTimeout(() => {
          if (activeTab === 'manage') {
            fetchShipments()
          }
        }, 1000) // 1 second delay for Firestore eventual consistency
        
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
        // Optimistically update the local state immediately
        setShipments(prevShipments => 
          prevShipments.map(shipment => 
            shipment.trackingNumber === selectedShipment.trackingNumber
              ? { ...shipment, status: statusUpdate.status, currentLocation: statusUpdate.location }
              : shipment
          )
        )
        
        alert('Status updated successfully!')
        setShowStatusModal(false)
        setStatusUpdate({
          status: 'Pending',
          location: '',
          description: '',
        })
        
        // Wait a bit for Firestore to propagate, then fetch fresh data
        setTimeout(() => {
          fetchShipments()
        }, 500)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update status')
        // Refresh to get correct state if update failed
        fetchShipments()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
      // Refresh to get correct state on error
      fetchShipments()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteShipment = async () => {
    if (!shipmentToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/shipments/${shipmentToDelete.trackingNumber}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Optimistically remove from list
        setShipments(prevShipments => 
          prevShipments.filter(shipment => shipment.trackingNumber !== shipmentToDelete.trackingNumber)
        )
        
        alert('Shipment deleted successfully!')
        setShowDeleteModal(false)
        setShipmentToDelete(null)
        
        // Refresh to ensure consistency
        setTimeout(() => {
          fetchShipments()
        }, 500)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete shipment')
        // Refresh to get correct state if delete failed
        fetchShipments()
      }
    } catch (error) {
      console.error('Error deleting shipment:', error)
      alert('Failed to delete shipment')
      // Refresh to get correct state on error
      fetchShipments()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditDeliveryDate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedShipment) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/shipments/${selectedShipment.trackingNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estimatedDelivery: deliveryDateUpdate.estimatedDelivery,
        }),
      })

      if (response.ok) {
        alert('Estimated delivery date updated successfully!')
        setShowEditDeliveryModal(false)
        setDeliveryDateUpdate({ estimatedDelivery: '' })
        
        // Refresh shipments list
        setTimeout(() => {
          fetchShipments()
        }, 500)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update delivery date')
        fetchShipments()
      }
    } catch (error) {
      console.error('Error updating delivery date:', error)
      alert('Failed to update delivery date')
      fetchShipments()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewHistory = async (shipment: Shipment) => {
    setSelectedShipment(shipment)
    try {
      const response = await fetch(`/api/admin/shipments/${shipment.trackingNumber}`)
      if (response.ok) {
        const data = await response.json()
        setShipmentHistory(data.history || [])
        setShowHistoryModal(true)
      } else {
        alert('Failed to load tracking history')
      }
    } catch (error) {
      console.error('Error fetching history:', error)
      alert('Failed to load tracking history')
    }
  }

  const handleEditHistoryEntry = (entry: any) => {
    setEditingHistoryEntry(entry)
    const date = new Date(entry.timestamp)
    const dateTimeLocal = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    
    setHistoryEditForm({
      status: entry.status,
      location: entry.location,
      description: entry.description || '',
      timestamp: dateTimeLocal,
    })
  }

  const handleSaveHistoryEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHistoryEntry) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/tracking/${editingHistoryEntry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyEditForm),
      })

      if (response.ok) {
        alert('Tracking entry updated successfully!')
        // Refresh history
        if (selectedShipment) {
          await handleViewHistory(selectedShipment)
        }
        setEditingHistoryEntry(null)
        setHistoryEditForm({
          status: 'Pending',
          location: '',
          description: '',
          timestamp: '',
        })
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update tracking entry')
      }
    } catch (error) {
      console.error('Error updating tracking entry:', error)
      alert('Failed to update tracking entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteHistoryEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this tracking entry?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/tracking/${entryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Tracking entry deleted successfully!')
        // Refresh history
        if (selectedShipment) {
          await handleViewHistory(selectedShipment)
        }
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete tracking entry')
      }
    } catch (error) {
      console.error('Error deleting tracking entry:', error)
      alert('Failed to delete tracking entry')
    } finally {
      setIsDeleting(false)
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
    )
  }

  return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-primary-dark text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Image 
                  src="/images/logo/logo.svg" 
                  alt="Al Barid Logistics Logo" 
                  width={40} 
                  height={40}
                  className="w-10 h-10"
                />
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
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
            <button
              onClick={() => {
                setActiveTab('reviews')
                fetchReviews()
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Reviews
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
                              shipment.status === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
                              shipment.status === 'Exception' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shipment.currentLocation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
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
                              <button
                                onClick={() => {
                                  setSelectedShipment(shipment)
                                  const deliveryDate = shipment.estimatedDelivery 
                                    ? new Date(shipment.estimatedDelivery).toISOString().split('T')[0]
                                    : ''
                                  setDeliveryDateUpdate({ estimatedDelivery: deliveryDate })
                                  setShowEditDeliveryModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit Delivery
                              </button>
                              <button
                                onClick={() => handleViewHistory(shipment)}
                                className="text-blue-600 hover:text-blue-800 mr-4"
                              >
                                View History
                              </button>
                              <button
                                onClick={() => {
                                  setShipmentToDelete(shipment)
                                  setShowDeleteModal(true)
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Manage Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Reviews</h2>
              
              {isLoadingReviews ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-600">No reviews found.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{review.customerName}</h3>
                            {review.approved ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                Approved
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                Pending Approval
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{review.location}</p>
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                          </div>
                          <p className="text-gray-700 mb-2">{review.reviewText}</p>
                          <p className="text-xs text-gray-500">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'Unknown date'}
                          </p>
                        </div>
                        {!review.approved && (
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => handleApproveReview(review._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold whitespace-nowrap"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectReview(review._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                      <option value="Pending">Pending</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Exception">Exception</option>
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

          {/* Delete Confirmation Modal */}
          {showDeleteModal && shipmentToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Delete Shipment
                </h3>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete shipment <strong>{shipmentToDelete.trackingNumber}</strong>? 
                  This action cannot be undone and will also delete all associated tracking history.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDeleteShipment}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setShipmentToDelete(null)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Delivery Date Modal */}
          {showEditDeliveryModal && selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Edit Estimated Delivery: {selectedShipment.trackingNumber}
                </h3>
                <form onSubmit={handleEditDeliveryDate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={deliveryDateUpdate.estimatedDelivery}
                      onChange={(e) => setDeliveryDateUpdate({ estimatedDelivery: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                    {selectedShipment.estimatedDelivery && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current: {new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Delivery Date'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditDeliveryModal(false)
                        setDeliveryDateUpdate({ estimatedDelivery: '' })
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tracking History Modal */}
          {showHistoryModal && selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tracking History: {selectedShipment.trackingNumber}
                  </h2>
                  <button
                    onClick={() => {
                      setShowHistoryModal(false)
                      setEditingHistoryEntry(null)
                      setShipmentHistory([])
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* History List */}
                {!editingHistoryEntry && (
                  <div className="space-y-4">
                    {shipmentHistory.length === 0 ? (
                      <p className="text-gray-500">No tracking history available.</p>
                    ) : (
                      shipmentHistory.map((entry, index) => (
                        <div key={entry.id || index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-primary">{entry.status}</h3>
                              <p className="text-gray-600 mt-1">
                                <strong>Location:</strong> {entry.location}
                              </p>
                              <p className="text-gray-600">
                                <strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}
                              </p>
                              {entry.description && (
                                <p className="text-gray-600 mt-1">
                                  <strong>Description:</strong> {entry.description}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditHistoryEntry(entry)}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteHistoryEntry(entry.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Edit History Entry Form */}
                {editingHistoryEntry && (
                  <form onSubmit={handleSaveHistoryEdit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={historyEditForm.status}
                        onChange={(e) => setHistoryEditForm({ ...historyEditForm, status: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Exception">Exception</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={historyEditForm.location}
                        onChange={(e) => setHistoryEditForm({ ...historyEditForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={historyEditForm.timestamp}
                        onChange={(e) => setHistoryEditForm({ ...historyEditForm, timestamp: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={historyEditForm.description}
                        onChange={(e) => setHistoryEditForm({ ...historyEditForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingHistoryEntry(null)
                          setHistoryEditForm({
                            status: 'Pending',
                            location: '',
                            description: '',
                            timestamp: '',
                          })
                        }}
                        className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
  )
}
