'use client'

import Image from 'next/image'
import { CheckIcon, LightningIcon, HandshakeIcon, StarIcon } from '@/components/Icons'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Animation variants
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

const timelineItemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

function TimelineItem({ item, index }: { item: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={timelineItemVariants}
      className="relative flex items-start pl-8 md:pl-0"
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-accent rounded-full border-4 border-primary z-10"
      ></motion.div>
      <div className="ml-6 md:ml-0 flex-1">
        <div className={`w-full ${index % 2 === 0 ? 'md:w-1/2 md:pr-8' : 'md:w-1/2 md:ml-auto md:pl-8'} mb-4 md:mb-0`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-primary font-bold text-lg mb-2">{item.year}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  const valuesRef = useRef(null)
  const reasonsRef = useRef(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-50px' })
  const reasonsInView = useInView(reasonsRef, { once: true, margin: '-50px' })

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary-dark to-primary text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-100">
            Delivering Excellence in Logistics Since Our Inception
          </p>
        </div>
      </motion.section>

      {/* Company History Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Our History
          </motion.h2>
          <div className="relative">
            {/* Timeline Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-primary origin-top"
            ></motion.div>
            
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
                <TimelineItem key={index} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section ref={valuesRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Our Core Values
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
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
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4 text-primary">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={reasonsRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={reasonsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Why Choose Al Barid Logistics?
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={reasonsInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
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
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-6 border-l-4 border-primary bg-gray-50 rounded-r-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
