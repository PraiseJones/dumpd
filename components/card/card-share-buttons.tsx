'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Copy, Check, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardShareButtonsProps {
  dumpId: string
  posterUrl: string
  month: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dumpd.app'

const platforms = [
  { id: 'x', label: 'X', emoji: '𝕏' },
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'copy', label: 'Copy link', emoji: null, icon: Copy },
]

async function logShare(dumpId: string, platform: string) {
  try {
    await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dumpId, platform }),
    })
  } catch {}
}

export function CardShareButtons({ dumpId, posterUrl, month }: CardShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const shareUrl = `${APP_URL}/card/${dumpId}`
  const shareText = `my ${month} in one card 🎬`

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleShare = async (platform: string) => {
    logShare(dumpId, platform)

    switch (platform) {
      case 'x':
        window.open(
          `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
        break

      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          '_blank'
        )
        break

      case 'instagram': {
        // Try native share first, fall back to clipboard
        if (navigator.share) {
          try {
            const response = await fetch(posterUrl)
            const blob = await response.blob()
            const file = new File([blob], 'my-dump.png', { type: 'image/png' })
            await navigator.share({ title: 'My Monthly Dump', files: [file] })
            return
          } catch {}
        }
        // Clipboard fallback
        try {
          const response = await fetch(posterUrl)
          const blob = await response.blob()
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          showToast('Image copied! Paste in Instagram Stories')
        } catch {
          showToast('Open Instagram and paste your card')
        }
        break
      }

      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          showToast('Link copied!')
        } catch {
          showToast('Copy failed — try manually')
        }
        break
    }
  }

  const handleNativeShare = async () => {
    if (!navigator.share) return false
    try {
      await navigator.share({
        title: 'My Monthly Dump',
        text: shareText,
        url: shareUrl,
      })
      logShare(dumpId, 'native')
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-3">
      {/* Native share button (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleNativeShare}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-dumpd-violet/20 border border-dumpd-violet/30 text-dumpd-violet-light text-sm font-medium hover:bg-dumpd-violet/30 transition-colors"
        >
          <Share2 size={16} />
          Share card
        </motion.button>
      )}

      {/* Platform buttons */}
      <div className="grid grid-cols-4 gap-2">
        {platforms.map((p) => {
          const Icon = p.icon
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleShare(p.id)}
              className="flex flex-col items-center gap-1 py-3 rounded-xl bg-dumpd-surface border border-dumpd-border hover:border-dumpd-violet/40 transition-colors"
              title={p.label}
            >
              {p.id === 'copy' ? (
                copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  Icon && <Icon size={18} className="text-dumpd-muted" />
                )
              ) : (
                <span className="text-xl">{p.emoji}</span>
              )}
              <span className="text-dumpd-subtle text-[11px]">{p.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Toast */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-sm text-dumpd-muted bg-dumpd-surface rounded-xl py-2 px-4 border border-dumpd-border"
        >
          {toastMsg}
        </motion.div>
      )}
    </div>
  )
}
