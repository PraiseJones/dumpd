'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, Mail } from 'lucide-react'

interface SignInFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function SignInForm({ onSuccess, redirectTo = '/' }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState<'google' | 'apple' | 'magic' | null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dumpd.app'

  const handleGoogle = async () => {
    setIsLoading('google')
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
    if (error) {
      setError(error.message)
      setIsLoading(null)
    }
  }

  const handleApple = async () => {
    setIsLoading('apple')
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
    if (error) {
      setError(error.message)
      setIsLoading(null)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading('magic')
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(null)
    } else {
      setMagicSent(true)
      setIsLoading(null)
    }
  }

  if (magicSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-4"
      >
        <div className="text-4xl">📬</div>
        <h3 className="font-clash text-xl font-bold text-dumpd-white">Check your inbox</h3>
        <p className="text-dumpd-muted text-sm">
          We sent a magic link to <strong>{email}</strong>. Click it to sign in.
        </p>
        <button
          onClick={() => { setMagicSent(false); setEmail('') }}
          className="text-dumpd-subtle text-xs hover:text-dumpd-muted transition-colors"
        >
          Use a different email
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Social auth */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoogle}
          disabled={!!isLoading}
          className="w-full gap-3"
        >
          {isLoading === 'google' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleApple}
          disabled={!!isLoading}
          className="w-full gap-3"
        >
          {isLoading === 'apple' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
          )}
          Continue with Apple
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-dumpd-border" />
        <span className="text-dumpd-subtle text-xs">or</span>
        <div className="flex-1 h-px bg-dumpd-border" />
      </div>

      {/* Magic link */}
      <form onSubmit={handleMagicLink} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full bg-dumpd-surface border border-dumpd-border rounded-xl px-4 py-3 text-dumpd-white placeholder:text-dumpd-subtle text-base focus:outline-none focus:border-dumpd-violet focus:ring-1 focus:ring-dumpd-violet/30 transition-colors"
        />
        <Button
          type="submit"
          variant="ghost"
          size="lg"
          disabled={!!isLoading || !email.trim()}
          className="w-full gap-2 border border-dumpd-border hover:border-dumpd-violet/50"
        >
          {isLoading === 'magic' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Mail size={18} />
          )}
          Send magic link
        </Button>
      </form>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <p className="text-dumpd-subtle text-xs text-center">
        No spam. No passwords. Just your monthly cards.
      </p>
    </div>
  )
}
