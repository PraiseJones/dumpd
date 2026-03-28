'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CardDownloadButtonsProps {
  posterUrl: string
  squareUrl: string
  title: string
}

async function downloadImage(url: string, filename: string) {
  const response = await fetch(url)
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.click()
  URL.revokeObjectURL(objectUrl)
}

export function CardDownloadButtons({ posterUrl, squareUrl, title }: CardDownloadButtonsProps) {
  const [downloading, setDownloading] = useState<'poster' | 'square' | null>(null)
  const [downloaded, setDownloaded] = useState<'poster' | 'square' | null>(null)

  const slugTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)

  const handleDownload = async (type: 'poster' | 'square') => {
    setDownloading(type)
    try {
      const url = type === 'poster' ? posterUrl : squareUrl
      const suffix = type === 'poster' ? '4x5' : '1x1'
      await downloadImage(url, `dumpd-${slugTitle}-${suffix}.png`)
      setDownloaded(type)
      setTimeout(() => setDownloaded(null), 2000)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex gap-3">
      {(['poster', 'square'] as const).map((type) => {
        const isLoading = downloading === type
        const isDone = downloaded === type
        return (
          <motion.div key={type} whileTap={{ scale: 0.96 }}>
            <Button
              variant="outline"
              size="default"
              onClick={() => handleDownload(type)}
              disabled={!!downloading}
              className={cn(
                'gap-2 transition-all',
                isDone && 'border-green-500/50 text-green-400'
              )}
            >
              {isDone ? (
                <Check size={16} />
              ) : isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <Download size={16} />
              )}
              {type === 'poster' ? '4:5' : '1:1'}
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
