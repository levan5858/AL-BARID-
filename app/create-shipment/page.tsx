import ShipmentForm from '@/components/ShipmentForm'
import RateCalculator from '@/components/RateCalculator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Shipment - Al Barid Logistics',
  description: 'Create a new shipment with Al Barid Logistics. Fill out the form and get an instant shipping rate calculation.',
}

export default function CreateShipmentPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Create Shipment</h1>
          <p className="text-xl text-gray-100">
            Fill out the form below to create a new shipment
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipment Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ShipmentForm />
            </div>

            {/* Rate Calculator - Takes 1 column */}
            <div className="lg:col-span-1">
              <RateCalculator />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}