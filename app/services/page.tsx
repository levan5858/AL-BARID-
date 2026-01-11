import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Al Barid Logistics',
  description: 'Comprehensive logistics services including domestic shipping, international shipping, freight services, express delivery, warehousing, and customs clearance.',
}

export default function ServicesPage() {
  const services = [
    {
      title: 'Domestic Shipping',
      description: 'Fast and reliable city-to-city shipping within the country. Door-to-door delivery with real-time tracking.',
      icon: '🚚',
      features: ['Same-day delivery available', 'Express and standard options', 'Insurance included'],
    },
    {
      title: 'International Shipping',
      description: 'Cross-border shipping services connecting the Middle East with global markets. Customs clearance included.',
      icon: '✈️',
      features: ['Worldwide coverage', 'Customs documentation', 'International tracking'],
    },
    {
      title: 'Freight Services',
      description: 'Bulk cargo and freight transportation for businesses. Full truckload and less-than-truckload options.',
      icon: '📦',
      features: ['Heavy cargo handling', 'Warehouse to warehouse', 'Competitive rates'],
    },
    {
      title: 'Express Delivery',
      description: 'Next-day and urgent delivery services for time-sensitive shipments. Priority handling guaranteed.',
      icon: '⚡',
      features: ['Next-day delivery', 'Priority handling', 'Guaranteed delivery times'],
    },
    {
      title: 'Warehousing Solutions',
      description: 'Secure storage facilities with inventory management. Distribution and fulfillment services available.',
      icon: '🏭',
      features: ['Secure storage', 'Inventory management', 'Distribution services'],
    },
    {
      title: 'Customs Clearance',
      description: 'Expert customs clearance services to ensure smooth cross-border shipments. Documentation assistance.',
      icon: '📋',
      features: ['Documentation support', 'Duty calculation', 'Fast clearance'],
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-100">
            Comprehensive Logistics Solutions for All Your Shipping Needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From domestic deliveries to international freight, we provide end-to-end logistics 
              solutions tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-primary-light p-8 text-center">
                  <div className="text-6xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-gray-700">
                        <span className="text-primary mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/create-shipment"
                    className="mt-6 inline-block w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Create a shipment today and experience our premium logistics services
          </p>
          <a
            href="/create-shipment"
            className="inline-block px-8 py-4 bg-accent text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create Shipment Now
          </a>
        </div>
      </section>
    </>
  )
}