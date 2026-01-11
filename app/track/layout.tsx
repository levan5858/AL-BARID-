import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Shipment - Al Barid Logistics',
  description: 'Track your shipment with Al Barid Logistics. Enter your tracking number to view real-time status and location.',
}

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}