'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { THEME_LABELS } from '@/lib/card/themes'
import type { Theme } from '@/types/card'

const THEME_COLORS: Record<Theme, string> = {
  noir: '#7c3aed',
  neon: '#00ffff',
  vintage: '#f59e0b',
}

interface ThemeSelectorProps {
  selected: Theme
  onChange: (theme: Theme) => void
  isLoading?: boolean
}

export function ThemeSelector({ selected, onChange, isLoading }: ThemeSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {(Object.keys(THEME_LABELS) as Theme[]).map((theme) => (
        <button
          key={theme}
          onClick={() => onChange(theme)}
          disabled={isLoading}
          className={cn(
            'flex flex-col items-center gap-1.5 group disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title={THEME_LABELS[theme]}
        >
          <div className="relative">
            <motion.div
              className="w-8 h-8 rounded-full border-2 transition-all duration-200"
              style={{
                backgroundColor: THEME_COLORS[theme] + '33',
                borderColor: selected === theme ? THEME_COLORS[theme] : 'transparent',
                boxShadow: selected === theme ? `0 0 12px ${THEME_COLORS[theme]}66` : 'none',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: THEME_COLORS[theme] }}
              />
            </motion.div>
            {selected === theme && (
              <motion.div
                layoutId="theme-ring"
                className="absolute -inset-1 rounded-full border-2"
                style={{ borderColor: THEME_COLORS[theme] }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </div>
          <span
            className={cn(
              'text-xs transition-colors',
              selected === theme ? 'text-dumpd-white' : 'text-dumpd-subtle'
            )}
          >
            {theme === 'noir' ? 'Noir' : theme === 'neon' ? 'Neon' : 'Vintage'}
          </span>
        </button>
      ))}
    </div>
  )
}
