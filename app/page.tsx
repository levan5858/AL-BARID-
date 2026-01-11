import HeroSection from '@/components/HeroSection'
import NewsTicker from '@/components/NewsTicker'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      {/* Company Introduction Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Al Barid Logistics
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              With years of experience in the logistics industry, Al Barid Logistics has established 
              itself as a leading provider of shipping and freight services across the Middle East. 
              We combine cutting-edge technology with personalized service to ensure your packages 
              arrive safely and on time, every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Express shipping options available for urgent deliveries across the region
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Handling</h3>
              <p className="text-gray-600">
                Your packages are handled with care and fully insured for your peace of mind
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track your shipments 24/7 with our advanced tracking system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Ship?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Create a new shipment today and experience the Al Barid difference
          </p>
          <a
            href="/create-shipment"
            className="inline-block px-8 py-4 bg-accent text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create Shipment Now
          </a>
        </div>
      </section>

      <NewsTicker />
    </>
  )
}