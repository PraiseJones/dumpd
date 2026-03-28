'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeSelector } from '@/components/card/theme-selector'
import { CardDownloadButtons } from '@/components/card/card-download-buttons'
import { CardShareButtons } from '@/components/card/card-share-buttons'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import type { Theme } from '@/types/card'

interface CardPreviewClientProps {
  dumpId: string
  posterUrl: string
  squareUrl: string
  cardTitle: string
  narrative: string
  initialTheme: Theme
  month: string
}

export function CardPreviewClient({
  dumpId,
  posterUrl: initialPosterUrl,
  squareUrl: initialSquareUrl,
  cardTitle,
  narrative,
  initialTheme,
  month,
}: CardPreviewClientProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [posterUrl, setPosterUrl] = useState(initialPosterUrl)
  const [squareUrl, setSquareUrl] = useState(initialSquareUrl)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  const handleThemeChange = async (newTheme: Theme) => {
    if (newTheme === theme || isRegenerating) return
    setTheme(newTheme)
    setIsRegenerating(true)
    setIsFlipping(true)

    try {
      const res = await fetch('/api/card/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dumpId, theme: newTheme }),
      })

      if (res.ok) {
        const data = await res.json()
        // Wait for flip midpoint before swapping image
        setTimeout(() => {
          setPosterUrl(data.posterUrl)
          setSquareUrl(data.squareUrl)
          setIsFlipping(false)
        }, 300)
      } else {
        setIsFlipping(false)
      }
    } catch {
      setIsFlipping(false)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Home
          </Link>
        </Button>
      </div>

      {/* Month label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-dumpd-violet text-xs font-medium uppercase tracking-widest mb-1">{month}</p>
        <h1 className="font-clash text-2xl font-bold text-dumpd-white">{cardTitle}</h1>
        {narrative && (
          <p className="text-dumpd-muted text-sm mt-2 leading-relaxed max-w-sm mx-auto">{narrative}</p>
        )}
      </motion.div>

      {/* Card image */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 1.11, 0.81, 0.99] }}
        className="relative mb-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme + posterUrl}
            initial={{ rotateY: isFlipping ? 90 : 0, opacity: isFlipping ? 0 : 1 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
            style={{ aspectRatio: '4/5' }}
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={cardTitle}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 512px) 100vw, 512px"
              />
            ) : (
              <div className="absolute inset-0 bg-dumpd-card flex items-center justify-center">
                <p className="text-dumpd-subtle text-sm">Card not available</p>
              </div>
            )}

            {/* Regenerating overlay */}
            {isRegenerating && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={32} className="text-white" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Theme selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <p className="text-center text-dumpd-subtle text-xs mb-3">Pick a theme</p>
        <ThemeSelector selected={theme} onChange={handleThemeChange} isLoading={isRegenerating} />
      </motion.div>

      {/* Download buttons */}
      {posterUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <p className="text-center text-dumpd-subtle text-xs mb-3">Download</p>
          <div className="flex justify-center">
            <CardDownloadButtons
              posterUrl={posterUrl}
              squareUrl={squareUrl}
              title={cardTitle}
            />
          </div>
        </motion.div>
      )}

      {/* Share buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <p className="text-center text-dumpd-subtle text-xs mb-3">Share</p>
        <CardShareButtons dumpId={dumpId} posterUrl={posterUrl} month={month} />
      </motion.div>

      {/* Dump again CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Button variant="ghost" asChild className="text-dumpd-subtle hover:text-dumpd-white">
          <Link href="/quiz">Dump next month →</Link>
        </Button>
      </motion.div>
    </main>
  )
}
