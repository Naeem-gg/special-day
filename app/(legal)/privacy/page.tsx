"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F4]">
      <nav className="fixed top-0 w-full z-50 glass border-b border-rose-100/50 h-16 flex items-center px-6">
        <Link href="/">
          <DNvitesLogo />
        </Link>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-3xl bg-white p-12 rounded-[2.5rem] shadow-xl shadow-rose-100/20 border border-rose-50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-rose max-w-none"
          >
            <h1 className="text-4xl font-serif text-gray-900 mb-8">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8 text-right italic">Last updated: April 2026</p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information you provide directly to us when you create an invitation, such as:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Names of the couple</li>
                <li>Wedding date and venue location</li>
                <li>Photos uploaded for the gallery</li>
                <li>Contact email address</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">2. How We Use Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to create and host your digital invitation, process payments, and provide customer support. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">3. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We use industry-standard security measures to protect your information and photos. Photos are stored securely using Cloudinary.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">4. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to improve your experience on our site, such as keeping you logged in to your dashboard.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                We use third-party services like Razorpay for payments and Cloudinary for image hosting. These services have their own privacy policies.
              </p>
            </section>

            <div className="pt-10 mt-10 border-t border-rose-100 text-center text-sm text-muted-foreground">
              <p>For any privacy concerns, please email us at naeemgg@duck.com</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
