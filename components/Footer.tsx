import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/images/logo/logo.svg" 
                alt="Al Barid Logistics Logo" 
                width={40} 
                height={40}
                className="w-10 h-10"
              />
              <h3 className="text-white text-xl font-bold">Al Barid Logistics</h3>
            </div>
            <p className="mb-4">
              Your trusted partner for reliable and efficient logistics solutions across the Middle East. 
              We deliver excellence in every shipment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary-light transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-light transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/create-shipment" className="hover:text-primary-light transition-colors">
                  Create Shipment
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-primary-light transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-light transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>Email: info@albarid.com</li>
              <li>Phone: +971 4 873692</li>
              <li>Hotline: 800-ALBARID</li>
              <li>24/7 Customer Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Al Barid Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}