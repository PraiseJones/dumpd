'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Sparkles, Share2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Answer 15 questions',
    description: 'Fun, brutally honest questions about your month. Wins, Ls, situationships, meals — all of it.',
    color: 'text-dumpd-violet',
    bg: 'bg-dumpd-violet/10',
    border: 'border-dumpd-violet/20',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Get your cinematic card',
    description: 'We turn your raw answers into a beautiful, movie-poster-style card that actually tells your story.',
    color: 'text-dumpd-pink',
    bg: 'bg-dumpd-pink/10',
    border: 'border-dumpd-pink/20',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Post it. Make them jealous.',
    description: 'Download your card and drop it on Instagram, TikTok, WhatsApp — wherever your audience lives.',
    color: 'text-dumpd-cyan',
    bg: 'bg-dumpd-cyan/10',
    border: 'border-dumpd-cyan/20',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-clash text-4xl md:text-5xl font-bold text-dumpd-white mb-4">
            How it works
          </h2>
          <p className="text-dumpd-muted text-lg max-w-md mx-auto">
            From your chaotic month to a cinematic card in under 3 minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative p-6 rounded-2xl border ${step.border} ${step.bg} group hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${step.bg} border ${step.border} shrink-0`}>
                    <Icon size={22} className={step.color} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${step.color} mb-2 block`}>
                      Step {step.number}
                    </span>
                    <h3 className="font-clash text-xl font-bold text-dumpd-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-dumpd-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-dumpd-border z-10" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
