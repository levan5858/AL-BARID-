import Image from 'next/image'
import { CheckIcon, LightningIcon, HandshakeIcon, StarIcon } from '@/components/Icons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Al Barid Logistics',
  description: 'Learn about Al Barid Logistics history, values, and why we are the trusted logistics partner across the Middle East.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-100">
            Delivering Excellence in Logistics Since Our Inception
          </p>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our History
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-primary"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {[
                {
                  year: '2010',
                  title: 'Company Founded',
                  description: 'Al Barid Logistics was established with a vision to revolutionize logistics services in the Middle East region.',
                },
                {
                  year: '2015',
                  title: 'Regional Expansion',
                  description: 'Expanded operations across GCC countries, establishing offices in major cities and building a strong network.',
                },
                {
                  year: '2018',
                  title: 'Technology Integration',
                  description: 'Launched advanced tracking system and digital platform, making shipping easier and more transparent for customers.',
                },
                {
                  year: '2020',
                  title: 'International Services',
                  description: 'Extended services to international shipping, connecting the Middle East with global markets.',
                },
                {
                  year: '2024',
                  title: 'Innovation Leader',
                  description: 'Recognized as a leader in logistics innovation, serving thousands of customers with excellence and reliability.',
                },
              ].map((item, index) => (
                <div key={index} className="relative flex items-start pl-8 md:pl-0">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-accent rounded-full border-4 border-primary z-10"></div>
                  <div className="ml-6 md:ml-0 flex-1">
                    <div className={`w-full ${index % 2 === 0 ? 'md:w-1/2 md:pr-8' : 'md:w-1/2 md:ml-auto md:pl-8'} mb-4 md:mb-0`}>
                      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <div className="text-primary font-bold text-lg mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Reliability',
                icon: <CheckIcon className="w-12 h-12" />,
                description: 'We deliver on our promises, ensuring your shipments arrive on time and in perfect condition.',
              },
              {
                title: 'Speed',
                icon: <LightningIcon className="w-12 h-12" />,
                description: 'Express delivery options and efficient routing to get your packages where they need to be, fast.',
              },
              {
                title: 'Trust',
                icon: <HandshakeIcon className="w-12 h-12" />,
                description: 'Building long-term relationships with our customers through transparent communication and honest service.',
              },
              {
                title: 'Excellence',
                icon: <StarIcon className="w-12 h-12" />,
                description: 'Striving for perfection in every aspect of our service, from handling to delivery.',
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Al Barid Logistics?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Extensive Network',
                description: 'Our vast network spans across the Middle East, ensuring comprehensive coverage and reliable delivery.',
              },
              {
                title: 'Advanced Technology',
                description: 'State-of-the-art tracking systems and digital platforms for seamless shipping experience.',
              },
              {
                title: 'Experienced Team',
                description: 'Our dedicated professionals have years of experience in logistics and customer service.',
              },
              {
                title: 'Competitive Pricing',
                description: 'Affordable rates without compromising on quality and service excellence.',
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock customer support to assist you whenever you need help.',
              },
              {
                title: 'Customized Solutions',
                description: 'Tailored shipping solutions to meet your specific business or personal needs.',
              },
            ].map((reason, index) => (
              <div key={index} className="p-6 border-l-4 border-primary bg-gray-50 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}