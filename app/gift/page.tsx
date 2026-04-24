"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Footer } from "@/components/Footer";
import { Gift, Heart, Sparkles, Check, ArrowRight, Loader2, Mail, Copy, CheckCircle2, Ticket, X } from "lucide-react";
import Link from "next/link";

/* Shake animation for coupon errors */
const shakeVariants = {
  shake: {
    x: [0, -8, 8, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
};

const GIFT_TIERS = [
  {
    id: "standard",
    name: "Standard Gift",
    price: 799,
    originalPrice: 1299,
    features: ["See who's coming (Guest List)", "Up to 5 photos", "Background music", "48h editing window"],
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600"
  },
  {
    id: "premium",
    name: "Premium Gift",
    price: 999,
    originalPrice: 1999,
    features: ["Magic Interactive Envelope", "Up to 10 photos", "Lifetime access", "Priority Helper"],
    color: "from-amber-400 to-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    text: "text-rose-600",
    popular: true
  }
];

export default function GiftPage() {
  const [selectedTier, setSelectedTier] = useState(GIFT_TIERS[1]);
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"details" | "success">("details");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const validateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    setCouponData(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.coupon.tierRestriction && data.coupon.tierRestriction !== selectedTier.id) {
          setCouponError(`This coupon is only valid for the ${data.coupon.tierRestriction} plan.`);
          setShakeKey((k) => k + 1);
          return;
        }
        setCouponData(data.coupon);
      } else {
        setCouponError(data.error || "Invalid coupon code");
        setShakeKey((k) => k + 1);
      }
    } catch {
      setCouponError("Something went wrong");
      setShakeKey((k) => k + 1);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateFinalPrice = (originalPrice: number) => {
    if (!couponData) return originalPrice;
    if (couponData.discountType === "percentage")
      return Math.round(originalPrice * (1 - couponData.discountValue / 100));
    return Math.max(0, originalPrice - couponData.discountValue);
  };

  const finalPrice = calculateFinalPrice(selectedTier.price);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    if (!recipientEmail) {
      alert("Please enter a recipient email");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Razorpay Order
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tierSlug: selectedTier.id,
          couponPrice: finalPrice
        }),
      });
      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      if (finalPrice === 0) {
        // Free gift! Bypass Razorpay
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bypassPayment: true,
            invitationData: {
              isGift: true,
              tier: selectedTier.id,
              userEmail: recipientEmail,
              senderName: senderName,
              paidAmount: 0,
              couponId: couponData?.id
            }
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          setGeneratedCode(result.giftCode);
          setStep("success");
        }
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DNvites Gift",
        description: `Gift: ${selectedTier.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              invitationData: {
                isGift: true,
                tier: selectedTier.id,
                userEmail: recipientEmail,
                senderName: senderName,
                paidAmount: finalPrice,
                couponId: couponData?.id
              }
            }),
          });
          
          const result = await verifyRes.json();
          if (result.success) {
            setGeneratedCode(result.giftCode);
            setStep("success");
          } else {
            alert("Payment verification failed");
          }
          setIsSubmitting(false);
        },
        prefill: {
          email: recipientEmail,
        },
        theme: {
          color: "#F43F8F",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the payment");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <DNvitesLogo />
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-500">Back Home</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {step === "details" ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              {/* Left Side: Info & Tiers */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[#F43F8F] text-xs font-bold uppercase tracking-wider mb-4">
                    <Gift className="w-3.5 h-3.5" /> Gift an Invitation
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                    Give the gift of a <br />
                    <span className="italic gradient-text">Perfect Wedding</span>
                  </h1>
                  <p className="text-slate-500 mt-4 text-lg">
                    Purchase a gift code for a friend or family member. They can use it to create their dream invitation for free!
                  </p>
                </div>

                <div className="grid gap-4">
                  {GIFT_TIERS.map((tier) => (
                    <motion.div
                      key={tier.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTier(tier)}
                      className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                        selectedTier.id === tier.id 
                        ? `${tier.border} ${tier.bg} shadow-lg ring-2 ring-[#F43F8F]/10` 
                        : "border-white bg-white shadow-sm hover:border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className={`font-bold text-xl ${selectedTier.id === tier.id ? tier.text : "text-slate-900"}`}>
                            {tier.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-slate-900">₹{tier.price}</span>
                            <span className="text-sm text-slate-400 line-through">₹{tier.originalPrice}</span>
                          </div>
                        </div>
                        {selectedTier.id === tier.id && (
                          <div className="w-6 h-6 rounded-full bg-[#F43F8F] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className={`w-1.5 h-1.5 rounded-full ${selectedTier.id === tier.id ? "bg-[#F43F8F]" : "bg-slate-300"}`} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side: Form */}
              <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-24">
                <div className={`h-32 bg-linear-to-br ${selectedTier.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                    <Gift className="w-40 h-40 text-white" />
                  </div>
                  <div className="absolute bottom-6 left-8 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">You are gifting</p>
                    <p className="text-2xl font-serif">{selectedTier.name}</p>
                  </div>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-600">From (Your Name)</Label>
                    <Input 
                      placeholder="e.g. Rahul" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="rounded-xl border-slate-200 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600">Recipient's Email</Label>
                    <Input 
                      type="email"
                      placeholder="Where should we send the gift?" 
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="rounded-xl border-slate-200 h-12"
                    />
                    <p className="text-[10px] text-slate-400">
                      We'll send the gift code instantly to this email address after payment.
                    </p>
                  </div>

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    <Label className="text-slate-600 flex items-center gap-2">
                      <Ticket className="w-4 h-4" /> Have a coupon?
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="rounded-xl border-slate-200 h-11 pr-10 uppercase"
                          disabled={!!couponData}
                        />
                        {couponData && (
                          <button
                            onClick={() => { setCouponData(null); setCouponCode(""); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={validateCoupon}
                        disabled={isValidatingCoupon || !!couponData || !couponCode}
                        className="h-11 rounded-xl px-4 border-slate-200 hover:bg-slate-50"
                      >
                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {couponError && (
                        <motion.p
                          key={shakeKey}
                          variants={shakeVariants}
                          animate="shake"
                          className="text-xs text-rose-500 font-medium ml-1"
                        >
                          {couponError}
                        </motion.p>
                      )}
                      {couponData && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-green-600 font-medium ml-1 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> 
                          Applied! You saved {couponData.discountType === 'percentage' ? `${couponData.discountValue}%` : `₹${couponData.discountValue}`}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex flex-col gap-1 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Plan Price</span>
                        <span className="text-slate-900 font-medium">₹{selectedTier.price}</span>
                      </div>
                      {couponData && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-600">Discount</span>
                          <span className="text-green-600 font-medium">
                            -₹{selectedTier.price - finalPrice}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                        <span className="text-slate-900 font-bold">Total to Pay</span>
                        <span className="text-3xl font-bold text-slate-900">₹{finalPrice}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handlePayment}
                      disabled={isSubmitting}
                      className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 text-lg font-bold group"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <span className="flex items-center gap-2">
                          {finalPrice === 0 ? "Get Free Gift" : "Pay & Send Gift"} 
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden text-center p-12">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-serif text-slate-900 mb-2">Gift Sent Successfully!</h2>
                <p className="text-slate-500 mb-8">
                  We've emailed the gift code to <strong>{recipientEmail}</strong>. <br />
                  You can also copy the code below and send it manually.
                </p>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 mb-8 relative group">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Gift Coupon Code</p>
                  <p className="text-4xl font-bold text-slate-900 font-mono tracking-wider">{generatedCode}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="mt-4 text-[#F43F8F] hover:bg-rose-50 font-bold"
                  >
                    {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Code</>}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button variant="outline" className="rounded-full px-8">Back to Home</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="bg-[#F43F8F] hover:bg-[#d82a75] text-white rounded-full px-8">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
