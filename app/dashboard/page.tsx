"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { motion, AnimatePresence, Variants, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CloudinaryUpload from "@/components/dashboard/CloudinaryUpload";
import Link from "next/link";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Footer } from "@/components/Footer";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Loader2, Sparkles, Heart, Plus, Trash2, Ticket, Eye, Lock, Info, X } from "lucide-react";
import { TEMPLATES, TIER_TEMPLATES } from "@/components/templates/types";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";

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

import TemplateRouter from "@/components/templates/TemplateRouter";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Optimized Template Card ─────────────────── */
const TemplateCard = ({ tmpl, formData, isSelected, handlePointerDown, handlePointerUpOrLeave, handleTemplateSelect }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  return (
    <motion.div
      ref={ref}
      onPointerDown={(e) => handlePointerDown(tmpl.slug, e)}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      onContextMenu={(e) => e.preventDefault()}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => handleTemplateSelect(tmpl.slug)}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all select-none flex flex-col ${isSelected ? "border-[#F43F8F] shadow-lg shadow-rose-200/50" : "border-gray-100 hover:border-rose-200"}`}
    >
      <div className="h-56 relative w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${tmpl.palette[0]}, ${tmpl.palette[1]})` }}>
        {isInView ? (
          <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{
            width: '375px',
            height: '812px',
            transform: 'translate(-50%, -50%) scale(var(--preview-scale))'
          }}>
            <TemplateRouter
              template={tmpl.slug}
              brideName={formData.brideName || "Ayesha"}
              groomName={formData.groomName || "Abdullah"}
              date={formData.date ? new Date(formData.date) : new Date(Date.now() + 86400000)}
              venue={formData.venue || "Grand Ballroom"}
              events={formData.events[0]?.name ? formData.events : [{ name: "Ceremony", time: "4:00 PM", location: "Main Hall", description: "Vows and Rings" }]}
              gallery={formData.gallery}
              isPreview={true}
              isThumbnail={true}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">{tmpl.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-transparent z-10" />
        {isSelected && (
          <div className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-[#F43F8F] flex items-center justify-center shadow-lg ring-2 ring-white">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-100 z-20 relative">
        <p className="font-serif text-sm text-gray-900 truncate">{tmpl.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-sans uppercase tracking-wider text-gray-400">{tmpl.tier} plan</span>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-0.5" style={{ color: "#F43F8F" }}>
            <Eye className="w-3 h-3" />Hold
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSlug, setEditSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [longPressTemplate, setLongPressTemplate] = useState<string | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [uploadedMusicName, setUploadedMusicName] = useState("");
  const [session, setSession] = useState<{ authenticated: boolean; user?: any } | null>(null);

  // ── Checkout Flow ───────────────────
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "review" | "processing" | "verifying" | "success" | "error">("idle");
  const [paymentMessage, setPaymentMessage] = useState("");

  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    userEmail: "",
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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const brideName = params.get("brideName");
      const groomName = params.get("groomName");
      const dateStr = params.get("dateStr");
      const template = params.get("template");

      if (brideName || groomName || dateStr || template) {
        setFormData((prev) => {
          const newForm = { ...prev };
          if (brideName) newForm.brideName = brideName;
          if (groomName) newForm.groomName = groomName;
          if (dateStr) newForm.date = dateStr;
          if (template) {
            newForm.template = template;
            if (TIER_TEMPLATES.premium?.includes(template)) newForm.tier = "premium";
            else if (TIER_TEMPLATES.standard?.includes(template)) newForm.tier = "standard";
          }
          return newForm;
        });
      }

      const editSlugParam = params.get("edit");
      if (editSlugParam) {
        setIsEditMode(true);
        setEditSlug(editSlugParam);
        fetch(`/api/invitations/${editSlugParam}`)
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) {
              setFormData({
                brideName: data.brideName,
                groomName: data.groomName,
                userEmail: data.userEmail,
                date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
                venue: data.venue,
                slug: data.slug,
                musicUrl: data.musicUrl || "",
                tier: data.tier,
                template: data.template,
                events: data.events || [{ name: "", time: "", location: "", description: "" }],
                gallery: data.gallery || [],
              });
            }
          });
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        if (data.authenticated && data.user?.email) {
          setFormData((prev) => ({ ...prev, userEmail: data.user.email }));
        }
      })
      .catch((err) => console.error("Failed to fetch session:", err));
  }, []);

  useEffect(() => {
    fetch("/api/tiers")
      .then((res) => res.json())
      .then(setTiers)
      .catch((err) => console.error("Failed to fetch tiers:", err));
  }, []);

  useEffect(() => {
    let animationFrame: number;
    if (longPressTemplate) {
      const autoScroll = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += 1;
        }
        animationFrame = requestAnimationFrame(autoScroll);
      };
      animationFrame = requestAnimationFrame(autoScroll);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [longPressTemplate]);

  // ── Auto-generate slug for basic tier ──────────
  useEffect(() => {
    if (formData.tier.toLowerCase() === "basic") {
      const bride = formData.brideName.toLowerCase().trim().replace(/\s+/g, "-");
      const groom = formData.groomName.toLowerCase().trim().replace(/\s+/g, "-");
      if (bride || groom) {
        const base = [bride, groom].filter(Boolean).join("-and-");
        setFormData((prev) => ({ ...prev, slug: base || prev.slug }));
      }
    }
  }, [formData.brideName, formData.groomName, formData.tier]);

  const handlePointerDown = (slug: string, e: React.PointerEvent) => {
    // Only trigger for primary pointer (left click or touch)
    if (e.button !== 0 && e.button !== undefined) return;
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      setLongPressTemplate(slug);
    }, 400); // 400ms long press
  };

  const handlePointerUpOrLeave = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setLongPressTemplate(null);
  };

  const handleTemplateSelect = (slug: string) => {
    const tmpl = TEMPLATES.find((t) => t.slug === slug);
    if (!tmpl) return;
    setFormData({ ...formData, template: slug, tier: tmpl.tier });
  };

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
        if (data.coupon.tierRestriction && data.coupon.tierRestriction !== formData.tier.toLowerCase()) {
          setCouponError(`This coupon is only valid for the ${data.coupon.tierRestriction} plan.`);
          setShakeKey((k) => k + 1);
          return;
        }
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
    if (isEditMode) {
      handleEditSubmit();
      return;
    }
    setCheckoutStep("review");
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${editSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setCheckoutStep("success");
      } else {
        alert(data.error || "Failed to update invitation");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiatePayment = async () => {
    setIsSubmitting(true);
    setCheckoutStep("processing");

    const selectedTier = tiers.find((t) => t.slug.toLowerCase() === formData.tier.toLowerCase() || t.name.toLowerCase() === formData.tier.toLowerCase()) || tiers[0];
    const originalPrice = selectedTier?.price || 0;
    const finalPrice = calculateFinalPrice(originalPrice);

    if (finalPrice === 0) {
      // Free invite! Bypass Razorpay entirely.
      setCheckoutStep("verifying");
      try {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bypassPayment: true,
            invitationData: {
              ...formData,
              couponId: couponData?.id,
              discountApplied: originalPrice,
              paidAmount: 0,
            }
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          setCheckoutStep("success");
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#F43F8F", "#D4AF37", "#FFFFFF"] });
        } else {
          setCheckoutStep("error");
          setPaymentMessage(verifyData.error || "Payment verification failed.");
        }
      } catch (err) {
        setCheckoutStep("error");
        setPaymentMessage("Something went wrong during verification. Please try again.");
      }
      return;
    }

    try {
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierSlug: formData.tier,
          couponCode: couponData ? couponCode : undefined
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
          setCheckoutStep("verifying");
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
              setCheckoutStep("success");
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#F43F8F", "#D4AF37", "#FFFFFF"]
              });
            } else {
              setCheckoutStep("error");
              setPaymentMessage(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setCheckoutStep("error");
            setPaymentMessage("Something went wrong during verification.");
          }
        },
        prefill: {
          name: formData.brideName + " & " + formData.groomName,
          email: formData.userEmail || "", // Added user email
          contact: "",
        },
        theme: {
          color: "#F43F8F",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        setCheckoutStep("error");
        setPaymentMessage(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (error: any) {
      setCheckoutStep("error");
      setPaymentMessage(error.message || "Oops! Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/50 via-white to-amber-50/30">
      {/* ── Status Overlay ───────────────── */}
      <AnimatePresence>
        {checkoutStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 bg-rose-950/20 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="max-w-md w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-rose-100"
            >
              <AnimatePresence mode="wait">
                {checkoutStep === "review" && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-serif text-gray-900">Review Your Order</h3>
                      <p className="text-sm text-muted-foreground">Almost there! Please check your details.</p>
                    </div>

                    <div className="bg-rose-50/50 rounded-2xl p-5 space-y-4 border border-rose-100/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F43F8F]">Template</p>
                          <p className="text-lg font-serif text-gray-900">
                            {TEMPLATES.find(t => t.slug === formData.template)?.name}
                          </p>
                        </div>
                        <div className="px-2 py-1 bg-white rounded-lg border border-rose-100 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                          {formData.tier}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-rose-100/30">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Plan Price</span>
                          <span className="text-gray-900 font-medium">₹{tiers.find(t => t.slug === formData.tier)?.price || 0}</span>
                        </div>

                        {/* Review step coupon application */}
                        {!couponData ? (
                          <div className="pt-2">
                            <motion.div
                              key={`review-coupon-${shakeKey}`}
                              variants={shakeVariants}
                              animate={couponError ? "shake" : ""}
                              className="flex gap-2"
                            >
                              <div className="relative flex-1">
                                <Ticket className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <Input
                                  placeholder="DISCOUNT CODE"
                                  className="pl-8 text-xs uppercase font-mono border-rose-200 focus:border-[#F43F8F] rounded-lg h-9"
                                  value={couponCode}
                                  onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
                                    setCouponError("");
                                  }}
                                />
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  validateCoupon();
                                }}
                                disabled={isValidatingCoupon || !couponCode}
                                className="h-9 px-3 text-xs bg-rose-100 text-[#F43F8F] hover:bg-rose-200 rounded-lg shrink-0"
                              >
                                {isValidatingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                              </Button>
                            </motion.div>
                            {couponError && <p className="text-[10px] text-red-500 mt-1 ml-1">{couponError}</p>}
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm text-green-600 font-medium bg-green-50 p-2 rounded-lg border border-green-100">
                            <div className="flex items-center gap-1.5">
                              <Ticket className="w-3.5 h-3.5" />
                              <span>Code Applied!</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 p-0 text-xs text-green-700 hover:text-green-800 hover:bg-transparent"
                              onClick={() => { setCouponData(null); setCouponCode(""); }}
                            >
                              Remove
                            </Button>
                          </div>
                        )}

                        {couponData && (
                          <div className="flex justify-between text-sm text-green-600 font-medium px-1">
                            <span>Discount ({couponCode})</span>
                            <span>-₹{(tiers.find(t => t.slug === formData.tier)?.price || 0) - calculateFinalPrice(tiers.find(t => t.slug === formData.tier)?.price || 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-rose-100 font-serif">
                          <span className="text-lg text-gray-900">Total Payable</span>
                          <span className="text-2xl text-[#F43F8F]">₹{calculateFinalPrice(tiers.find(t => t.slug === formData.tier)?.price || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {session && !session.authenticated && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
                      >
                        <div className="flex justify-between items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Ordering as Guest</span>
                            </div>
                            <p className="text-[10px] text-amber-700/80 leading-tight">
                              Sign up to edit this later and track RSVPs.
                            </p>
                          </div>
                          <Link href="/login">
                            <Button size="sm" className="h-8 px-3 text-[10px] bg-[#F43F8F] hover:bg-[#d82a75] rounded-lg shadow-sm">
                              Login / Sign Up
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      <Button
                        onClick={initiatePayment}
                        className="w-full h-14 rounded-2xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-bold text-lg shadow-xl shadow-rose-200 group"
                      >
                        <span className="flex items-center gap-2">
                          Confirm & Pay Securely
                          <Lock className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setCheckoutStep("idle")}
                        className="w-full h-12 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      >
                        Back to Editing
                      </Button>
                    </div>

                    <p className="text-[10px] text-center text-gray-400">
                      By proceeding, you agree to our Terms of Service. Payments are secured by 256-bit SSL encryption.
                    </p>
                  </motion.div>
                )}

                {(checkoutStep === "processing" || checkoutStep === "verifying") && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-10 text-center space-y-8"
                  >
                    <div className="relative w-28 h-28 mx-auto">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                          borderRadius: ["30%", "50%", "30%"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-linear-to-br from-rose-100 to-amber-100 opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-[#F43F8F] animate-spin" />
                      </div>
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                      >
                        <Sparkles className="w-6 h-6 text-amber-400" />
                      </motion.div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif text-gray-900">
                        {checkoutStep === "processing" ? "Preparing Payment..." : "Perfecting the Magic..."}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed px-4">
                        {checkoutStep === "processing"
                          ? "Connecting to our secure payment gateway. Please wait a moment."
                          : "We're almost there! Finalising your beautiful invitation with love. ✨"}
                      </p>
                    </div>
                  </motion.div>
                )}

                {checkoutStep === "success" && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-10 text-center space-y-8"
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto"
                      >
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </motion.div>
                      <motion.div
                        animate={{ y: [-10, 10, -10], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-2 text-2xl"
                      >
                        🥂
                      </motion.div>
                      <motion.div
                        animate={{ y: [10, -10, 10], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="absolute top-1/2 -left-6 text-2xl"
                      >
                        ✨
                      </motion.div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-serif text-gray-900">It's Official! 🥂</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Your beautiful invitation is ready to be shared with the world.
                      </p>
                    </div>

                    <div className="pt-4 pb-2 border-t border-rose-50">
                      <TestimonialForm 
                        initialName={`${formData.brideName} & ${formData.groomName}`}
                        initialEmail={formData.userEmail}
                      />
                    </div>

                    <div className="pt-4">
                      <Link href={`/invite/${formData.slug}`}>
                        <Button className="w-full bg-gray-900 text-white rounded-xl h-12 font-bold">
                          View Your Invitation Now →
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {checkoutStep === "error" && (
                  <motion.div
                    key="error"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-10 text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-12 h-12 text-rose-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif text-gray-900">Payment Failed</h3>
                      <p className="text-rose-600/80 text-sm leading-relaxed font-medium px-4">
                        {paymentMessage || "Something went wrong. Please check your connection and try again."}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setCheckoutStep("review")}
                        className="w-full h-14 rounded-2xl bg-gray-900 text-white hover:bg-black font-bold"
                      >
                        Retry Payment
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setCheckoutStep("idle")}
                        className="w-full h-12 text-gray-500"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Long Press Preview Overlay ───────────────── */}
      <AnimatePresence>
        {longPressTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center select-none touch-none"
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
          >
            <p className="text-white/60 text-sm font-sans mb-4 tracking-widest uppercase animate-pulse">Release to stop previewing</p>
            <div
              ref={scrollRef}
              className="w-[min(90vw,400px)] h-[min(85vh,750px)] bg-white rounded-[2.5rem] overflow-x-hidden overflow-y-auto shadow-2xl pointer-events-none relative"
            >
              <div className="absolute inset-0 origin-top pointer-events-none" style={{ transform: "scale(1)" }}>
                <TemplateRouter
                  template={longPressTemplate}
                  brideName={formData.brideName || "Ayesha"}
                  groomName={formData.groomName || "Abdullah"}
                  date={formData.date ? new Date(formData.date) : new Date(Date.now() + 86400000)}
                  venue={formData.venue || "Grand Ballroom"}
                  events={formData.events[0]?.name ? formData.events : [{ name: "Ceremony", time: "4:00 PM", location: "Main Hall", description: "Vows and Rings" }]}
                  gallery={formData.gallery}
                  isPreview={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Barrier */}
      {session && !session.authenticated && !isGuest && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="text-center space-y-4 pb-2 pt-8">
                <div className="mx-auto w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[#F43F8F]" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl font-serif">Welcome to DNvites</CardTitle>
                  <CardDescription className="text-base px-2">
                    Log in to save your invitations, edit them later, and manage your RSVPs from a single dashboard.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 pb-8 px-8">
                <Link href="/login" className="block">
                  <Button className="w-full bg-[#F43F8F] hover:bg-[#d82a75] h-12 text-lg rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95">
                    Sign In / Sign Up
                  </Button>
                </Link>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-white px-3 text-gray-400">or stay as a guest</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsGuest(true)}
                  className="w-full h-12 text-gray-500 hover:text-[#F43F8F] hover:bg-rose-50 rounded-xl transition-all"
                >
                  Create Without Account →
                </Button>
                <p className="text-[10px] text-center text-gray-400 px-4 leading-tight">
                  Note: Guest invitations cannot be edited after purchase and do not include the RSVP management dashboard.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

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
            {isEditMode ? (
              <>Update Your <span className="gradient-text">Invitation</span></>
            ) : (
              <>Build Your <span className="gradient-text">Dream Invitation</span></>
            )}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? `Correcting details for ${formData.brideName} & ${formData.groomName}`
              : "Fill in a few details below and your invite will be ready to share!"
            }
          </p>
          {isEditMode && (
            <Button 
              variant="link" 
              className="text-[#F43F8F] p-0 h-auto font-bold text-xs"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              ← Cancel Edit & Create New
            </Button>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Auth Warning/Welcome ─────────── */}
          <AnimatePresence mode="wait">
            {session && !session.authenticated ? (
              <motion.div
                key="guest-warning"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm mb-4">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-amber-900 text-sm">Continue as Guest?</h4>
                    <p className="text-amber-800/80 text-xs leading-relaxed">
                      You can create and buy your invitation without an account. However, **you won't be able to edit it later** or track RSVPs unless you sign up with the same email address.
                      <Link href="/login" className="ml-1 text-[#F43F8F] font-bold hover:underline">
                        Sign in now
                      </Link> to save your progress!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : session?.authenticated ? (
              <motion.div
                key="user-welcome"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3 items-center shadow-sm mb-4">
                  <div className="bg-green-100 p-1.5 rounded-full text-green-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-green-800 text-xs font-medium">
                    Logged in as <span className="font-bold">{session.user.email}</span>. Your invitation will be linked to your account.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
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

                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-sm font-semibold text-gray-700">
                    Your Email Address ✉️
                  </Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="e.g. you@example.com"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    required
                    disabled={session?.authenticated}
                    className={`border-rose-200 focus:border-[#F43F8F] rounded-xl h-11 ${session?.authenticated ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
                  />
                  <p className="text-xs text-muted-foreground">We'll send your purchase receipt and updates here.</p>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">
                        Your Invitation Link 🔗
                      </Label>
                      {formData.tier.toLowerCase() === "basic" && (
                        <div className="group relative">
                          <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-help">
                            <Lock className="w-2.5 h-2.5" /> PREMIUM
                          </span>
                          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Custom links are available on Standard & Premium plans.
                          </div>
                        </div>
                      )}
                    </div>
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
                        readOnly={formData.tier.toLowerCase() === "basic"}
                        className={`border-rose-200 focus:border-[#F43F8F] rounded-xl h-11 transition-all ${formData.tier.toLowerCase() === "basic"
                          ? "bg-gray-50/50 text-gray-400 border-dashed cursor-not-allowed"
                          : "bg-white"
                          }`}
                      />
                    </div>
                    {formData.tier.toLowerCase() === "basic" ? (
                      <p className="text-[10px] text-amber-600/80 font-medium italic">
                        Upgrade to customize your invitation link!
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">This is the link you'll share with guests.</p>
                    )}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="musicUrl" className="text-sm font-semibold text-gray-700">
                      Background Music (optional) 🎵
                    </Label>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed shadow-xl">
                        <p className="font-bold mb-1 text-rose-400">Premium Audio Options</p>
                        <p className="mb-2">You can either upload a file or paste a link.</p>

                        <span className="font-bold">Upload (Recommended):</span>
                        <br />
                        Upload an MP3 from your phone or PC.
                        <br /><br />
                        <span className="font-bold">Direct Link:</span>
                        <br />
                        ✅ <span className="font-mono opacity-80">Cloudinary URL, Dropbox (use ?dl=1)</span>
                        <br />
                        ❌ <span className="text-gray-400">YouTube, Spotify, GDrive (direct link needed)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="musicUrl"
                        placeholder="Paste a link OR upload a file"
                        value={formData.musicUrl}
                        onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })}
                        className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-11 pr-10"
                      />
                      {formData.musicUrl && (
                        <button
                          onClick={() => setFormData({ ...formData, musicUrl: "" })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <label className="shrink-0">
                      <div className={`h-11 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${isUploadingMusic ? "bg-gray-50 border-gray-200" : "border-rose-200 bg-rose-50/30 hover:bg-rose-50 hover:border-rose-300"}`}>
                        {isUploadingMusic ? (
                          <Loader2 className="w-4 h-4 text-[#F43F8F] animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 text-[#F43F8F]" />
                        )}
                        <span className="text-xs font-bold text-gray-700">{isUploadingMusic ? "..." : "Upload MP3"}</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        disabled={isUploadingMusic}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 10 * 1024 * 1024) {
                            alert("File is too large! Please upload a song smaller than 10MB.");
                            return;
                          }

                          setIsUploadingMusic(true);
                          try {
                            const data = new FormData();
                            data.append("file", file);
                            data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

                            const res = await fetch(
                              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                              { method: "POST", body: data }
                            );
                            const result = await res.json();
                            if (result.secure_url) {
                              setFormData({ ...formData, musicUrl: result.secure_url });
                              setUploadedMusicName(file.name);
                            }
                          } catch (err) {
                            console.error("Music upload failed:", err);
                            alert("Failed to upload music. Please try again.");
                          } finally {
                            setIsUploadingMusic(false);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {formData.musicUrl && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-800">
                            {uploadedMusicName ? "Song Uploaded!" : "Audio Link Attached"}
                          </p>
                          <p className="text-[10px] text-green-700/70 truncate max-w-[200px]">
                            {uploadedMusicName || formData.musicUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <audio 
                          src={formData.musicUrl} 
                          className="hidden" 
                          id="preview-audio" 
                          onPlay={() => console.log("Playing preview")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-[10px] font-bold text-green-700 hover:bg-green-100"
                          onClick={() => {
                            const audio = document.getElementById('preview-audio') as HTMLAudioElement;
                            if (audio) {
                              if (audio.paused) audio.play();
                              else audio.pause();
                            }
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setFormData({ ...formData, musicUrl: "" });
                            setUploadedMusicName("");
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Tip: Upload an MP3 from your device for the best guest experience. 🎶
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Template Picker ──────────────── */}
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="border-0 shadow-xl shadow-rose-100/40 rounded-3xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-rose-50 to-amber-50 border-b border-rose-100">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Choose Your Invitation Design
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Hold down on any template to preview it instantly with your details!
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <style>{`
                  :root { --preview-scale: 0.5; }
                  @media (max-width: 640px) {
                    :root { --preview-scale: 0.4; }
                  }
                  @media (min-width: 641px) and (max-width: 1024px) {
                    :root { --preview-scale: 0.45; }
                  }
                `}</style>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {TEMPLATES.map((tmpl) => (
                    <TemplateCard 
                      key={tmpl.slug} 
                      tmpl={tmpl} 
                      formData={formData} 
                      isSelected={formData.template === tmpl.slug}
                      handlePointerDown={handlePointerDown}
                      handlePointerUpOrLeave={handlePointerUpOrLeave}
                      handleTemplateSelect={handleTemplateSelect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Plan & Discount ──────────────── */}
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="border-0 shadow-xl shadow-rose-100/40 rounded-3xl overflow-hidden">
              <CardContent className="pt-6">
                {/* Price Summary */}
                <div className="space-y-4">
                  {tiers.length > 0 ? (() => {
                    const selectedTier = tiers.find((t) => t.slug.toLowerCase() === formData.tier.toLowerCase() || t.name.toLowerCase() === formData.tier.toLowerCase()) || tiers[0];
                    const originalPrice = selectedTier?.price || 0;
                    const finalPrice = calculateFinalPrice(originalPrice);
                    const hasDiscount = originalPrice !== finalPrice;

                    return (
                      <div className="p-5 bg-linear-to-br from-rose-50 to-amber-50 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between">
                        <div>
                          <Label className="text-base font-semibold text-gray-900">Total Price</Label>
                          <p className="text-sm text-muted-foreground mt-0.5 capitalize">For the {formData.tier} plan ({TEMPLATES.find(t => t.slug === formData.template)?.name || "Template"})</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                          )}
                          <p className="text-3xl font-serif text-[#F43F8F]">₹{finalPrice}</p>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="py-4 text-center">
                      <div className="skeleton h-20 w-full rounded-2xl mx-auto" />
                    </div>
                  )}
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

          {!showAdditional ? (
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="flex justify-center">
              <Button
                onClick={() => setShowAdditional(true)}
                type="button"
                variant="outline"
                className="rounded-full border-rose-200 text-[#F43F8F] hover:bg-rose-50 h-12 px-8 font-semibold shadow-sm"
              >
                + Add Additional Events or Photos (Optional)
              </Button>
            </motion.div>
          ) : (
            <>
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
                      maxUploads={formData.tier === "premium" ? 10 : formData.tier === "standard" ? 5 : 1}
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
            </>
          )}

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
