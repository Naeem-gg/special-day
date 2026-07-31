'use client'

import { motion } from 'framer-motion'
import { Footer } from '@/components/Footer'
import { DNvitesLogo } from '@/components/branding/DNvitesLogo'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How does the digital invitation work?',
    answer:
      "Our platform allows you to create beautiful, animated digital wedding invitations in minutes. Simply choose a plan, enter your wedding details, upload your photos, and you'll instantly get a personalized link to share with your guests.",
  },
  {
    question: 'How do guests receive the invitation?',
    answer:
      'You simply share your unique, personalized link (e.g., dnvites.com/invite/your-names) with your guests via WhatsApp, SMS, Instagram, or email. There is no app for them to download, and they can open it instantly on any device.',
  },
  {
    question: 'Can I track RSVPs from my guests?',
    answer:
      'Yes! Silver (Standard) and Gold (Premium) plans include an integrated RSVP system. Guests can RSVP directly through your invitation link, and you can track responses and guest counts in real time from your account dashboard.',
  },
  {
    question: 'Can I add my own background music?',
    answer:
      'Absolutely! Silver and Gold plans allow you to upload an MP3 or paste a direct audio URL, which can play when guests open your invitation.',
  },
  {
    question: 'Is there a limit on how many photos I can upload?',
    answer:
      'Yes. Basic allows 1 photo, Silver (Standard) up to 5, and Gold (Premium) up to 10 photos for a swipeable gallery.',
  },
  {
    question: 'How long does the invitation stay active online?',
    answer:
      'Basic and Silver invitations remain fully active for 1 year from the date of creation. Gold (Premium) invitations include lifetime hosting.',
  },
  {
    question: 'Can I edit the invitation after paying?',
    answer:
      'Yes — if your invitation is linked to an account email, you can edit details (venue, timings, photos, etc.) for up to 48 hours after creation. After that window closes, contact support if you need a temporary unlock.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-[#FFF9F4]">
      <nav className="fixed top-0 w-full z-50 glass border-b border-rose-100/50 h-16 flex items-center px-6">
        <Link href="/">
          <DNvitesLogo />
        </Link>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about your digital invitations.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-rose-100/20 border border-rose-50"
          >
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-rose-50 pb-6 last:border-0 last:pb-0">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <h3 className="text-lg font-serif text-gray-900 group-hover:text-[#F43F8F] transition-colors pr-8">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 text-rose-300"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0,
                      marginTop: openIndex === index ? 16 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="pt-10 mt-10 border-t border-rose-100 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Link href="/contact">
                <button className="bg-rose-50 text-[#F43F8F] px-6 py-2.5 rounded-full font-medium hover:bg-rose-100 transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
