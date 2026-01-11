// Firestore collection helpers and types
import { getFirestoreDB } from './admin'
import { Firestore, Timestamp as FirestoreTimestamp } from 'firebase-admin/firestore'

export interface Shipment {
  trackingNumber: string
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
    serviceType: 'standard' | 'express'
    insurance: boolean
    specialInstructions: string
  }
  status: 'Ordered' | 'In Transit' | 'Out for Delivery' | 'Delivered'
  currentLocation: string
  estimatedDelivery: FirestoreTimestamp | Date
  createdAt?: FirestoreTimestamp | Date
  updatedAt?: FirestoreTimestamp | Date
}

export interface Tracking {
  trackingNumber: string
  status: 'Ordered' | 'In Transit' | 'Out for Delivery' | 'Delivered'
  location: string
  timestamp: FirestoreTimestamp | Date
  description: string
}

export interface Review {
  customerName: string
  rating: number
  reviewText: string
  location: string
  approved: boolean
  createdAt?: FirestoreTimestamp | Date
}

// Collection helpers
export const collections = {
  shipments: () => getFirestoreDB().collection('shipments'),
  trackings: () => getFirestoreDB().collection('trackings'),
  reviews: () => getFirestoreDB().collection('reviews'),
}

// Helper to convert Firestore Timestamp to Date
export function convertTimestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp)
  }
  return new Date()
}

// Helper to convert Date to Firestore Timestamp
export function convertDateToTimestamp(date: Date | FirestoreTimestamp): FirestoreTimestamp {
  if (date instanceof FirestoreTimestamp) {
    return date
  }
  return FirestoreTimestamp.fromDate(date instanceof Date ? date : new Date(date))
}