'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Archive } from 'lucide-react'
import { AuthModal } from './auth-modal'

interface AuthPromptBannerProps {
  redirectTo?: string
}

export function AuthPromptBanner({ redirectTo }: AuthPromptBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40"
          >
            <div className="bg-dumpd-card border border-dumpd-border rounded-2xl p-4 shadow-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-dumpd-violet/20 shrink-0">
                <Archive size={18} className="text-dumpd-violet-light" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-dumpd-white text-sm font-semibold leading-snug">
                  Save your card forever
                </p>
                <p className="text-dumpd-muted text-xs mt-0.5">
                  Build your monthly archive. Sign up free.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-2 text-dumpd-violet-light text-xs font-medium hover:text-dumpd-violet transition-colors"
                >
                  Sign up →
                </button>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="text-dumpd-subtle hover:text-dumpd-white transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        redirectTo={redirectTo}
      />
    </>
  )
}
