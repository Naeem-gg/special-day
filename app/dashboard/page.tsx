"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CloudinaryUpload from "@/components/dashboard/CloudinaryUpload";
import Link from "next/link";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Footer } from "@/components/Footer";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Loader2, Sparkles, Heart, Plus, Trash2, Ticket, Eye, Lock } from "lucide-react";
import { TEMPLATES, TIER_TEMPLATES } from "@/components/templates/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

/* Shake animation for coupon errors */
const shakeVariants = {
  shake: {
    x: [0, -8, 8, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Dashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tiers, setTiers] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // ── Payment Status ──────────────────
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [paymentMessage, setPaymentMessage] = useState("");

  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    date: "",
    venue: "",
    slug: "",
    musicUrl: "",
    tier: "basic",
    template: "rose-gold",
    events: [{ name: "", time: "", location: "", description: "" }],
    gallery: [] as { url: string; publicId: string }[],
  });

  useEffect(() => {
    fetch("/api/tiers")
      .then((res) => res.json())
      .then(setTiers)
      .catch((err) => console.error("Failed to fetch tiers:", err));
  }, []);

  const handleAddEvent = () => {
    setFormData({
      ...formData,
      events: [...formData.events, { name: "", time: "", location: "", description: "" }],
    });
  };

  const handleRemoveEvent = (index: number) => {
    setFormData({ ...formData, events: formData.events.filter((_, i) => i !== index) });
  };

  const updateEvent = (index: number, field: string, value: string) => {
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData({ ...formData, events: newEvents });
  };

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
        setCouponData(data.coupon);
      } else {
        setCouponError(data.error || "Hmm, that code doesn't seem right. Try again!");
        setShakeKey((k) => k + 1);
      }
    } catch {
      setCouponError("Something went wrong. Please try again.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const selectedTier = tiers.find((t) => t.slug === formData.tier);
    const originalPrice = selectedTier?.price || 0;
    const finalPrice = calculateFinalPrice(originalPrice);

    try {
      // 1. Create a Razorpay Order
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tierSlug: formData.tier, 
          couponPrice: finalPrice 
        }),
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      console.log("Initiating Razorpay Checkout:", {
        orderId: orderData.orderId,
        amount: orderData.amount,
        keyExists: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        keyPrefix: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").substring(0, 8)
      });

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Razorpay Key ID is missing on the client. Please check your .env.local and restart the server.");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use explicitly
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DNvites",
        description: `Wedding Invitation - ${selectedTier?.name} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment and Save Invitation
          setPaymentStatus("verifying");
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                invitationData: {
                  ...formData,
                  couponId: couponData?.id,
                  discountApplied: originalPrice - finalPrice,
                  paidAmount: finalPrice,
                }
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setPaymentStatus("success");
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#F43F8F", "#D4AF37", "#FFFFFF"]
              });
              setTimeout(() => {
                window.location.href = `/invite/${formData.slug}`;
              }, 3000);
            } else {
              setPaymentStatus("error");
              setPaymentMessage(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setPaymentStatus("error");
            setPaymentMessage("Something went wrong during verification.");
          }
        },
        prefill: {
          name: formData.brideName + " & " + formData.groomName,
          email: "", // Optonal: Add user email if collected
          contact: "",
        },
        theme: {
          color: "#F43F8F",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        setPaymentStatus("error");
        setPaymentMessage(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (error: any) {
      setPaymentStatus("error");
      setPaymentMessage(error.message || "Oops! Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/50 via-white to-amber-50/30">
      {/* ── Status Overlay ───────────────── */}
      <AnimatePresence>
        {paymentStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl border border-rose-100"
            >
              <AnimatePresence mode="wait">
                {paymentStatus === "verifying" && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="relative w-24 h-24 mx-auto">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-rose-200 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-[#F43F8F] animate-spin" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-gray-900">Finalising Your Invite...</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We're just perfecting the magic. Please don't close this window! ✨
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-gray-900">Yay! It's Live! 🥂</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Your beautiful invitation has been created successfully. Redirecting you to see it now...
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentStatus === "error" && (
                  <motion.div
                    key="error"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-12 h-12 text-rose-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-gray-900">Oops, Something Went Wrong</h3>
                      <p className="text-rose-600/80 text-sm leading-relaxed font-medium">
                        {paymentMessage}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setPaymentStatus("idle")}
                      className="rounded-full bg-gray-900 text-white hover:bg-black px-8"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Razorpay Script */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 glass border-b border-rose-100/60 px-6 h-16 flex items-center justify-between"
      >
        <DNvitesLogo />
        <div className="flex gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#F43F8F]">
              Admin
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-rose-200 hover:border-[#F43F8F] hover:text-[#F43F8F]">
              ← Back Home
            </Button>
          </Link>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-3 pb-4"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-4xl"
          >
            💍
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
            Build Your <span className="gradient-text">Dream Invitation</span>
          </h1>
          <p className="text-muted-foreground">Fill in a few details below and your invite will be ready to share!</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Template Picker ──────────────── */}
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="border-0 shadow-xl shadow-rose-100/40 rounded-3xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-rose-50 to-amber-50 border-b border-rose-100">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Choose Your Invitation Design
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  All templates are available to preview free. Your chosen plan unlocks specific templates.
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {TEMPLATES.map((tmpl) => {
                    const availableForTier = TIER_TEMPLATES[formData.tier]?.includes(tmpl.slug);
                    const isSelected = formData.template === tmpl.slug;
                    return (
                      <motion.div
                        key={tmpl.slug}
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => availableForTier && setFormData({ ...formData, template: tmpl.slug })}
                        className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${isSelected ? "border-[#F43F8F] shadow-lg shadow-rose-200/50" : availableForTier ? "border-gray-100 hover:border-rose-200" : "border-gray-100 opacity-60 cursor-not-allowed"}`}
                      >
                        {/* Gradient thumbnail */}
                        <div className="h-28 relative"
                          style={{ background: `linear-gradient(135deg, ${tmpl.palette[0]}, ${tmpl.palette[1]})` }}>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl">{tmpl.emoji}</span>
                          </div>
                          {!availableForTier && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                              <div className="flex flex-col items-center gap-1 text-white/90 text-center px-2">
                                <Lock className="w-4 h-4" />
                                <span className="text-[10px] font-sans font-bold capitalize">{tmpl.tier} plan</span>
                              </div>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F43F8F] flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-white">
                          <p className="font-serif text-sm text-gray-900 truncate">{tmpl.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] font-sans uppercase tracking-wider text-gray-400 capitalize">{tmpl.tier}</span>
                            <a
                              href={`/preview?template=${tmpl.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-0.5"
                              style={{ color: "#F43F8F" }}>
                              <Eye className="w-3 h-3" />Try
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Wedding Details ─────────────── */}
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="border-0 shadow-xl shadow-rose-100/40 rounded-3xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-rose-50 to-amber-50 border-b border-rose-100">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <Heart className="w-5 h-5 text-[#F43F8F] fill-[#F43F8F]" />
                  Tell Us About Your Love
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="brideName" className="text-sm font-semibold text-gray-700">
                      Partner 1 Name 👰
                    </Label>
                    <Input
                      id="brideName"
                      placeholder="e.g. Ayesha"
                      value={formData.brideName}
                      onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                      required
                      className="border-rose-200 focus:border-[#F43F8F] focus:ring-[#F43F8F]/20 transition-all rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomName" className="text-sm font-semibold text-gray-700">
                      Partner 2 Name 🤵
                    </Label>
                    <Input
                      id="groomName"
                      placeholder="e.g. Abdullah"
                      value={formData.groomName}
                      onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                      required
                      className="border-rose-200 focus:border-[#F43F8F] focus:ring-[#F43F8F]/20 transition-all rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                      Date & Time of Your Wedding 📅
                    </Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">
                      Your Invitation Link 🔗
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm shrink-0">/invite/</span>
                      <Input
                        id="slug"
                        placeholder="ahmed-and-ayesha"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })
                        }
                        required
                        className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-11"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">This is the link you'll share with guests.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-sm font-semibold text-gray-700">
                    Venue Details 📍
                  </Label>
                  <Input
                    id="venue"
                    placeholder="e.g. Grand Ballroom, Karachi"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                    className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="musicUrl" className="text-sm font-semibold text-gray-700">
                    Background Music (optional) 🎵
                  </Label>
                  <Input
                    id="musicUrl"
                    placeholder="Paste a link to your favourite song"
                    value={formData.musicUrl}
                    onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })}
                    className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your guests will hear this song when they open the invite. 🎶
                  </p>
                </div>

                {/* Plan selection */}
                <div className="space-y-4 pt-4 border-t border-rose-100">
                  <Label className="text-base font-semibold">Choose Your Gift Package 🎀</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tiers.length > 0 ? (
                      tiers.map((tier) => {
                        const originalPrice = tier.price;
                        const finalPrice = calculateFinalPrice(originalPrice);
                        const hasDiscount = originalPrice !== finalPrice;
                        const isSelected = formData.tier === tier.slug;
                        return (
                          <motion.div
                            key={tier.id}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, tier: tier.slug })}
                            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${isSelected
                              ? "border-[#F43F8F] bg-linear-to-br from-rose-50 to-amber-50 shadow-lg shadow-rose-200/50"
                              : "border-gray-100 bg-white hover:border-rose-200"
                              }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="tier-selected"
                                className="absolute inset-0 bg-linear-to-br from-[#F43F8F]/5 to-[#D4AF37]/5 rounded-2xl"
                              />
                            )}
                            <div className="flex justify-between items-start mb-3 relative z-10">
                              <span className="font-bold text-sm text-gray-900">{tier.name}</span>
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <CheckCircle2 className="w-5 h-5 text-[#F43F8F]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="flex flex-col relative z-10">
                              {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                              )}
                              <p className="text-2xl font-serif text-gray-900">₹{finalPrice}</p>
                              {hasDiscount && (
                                <span className="text-xs text-green-600 font-semibold">🎉 Discount applied!</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="col-span-3 py-10 text-center">
                        <div className="skeleton h-6 w-48 mx-auto mb-3" />
                        <div className="skeleton h-4 w-32 mx-auto" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Discount code */}
                <div className="pt-4 border-t border-rose-100 space-y-3">
                  <Label className="text-base font-semibold">Got a Discount Code? 🏷️</Label>
                  <motion.div
                    key={shakeKey}
                    variants={shakeVariants}
                    animate={couponError ? "shake" : ""}
                    className="flex gap-2"
                  >
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="ENTER YOUR CODE"
                        className="pl-9 uppercase font-mono border-rose-200 focus:border-[#F43F8F] rounded-xl h-11"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                      />
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={validateCoupon}
                      disabled={isValidatingCoupon || !couponCode}
                      className="px-5 py-2 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-rose-300/30"
                    >
                      {isValidatingCoupon ? "Checking…" : "Use Code"}
                    </motion.button>
                  </motion.div>
                  <AnimatePresence>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-red-500 font-medium flex items-center gap-1"
                      >
                        ❌ {couponError}
                      </motion.p>
                    )}
                    {couponData && (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs text-green-600 font-medium flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Woohoo! Code applied — you get{" "}
                        {couponData.discountType === "percentage"
                          ? `${couponData.discountValue}%`
                          : `₹${couponData.discountValue}`}{" "}
                        off! 🎉
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Special Moments Schedule ────── */}
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="border-0 shadow-xl shadow-rose-100/40 rounded-3xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-rose-50 to-amber-50 border-b border-rose-100 flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Your Special Moments Schedule
                </CardTitle>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddEvent}
                  className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 rounded-xl text-sm font-semibold text-[#F43F8F] hover:bg-rose-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </motion.button>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <AnimatePresence>
                  {formData.events.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
                      className="p-6 bg-linear-to-br from-rose-50/40 to-amber-50/20 rounded-2xl relative border border-rose-100 group"
                    >
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2, color: "#EF4444" }}
                        onClick={() => handleRemoveEvent(index)}
                        className="absolute top-4 right-4 text-gray-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#F43F8F] mb-4">
                        Event {index + 1}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-gray-600">What's the event called?</Label>
                          <Input
                            placeholder="e.g. Nikah, Walima, Mehndi"
                            value={event.name}
                            onChange={(e) => updateEvent(index, "name", e.target.value)}
                            required
                            className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-gray-600">What time does it start?</Label>
                          <Input
                            placeholder="e.g. 7:00 PM"
                            value={event.time}
                            onChange={(e) => updateEvent(index, "time", e.target.value)}
                            required
                            className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-10"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-xs font-semibold text-gray-600">Where is it happening?</Label>
                          <Input
                            placeholder="e.g. The Grand Hall, 2nd Floor"
                            value={event.location}
                            onChange={(e) => updateEvent(index, "location", e.target.value)}
                            required
                            className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-10"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Your Photo Album ─────────────── */}
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="border-0 shadow-xl shadow-rose-100/40 rounded-3xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-rose-50 to-amber-50 border-b border-rose-100">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  📸 Your Photo Album
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your favourite pictures — they'll show up in a beautiful gallery for your guests!
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <CloudinaryUpload
                  images={formData.gallery}
                  onUpload={(url, publicId) =>
                    setFormData({ ...formData, gallery: [...formData.gallery, { url, publicId }] })
                  }
                  onRemove={(publicId) =>
                    setFormData({ ...formData, gallery: formData.gallery.filter((img) => img.publicId !== publicId) })
                  }
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Submit ───────────────────────── */}
          <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="flex justify-end pt-2 pb-8">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.04, boxShadow: "0 20px 50px rgba(244,63,143,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-bold text-lg h-14 px-14 rounded-2xl shadow-xl shadow-rose-300/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {/* Shine */}
              {!isSubmitting && (
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              )}
              <span className="relative z-10">
                {isSubmitting ? "✨ Creating your invite…" : "Create My Invitation 💌"}
              </span>
            </motion.button>
          </motion.div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
