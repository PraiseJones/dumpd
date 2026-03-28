'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { YesNoAnswer, YesNoConfig } from '@/types/quiz'

interface YesNoInputProps {
  value: YesNoAnswer
  onChange: (value: YesNoAnswer) => void
  config: YesNoConfig
  disabled?: boolean
}

export function YesNoInput({ value, onChange, config, disabled }: YesNoInputProps) {
  const handleSelect = (selected: boolean) => {
    onChange({ value: selected, followup: selected ? value.followup : undefined })
  }

  const handleFollowup = (text: string) => {
    onChange({ ...value, followup: text })
  }

  return (
    <div className="space-y-4">
      {/* Yes / No buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSelect(true)}
          disabled={disabled}
          className={cn(
            'h-14 rounded-xl border-2 font-semibold text-lg transition-all duration-200 active:scale-95',
            value.value === true
              ? 'border-dumpd-violet bg-dumpd-violet/20 text-dumpd-white'
              : 'border-dumpd-border bg-dumpd-surface text-dumpd-muted hover:border-dumpd-violet/50 hover:text-dumpd-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {config.yesLabel ?? 'Yes'}
        </button>

        <button
          type="button"
          onClick={() => handleSelect(false)}
          disabled={disabled}
          className={cn(
            'h-14 rounded-xl border-2 font-semibold text-lg transition-all duration-200 active:scale-95',
            value.value === false
              ? 'border-dumpd-cyan bg-dumpd-cyan/10 text-dumpd-white'
              : 'border-dumpd-border bg-dumpd-surface text-dumpd-muted hover:border-dumpd-cyan/50 hover:text-dumpd-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {config.noLabel ?? 'No'}
        </button>
      </div>

      {/* Follow-up text field */}
      <AnimatePresence>
        {value.value === true && config.followUpPrompt && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              <label className="text-dumpd-muted text-sm">{config.followUpPrompt}</label>
              <textarea
                value={value.followup ?? ''}
                onChange={(e) => handleFollowup(e.target.value)}
                placeholder="Go on…"
                rows={2}
                maxLength={200}
                disabled={disabled}
                className={cn(
                  'w-full bg-dumpd-surface border border-dumpd-border rounded-xl px-4 py-3',
                  'text-dumpd-white placeholder:text-dumpd-subtle text-base',
                  'resize-none focus:outline-none focus:border-dumpd-violet focus:ring-1 focus:ring-dumpd-violet/30',
                  'transition-colors duration-200',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
