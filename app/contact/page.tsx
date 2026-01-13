import ContactForm from '@/components/ContactForm'
import Map from '@/components/Map'
import { PhoneIcon, EmailIcon, ClockIcon } from '@/components/Icons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Al Barid Logistics',
  description: 'Contact Al Barid Logistics for customer support, inquiries, or visit us at one of our office locations across the Middle East.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-100">
            Get in touch with our team - we&apos;re here to help
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4 text-primary">
                <PhoneIcon className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">24/7 Customer Support</p>
              <p className="text-primary font-semibold">800-ALBARID</p>
              <p className="text-gray-600 mt-2">+971 4 873692</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4 text-primary">
                <EmailIcon className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">General Inquiries</p>
              <a href="mailto:info@albarid.com" className="text-primary font-semibold hover:underline">
                info@albarid.com
              </a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4 text-primary">
                <ClockIcon className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-600 mb-2">Sunday - Thursday</p>
              <p className="text-gray-900 font-semibold">9:00 AM - 6:00 PM</p>
              <p className="text-gray-600 text-sm mt-2">Friday - Saturday: Closed</p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ContactForm />
            </div>
            <div>
              <Map />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Customer Service Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Support Channels</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Email: support@albarid.com</li>
                <li>• Phone: 800-ALBARID (Toll Free)</li>
                <li>• Live Chat: Available on website</li>
                <li>• WhatsApp: +971 4 873692</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Response Times</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Email: Within 24 hours</li>
                <li>• Phone: Immediate response</li>
                <li>• Live Chat: Real-time assistance</li>
                <li>• Urgent Matters: Priority handling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}