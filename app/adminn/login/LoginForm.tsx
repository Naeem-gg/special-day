'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Login successful!')
        window.location.href = '/adminn'
      } else {
        setError(data.error || 'Invalid credentials')
        toast.error(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD] px-4 selection:bg-amber-100">
      <Card className="w-full max-w-md border-none shadow-2xl shadow-amber-100/50 rounded-[2.5rem] overflow-hidden">
        <div className="h-2 w-full bg-linear-to-r from-amber-400 to-[#8E6F3E]" />
        <CardHeader className="space-y-1 text-center pt-10 pb-6">
          <div className="mx-auto bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-500 transform -rotate-6">
            <Lock className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 font-serif tracking-tight">Admin Access</CardTitle>
          <CardDescription className="text-sm font-medium text-gray-400">
            Enter credentials to access DNvites Control
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-amber-500/10 focus:border-amber-300 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-amber-500/10 focus:border-amber-300 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 text-center font-bold bg-red-50 py-2 rounded-lg animate-pulse">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
