'use client'

import HeroSection from '@/components/HeroSection'
import NewsTicker from '@/components/NewsTicker'
import { TruckIcon, LockIcon, PhoneIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      {/* Company Introduction Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Al Barid Logistics
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-primary mx-auto mb-6"
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              With years of experience in the logistics industry, Al Barid Logistics has established 
              itself as a leading provider of shipping and freight services across the Middle East. 
              We combine cutting-edge technology with personalized service to ensure your packages 
              arrive safely and on time, every time.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-4 text-primary"
              >
                <TruckIcon className="w-16 h-16" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Express shipping options available for urgent deliveries across the region
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex justify-center mb-4 text-primary"
              >
                <LockIcon className="w-16 h-16" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Handling</h3>
              <p className="text-gray-600">
                Your packages are handled with care and fully insured for your peace of mind
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="flex justify-center mb-4 text-primary"
              >
                <PhoneIcon className="w-16 h-16" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track your shipments 24/7 with our advanced tracking system
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-primary text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Ready to Ship?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl mb-8 text-gray-100"
          >
            Create a new shipment today and experience the Al Barid difference
          </motion.p>
          <motion.a
            href="/create-shipment"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-accent text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create Shipment Now
          </motion.a>
        </div>
      </motion.section>

      <NewsTicker />
    </>
  )
}
