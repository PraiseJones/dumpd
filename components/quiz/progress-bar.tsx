'use client'

import { motion } from 'framer-motion'
import { TOTAL_STEPS } from '@/lib/questions'

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const percentage = Math.min((currentStep / TOTAL_STEPS) * 100, 100)

  return (
    <div className="w-full">
      <div className="h-1 bg-dumpd-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(to right, #7c3aed, #ec4899, #f59e0b)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-dumpd-subtle text-xs">{currentStep} / {TOTAL_STEPS}</span>
        <span className="text-dumpd-subtle text-xs">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
