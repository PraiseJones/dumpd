'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/store/quiz-store'

const loadingMessages = [
  'Analyzing your chaos…',
  'Detecting main character energy…',
  'Calculating your broke-o-meter…',
  'Crafting your narrative…',
  'Applying cinematic filters…',
  'Adding film grain…',
  'Polishing your arc…',
  'The card is almost ready…',
]

export function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dumpId = searchParams.get('id')

  const { selectedTheme } = useQuizStore()
  const [messageIndex, setMessageIndex] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback(async () => {
    if (!dumpId || isGenerating) return
    setIsGenerating(true)

    try {
      const res = await fetch('/api/card/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dumpId, theme: selectedTheme }),
      })

      if (!res.ok) throw new Error('Generation failed')

      router.push(`/card/${dumpId}`)
    } catch (err) {
      console.error(err)
      setHasError(true)
      setIsGenerating(false)
    }
  }, [dumpId, selectedTheme, router, isGenerating])

  useEffect(() => {
    generate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cycle through loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % loadingMessages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!dumpId) {
    router.push('/quiz')
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-dumpd-void">
      {/* Background pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-dumpd-violet/15 blur-[80px]"
        />
      </div>

      <div className="relative z-10 text-center space-y-10">
        {/* Film reel animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto"
        >
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="40" cy="40" r="36" stroke="#7c3aed" strokeWidth="2" strokeOpacity="0.4" />
            <circle cx="40" cy="40" r="24" stroke="#7c3aed" strokeWidth="2" strokeOpacity="0.6" />
            <circle cx="40" cy="40" r="8" fill="#7c3aed" fillOpacity="0.8" />
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180
              const x = 40 + 30 * Math.cos(rad)
              const y = 40 + 30 * Math.sin(rad)
              return (
                <circle key={deg} cx={x} cy={y} r="4" fill="#7c3aed" fillOpacity="0.5" />
              )
            })}
          </svg>
        </motion.div>

        {/* Loading message */}
        <div className="h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-dumpd-muted text-lg"
            >
              {loadingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-clash text-3xl font-bold text-dumpd-white">
            Creating your card
          </h1>
          <p className="text-dumpd-subtle text-sm mt-2">This takes about 5–10 seconds</p>
        </div>

        {/* Dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-dumpd-violet"
            />
          ))}
        </div>

        {/* Error state */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-red-400">Something went wrong. Please try again.</p>
            <button
              onClick={() => { setHasError(false); setIsGenerating(false); generate() }}
              className="px-6 py-2 rounded-xl bg-dumpd-violet text-white text-sm font-medium hover:bg-violet-500 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
