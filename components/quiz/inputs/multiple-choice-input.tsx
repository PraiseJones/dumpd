'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { MultipleChoiceAnswer, MultipleChoiceConfig } from '@/types/quiz'

interface MultipleChoiceInputProps {
  value: MultipleChoiceAnswer
  onChange: (value: MultipleChoiceAnswer) => void
  config: MultipleChoiceConfig
  disabled?: boolean
}

export function MultipleChoiceInput({ value, onChange, config, disabled }: MultipleChoiceInputProps) {
  const [showCustom, setShowCustom] = useState(value.selected === '__custom__')

  const handleSelect = (option: string) => {
    if (option === '__custom__') {
      setShowCustom(true)
      onChange({ selected: '__custom__', custom: value.custom ?? '' })
    } else {
      setShowCustom(false)
      onChange({ selected: option, custom: undefined })
    }
  }

  const handleCustomText = (text: string) => {
    onChange({ selected: '__custom__', custom: text })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        {config.options.map((option) => (
          <motion.button
            key={option}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border-2 text-base transition-all duration-200',
              value.selected === option
                ? 'border-dumpd-violet bg-dumpd-violet/15 text-dumpd-white'
                : 'border-dumpd-border bg-dumpd-surface text-dumpd-muted hover:border-dumpd-violet/40 hover:text-dumpd-white',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {option}
          </motion.button>
        ))}

        {/* Custom option */}
        {config.allowCustom && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('__custom__')}
            disabled={disabled}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border-2 text-base transition-all duration-200',
              value.selected === '__custom__'
                ? 'border-dumpd-amber bg-dumpd-amber/10 text-dumpd-white'
                : 'border-dumpd-border bg-dumpd-surface text-dumpd-muted hover:border-dumpd-amber/40 hover:text-dumpd-white',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            Other…
          </motion.button>
        )}
      </div>

      {/* Custom text field */}
      <AnimatePresence>
        {showCustom && config.allowCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <textarea
              value={value.custom ?? ''}
              onChange={(e) => handleCustomText(e.target.value)}
              placeholder={config.customPlaceholder ?? 'Describe your situation…'}
              rows={2}
              maxLength={150}
              disabled={disabled}
              autoFocus
              className={cn(
                'w-full bg-dumpd-surface border border-dumpd-amber/40 rounded-xl px-4 py-3 mt-1',
                'text-dumpd-white placeholder:text-dumpd-subtle text-base',
                'resize-none focus:outline-none focus:border-dumpd-amber focus:ring-1 focus:ring-dumpd-amber/30',
                'transition-colors duration-200',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
