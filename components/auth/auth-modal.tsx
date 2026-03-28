'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SignInForm } from './sign-in-form'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
  title?: string
  description?: string
}

export function AuthModal({
  open,
  onOpenChange,
  redirectTo,
  title = 'Save your card forever',
  description = 'Sign up free to build your monthly archive and revisit every chapter.',
}: AuthModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            {/* Modal */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full z-50"
              >
                <div className="bg-dumpd-card border border-dumpd-border rounded-t-3xl md:rounded-3xl p-6 shadow-2xl">
                  {/* Close button */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Dialog.Title className="font-clash text-2xl font-bold text-dumpd-white">
                        {title}
                      </Dialog.Title>
                      <Dialog.Description className="text-dumpd-muted text-sm mt-1">
                        {description}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close className="text-dumpd-subtle hover:text-dumpd-white transition-colors p-1">
                      <X size={20} />
                    </Dialog.Close>
                  </div>

                  <SignInForm redirectTo={redirectTo} />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
