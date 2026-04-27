'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { DNvitesLogo } from '@/components/branding/DNvitesLogo'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/50 via-white to-amber-50/30">
      <nav className="fixed top-0 w-full z-50 glass border-b border-rose-100/50 h-16 flex items-center px-6">
        <Link href="/">
          <DNvitesLogo />
        </Link>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              We're here to help you make your special day perfect.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-rose-100/30 border border-rose-50"
            >
              <h2 className="text-2xl font-serif mb-8 text-gray-900">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#F43F8F]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email Us</p>
                    <p className="text-muted-foreground">dnvites@duck.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Our Address</p>
                    <p className="text-muted-foreground">
                      Siddiq Nagar, Hitec city,
                      <br />
                      Hyderabad, Telangana 500081
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#F43F8F]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Social Support</p>
                    <p className="text-muted-foreground">
                      Direct Message us on Instagram for quickest response.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#F43F8F] to-[#c73272] p-10 rounded-[2.5rem] text-white shadow-xl shadow-rose-300/40"
            >
              <h2 className="text-2xl font-serif mb-6">Support Hours</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Our team is available to assist you with any questions about your digital
                invitations.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Monday - Friday</span>
                  <span>10 AM - 7 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Saturday</span>
                  <span>11 AM - 5 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <div className="mt-12 p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                <p className="text-sm italic">
                  "Your joy is our success. We typically respond to all emails within 24 hours."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
