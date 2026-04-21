"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import Link from "next/link";

export default function TermsPage() {
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
            <h1 className="text-4xl font-serif text-gray-900 mb-8">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8 text-right italic">Last updated: April 2026</p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using DNvites (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                DNvites provides digital wedding invitation services, allowing users to create, host, and share personalized event invitations online.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">3. User Responsibility</h2>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for the content you upload, including photos and text. You must ensure you have the rights to use any media uploaded to our platform. We reserve the right to remove any content that violates our community standards or copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are billed on a per-invitation basis based on the selected tier. Payments are processed securely via our payment partners. All fees are in Indian Rupees (₹) unless stated otherwise.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                DNvites retains ownership of the design templates, code, and overall brand identity. Users retain ownership of their personal content uploaded to the invitations.
              </p>
            </section>

            <section className="mb-8 overflow-hidden">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                DNvites shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service.
              </p>
            </section>

            <div className="pt-10 mt-10 border-t border-rose-100 text-center text-sm text-muted-foreground">
              <p>For any questions regarding these terms, contact us at naeemgg@duck.com</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
