'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { TextConfig } from '@/types/quiz'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  config: TextConfig
  disabled?: boolean
}

export function TextInput({ value, onChange, config, disabled }: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const remaining = config.maxLength - value.length
  const isNearLimit = remaining < 50

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder}
        rows={config.rows ?? 3}
        maxLength={config.maxLength}
        disabled={disabled}
        className={cn(
          'w-full bg-dumpd-surface border border-dumpd-border rounded-xl px-4 py-3',
          'text-dumpd-white placeholder:text-dumpd-subtle text-base leading-relaxed',
          'resize-none focus:outline-none focus:border-dumpd-violet focus:ring-1 focus:ring-dumpd-violet/30',
          'transition-colors duration-200 min-h-[80px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      <div className="flex justify-end">
        <span
          className={cn(
            'text-xs transition-colors',
            isNearLimit ? 'text-dumpd-amber' : 'text-dumpd-subtle'
          )}
        >
          {remaining}
        </span>
      </div>
    </div>
  )
}
