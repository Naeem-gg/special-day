'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DNvitesLogo } from '@/components/branding/DNvitesLogo'
import { Mail, KeyRound, ArrowRight, Loader2, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<'auth' | 'otp' | 'forgot_password' | 'reset_password'>('auth')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendCount, setResendCount] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.authenticated) {
          router.push('/account')
        }
      } catch (err) {
        console.error('Failed to check session:', err)
      }
    }
    checkSession()
  }, [router])

  const validatePassword = (pass: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(pass)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (mode === 'register' && !validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      )
      setIsLoading(false)
      return
    }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        if (data.needsVerification || mode === 'register') {
          setStep('otp')
        } else {
          router.push('/account')
        }
      } else {
        setError(data.error || `Failed to ${mode}. Please try again.`)
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push('/account')
      } else {
        setError(data.error || 'Invalid code. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendCount >= 1) return

    setIsResending(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('New code sent! Check your inbox.')
        setResendCount((prev) => prev + 1)
        setResendCooldown(60)
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(data.error || 'Failed to resend code.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsResending(true) // Keep resending state or reset
      setIsResending(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(data.message || 'Verification code sent.')
        setOtp('')
        setStep('reset_password')
      } else {
        setError(data.error || 'Failed to send reset code.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validatePassword(newPassword)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      )
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password: newPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push('/account')
      } else {
        setError(data.error || 'Failed to reset password.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }


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
                {step === 'otp' ? (
                  <KeyRound className="w-8 h-8 text-[#F43F8F]" />
                ) : step === 'forgot_password' ? (
                  <Lock className="w-8 h-8 text-[#F43F8F]" />
                ) : step === 'reset_password' ? (
                  <KeyRound className="w-8 h-8 text-[#F43F8F]" />
                ) : (
                  <Mail className="w-8 h-8 text-[#F43F8F]" />
                )}
              </div>
              <CardTitle className="text-2xl font-serif text-gray-900">
                {step === 'otp'
                  ? 'Verify Email'
                  : step === 'forgot_password'
                    ? 'Reset Password'
                    : step === 'reset_password'
                      ? 'Set New Password'
                      : mode === 'login'
                        ? 'Welcome Back'
                        : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-base">
                {step === 'otp'
                  ? `We sent a 6-digit code to ${email}`
                  : step === 'forgot_password'
                    ? 'Enter your email to receive a password reset code.'
                    : step === 'reset_password'
                      ? `We sent a 6-digit reset code to ${email}.`
                      : mode === 'login'
                        ? 'Enter your email and password to sign in.'
                        : 'Sign up to start creating invitations.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <AnimatePresence mode="wait">
                {step === 'auth' ? (
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
                        <Label htmlFor="email" className="font-semibold text-gray-700">
                          Email Address
                        </Label>
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
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="font-semibold text-gray-700">
                            Password
                          </Label>
                          {mode === 'login' && (
                            <button
                              type="button"
                              onClick={() => {
                                setStep('forgot_password')
                                setError('')
                                setMessage('')
                              }}
                              className="text-xs font-semibold text-[#F43F8F] hover:text-[#c73272] transition-colors"
                            >
                              Forgot Password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 border-rose-200 focus:border-[#F43F8F] rounded-xl h-12 text-base"
                          />
                        </div>
                        {mode === 'register' && password.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                              Security Requirements:
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                8+ Characters
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Uppercase
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Lowercase
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Number
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/[@$!%*?&]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/[@$!%*?&]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Special Char
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-base shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {mode === 'login' ? 'Sign In' : 'Sign Up'}{' '}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === 'login' ? 'register' : 'login')
                          setError('')
                        }}
                        className="text-sm text-muted-foreground hover:text-gray-900"
                      >
                        {mode === 'login'
                          ? "Don't have an account? Sign up"
                          : 'Already have an account? Sign in'}
                      </button>
                    </div>
                  </motion.form>
                ) : step === 'otp' ? (
                  <motion.form
                    key="otp-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleVerifyOtp}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="font-semibold text-gray-700">
                        Login Code
                      </Label>
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
                    {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-base shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Verify & Sign In'
                      )}
                    </Button>

                    <div className="text-center mt-2">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending || resendCooldown > 0 || resendCount >= 1}
                        className={`text-sm font-medium transition-colors ${
                          resendCount >= 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : resendCooldown > 0
                              ? 'text-gray-400 cursor-wait'
                              : 'text-[#F43F8F] hover:text-[#c73272]'
                        }`}
                      >
                        {isResending ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" /> Resending...
                          </span>
                        ) : resendCount >= 1 ? (
                          'Resend limit reached'
                        ) : resendCooldown > 0 ? (
                          `Resend in ${resendCooldown}s`
                        ) : (
                          "Didn't receive code? Resend"
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('auth')
                        setOtp('')
                      }}
                      className="w-full text-center text-sm text-muted-foreground hover:text-gray-900 mt-4"
                    >
                      Back
                    </button>
                  </motion.form>
                ) : step === 'forgot_password' ? (
                  <motion.form
                    key="forgot-password-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleForgotPassword}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-rose-200 focus:border-[#F43F8F] rounded-xl h-12 text-base"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-base shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send Reset Code <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('auth')
                        setError('')
                        setMessage('')
                      }}
                      className="w-full text-center text-sm text-muted-foreground hover:text-gray-900 mt-4"
                    >
                      Back to Sign In
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="reset-password-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-otp" className="font-semibold text-gray-700">
                          Reset Code
                        </Label>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="reset-otp"
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

                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="font-semibold text-gray-700">
                          New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="pl-10 border-rose-200 focus:border-[#F43F8F] rounded-xl h-12 text-base"
                          />
                        </div>

                        {newPassword.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                              Security Requirements:
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${newPassword.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                8+ Characters
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Uppercase
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Lowercase
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/\d/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Number
                              </p>
                              <p
                                className={`text-[11px] flex items-center gap-1.5 ${/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${/[@$!%*?&]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}
                                />{' '}
                                Special Char
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    {message && <p className="text-sm text-green-600 font-medium">{message}</p>}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white font-semibold text-base shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all"
                      disabled={isLoading || otp.length !== 6 || !newPassword}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Reset Password & Sign In'
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('forgot_password')
                        setError('')
                        setMessage('')
                      }}
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
  )
}
