'use client'

import { useEffect, useState } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SliderConfig } from '@/types/quiz'

interface SliderInputProps {
  value: number
  onChange: (value: number) => void
  config: SliderConfig
  disabled?: boolean
}

function getEmoji(value: number, emojis: Record<number, string>): string {
  const keys = Object.keys(emojis).map(Number).sort((a, b) => a - b)
  let closest = keys[0]
  for (const k of keys) {
    if (k <= value) closest = k
  }
  return emojis[closest] ?? '😐'
}

export function SliderInput({ value, onChange, config, disabled }: SliderInputProps) {
  const [prevEmoji, setPrevEmoji] = useState(getEmoji(value, config.emojis))
  const currentEmoji = getEmoji(value, config.emojis)

  useEffect(() => {
    if (currentEmoji !== prevEmoji) {
      setPrevEmoji(currentEmoji)
    }
  }, [currentEmoji, prevEmoji])

  const percentage = ((value - config.min) / (config.max - config.min)) * 100

  return (
    <div className="space-y-6">
      {/* Emoji display */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentEmoji}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-6xl select-none"
          >
            {currentEmoji}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Value display */}
      <div className="text-center">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-clash text-4xl font-bold text-dumpd-white"
        >
          {value}
        </motion.span>
        <span className="text-dumpd-muted text-lg ml-1">/ {config.max}</span>
        {config.unit && (
          <span className="text-dumpd-subtle text-sm ml-2">{config.unit}</span>
        )}
      </div>

      {/* Slider */}
      <div className="px-2">
        <SliderPrimitive.Root
          min={config.min}
          max={config.max}
          step={config.step}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          disabled={disabled}
          className="relative flex items-center select-none touch-none w-full h-10"
        >
          <SliderPrimitive.Track className="bg-dumpd-border relative grow rounded-full h-2">
            <SliderPrimitive.Range
              className="absolute rounded-full h-full"
              style={{
                background: `linear-gradient(to right, #7c3aed, #ec4899)`,
                width: `${percentage}%`,
              }}
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              'block w-6 h-6 bg-white rounded-full shadow-lg',
              'border-2 border-dumpd-violet',
              'focus:outline-none focus:ring-2 focus:ring-dumpd-violet focus:ring-offset-2 focus:ring-offset-dumpd-void',
              'hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
        </SliderPrimitive.Root>

        {/* Labels */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-dumpd-subtle">{config.labels.min}</span>
          <span className="text-xs text-dumpd-subtle">{config.labels.max}</span>
        </div>
      </div>
    </div>
  )
}
