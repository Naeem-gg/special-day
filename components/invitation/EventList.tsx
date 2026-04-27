'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink } from 'lucide-react'

interface Event {
  name: string
  time: string
  location: string
  description?: string
}

export default function EventList({ events }: { events: Event[] }) {
  return (
    <section className="py-28 bg-linear-to-b from-[#FFF9F4] to-white relative overflow-hidden">
      {/* Decorative background circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-rose-100/30 rounded-full pointer-events-none"
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-[#F43F8F] mb-3">
            📅 What's Happening
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Events & Schedule</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-0.5 w-24 bg-linear-to-r from-[#F43F8F] to-[#D4AF37] mx-auto rounded-full"
          />
        </motion.div>

        <div className="space-y-10">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative group"
            >
              {/* Card */}
              <div className="flex flex-col md:flex-row bg-white rounded-[2rem] shadow-lg shadow-rose-100/30 hover:shadow-2xl hover:shadow-rose-200/40 border border-rose-50 overflow-hidden transition-all duration-500">
                {/* Left accent bar */}
                <motion.div
                  className="w-full md:w-2 bg-linear-to-b from-[#F43F8F] to-[#D4AF37] flex-shrink-0"
                  style={{ minHeight: '4px' }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                />

                <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                  {/* Event number badge */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full bg-linear-to-br from-rose-100 to-amber-100 flex items-center justify-center shrink-0 shadow-md"
                  >
                    <span className="text-2xl font-serif text-[#F43F8F] font-bold">
                      {index + 1}
                    </span>
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#F43F8F] mb-2 block">
                      Event {index + 1}
                    </span>
                    <h3 className="text-3xl font-serif text-gray-900 mb-3">{event.name}</h3>
                    {event.description && (
                      <p className="text-gray-500 mb-5 leading-relaxed">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 justify-center md:justify-start">
                      <motion.div
                        whileHover={{ color: '#F43F8F', x: 2 }}
                        className="flex items-center gap-2 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ color: '#F43F8F', x: 2 }}
                        className="flex items-center gap-2 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Map button */}
                  <motion.a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      scale: 1.08,
                      backgroundColor: '#1A0A12',
                      color: '#fff',
                      borderColor: '#1A0A12',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-xs uppercase tracking-widest font-bold text-gray-400 transition-all duration-300 whitespace-nowrap shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    View on Map
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
