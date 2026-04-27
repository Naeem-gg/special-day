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
      'Yes! Our Premium tiers include a fully integrated RSVP system. Guests can RSVP directly through your invitation link, and you can track all responses and guest counts in real-time through your personal dashboard.',
  },
  {
    question: 'Can I add my own background music?',
    answer:
      'Absolutely! Our Silver and Gold plans allow you to provide a link to your favorite song (via YouTube, SoundCloud, or MP3), which will play automatically and set the mood when guests open your invitation.',
  },
  {
    question: 'Is there a limit on how many photos I can upload?',
    answer:
      'The photo limit depends on your chosen tier. The Basic plan allows 1 feature photo, Silver allows up to 5 photos, and our Gold tier allows you to upload up to 10 photos to create a stunning, swipeable gallery.',
  },
  {
    question: 'How long does the invitation stay active online?',
    answer:
      'Every invitation is securely hosted and remains fully active for a full 1 year from the date of creation. Your family and friends can revisit your special moments anytime during this period.',
  },
  {
    question: 'Can I edit the invitation after paying?',
    answer:
      'Yes! If you create a free account before checking out, you can log in to your dashboard anytime to update event timings, venue details, or swap out photos without any extra cost.',
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
