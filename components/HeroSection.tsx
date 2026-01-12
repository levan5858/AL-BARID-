'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TrackingInput from './TrackingInput'

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-background.jpg"
          alt="Middle East Logistics"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Al Barid Logistics
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-100">
            Your Trusted Partner for Reliable Shipping Across the Middle East
          </p>
          <p className="text-lg sm:text-xl mb-12 text-gray-200 max-w-3xl mx-auto">
            Experience excellence in logistics with our comprehensive shipping solutions. 
            Fast, secure, and reliable delivery services at your fingertips.
          </p>
          
          {/* Tracking Input in Hero */}
          <div className="max-w-2xl mx-auto mb-8">
            <TrackingInput />
          </div>
        </div>
      </div>
    </div>
  )
}