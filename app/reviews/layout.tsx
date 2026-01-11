import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Reviews - Al Barid Logistics',
  description: 'Read customer reviews and testimonials about Al Barid Logistics. Share your experience with our logistics services.',
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}