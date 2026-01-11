import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: 'Al Barid Logistics - Your Trusted Shipping Partner',
  description: 'Al Barid Logistics provides reliable domestic and international shipping services across the Middle East. Track your shipments, create new shipments, and experience excellence in logistics.',
  keywords: 'logistics, shipping, freight, delivery, Middle East, tracking, Al Barid',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}