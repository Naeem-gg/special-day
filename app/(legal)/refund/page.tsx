"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import Link from "next/link";

export default function RefundPage() {
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
            <h1 className="text-4xl font-serif text-gray-900 mb-8">Refund & Cancellation Policy</h1>
            <p className="text-sm text-muted-foreground mb-8 text-right italic">Last updated: April 2026</p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">1. No Refunds</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Due to the digital nature of our service (instant link generation and hosting activation upon payment), we generally **do not offer refunds** once an invitation has been created and the payment has been processed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">2. Cancellation</h2>
              <p className="text-gray-600 leading-relaxed">
                You can choose to delete your invitation or stop sharing the link at any time from your dashboard. However, since the service provided is a "pay-once" model for a set duration (1 year), the fee is non-refundable upon cancellation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">3. Technical Issues</h2>
              <p className="text-gray-600 leading-relaxed">
                If you encounter a technical issue that prevents your invitation from loading or functioning correctly, please contact our support team. We will work to resolve the issue within 48 hours. If the issue cannot be resolved, a partial or full refund may be considered on a case-by-case basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">4. Process for Refunds (If Eligible)</h2>
              <p className="text-gray-600 leading-relaxed">
                In rare cases where a refund is approved, it will be processed through Razorpay and will typically reflect in your original payment method within 5-7 business days.
              </p>
            </section>

            <div className="pt-10 mt-10 border-t border-rose-100 text-center text-sm text-muted-foreground">
              <p>Questions? Contact us at naeemgg@duck.com</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
