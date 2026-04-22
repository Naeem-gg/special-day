"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Mail, KeyRound, ArrowRight, Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.needsVerification || mode === "register") {
          setStep("otp");
        } else {
          router.push("/account");
        }
      } else {
        setError(data.error || `Failed to ${mode}. Please try again.`);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/account");
      } else {
        setError(data.error || "Invalid code. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/50 via-white to-amber-50/30 flex flex-col">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <DNvitesLogo />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl shadow-rose-100/40 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80">
            <CardHeader className="text-center space-y-2 pb-6 pt-10">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {step === "otp" ? <KeyRound className="w-8 h-8 text-[#F43F8F]" /> : <Mail className="w-8 h-8 text-[#F43F8F]" />}
              </div>
              <CardTitle className="text-2xl font-serif text-gray-900">
                {step === "otp" ? "Verify Email" : mode === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-base">
                {step === "otp" 
                  ? `We sent a 6-digit code to ${email}`
                  : mode === "login" 
                    ? "Enter your email and password to sign in." 
                    : "Sign up to start creating invitations."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <AnimatePresence mode="wait">
                {step === "auth" ? (
                  <motion.form
                    key="auth-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleAuth}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold text-gray-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pl-10 border-rose-200 focus:border-[#F43F8F] rounded-xl h-12 text-base"
                          />
                        </div>
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-base shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>{mode === "login" ? "Sign In" : "Sign Up"} <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === "login" ? "register" : "login");
                          setError("");
                        }}
                        className="text-sm text-muted-foreground hover:text-gray-900"
                      >
                        {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleVerifyOtp}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="font-semibold text-gray-700">Login Code</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          maxLength={6}
                          className="pl-12 border-rose-200 focus:border-[#F43F8F] rounded-xl h-12 text-center text-xl tracking-[0.5em] font-mono"
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-base shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setStep("auth"); setOtp(""); }}
                      className="w-full text-center text-sm text-muted-foreground hover:text-gray-900 mt-4"
                    >
                      Back
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
