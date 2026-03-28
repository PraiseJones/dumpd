'use client'

import { motion } from 'framer-motion'

// Example card data — placeholder until real cards are available
const exampleCards = [
  { title: 'MARCH 2026', subtitle: 'Broke But Unbothered', energy: '7/10', word: 'Chaotic', color: 'from-violet-900/80 to-black' },
  { title: 'FEB 2026', subtitle: 'The Healing Arc (Again)', energy: '6/10', word: 'Tender', color: 'from-pink-900/80 to-black' },
  { title: 'JAN 2026', subtitle: 'New Year Same Chaos', energy: '8/10', word: 'Unhinged', color: 'from-cyan-900/80 to-black' },
  { title: 'DEC 2025', subtitle: 'Silent But Deadly', energy: '9/10', word: 'Blessed', color: 'from-amber-900/80 to-black' },
  { title: 'NOV 2025', subtitle: 'Main Character Energy', energy: '10/10', word: 'Iconic', color: 'from-emerald-900/80 to-black' },
  { title: 'OCT 2025', subtitle: 'The Situationship Chronicles', energy: '5/10', word: 'Complicated', color: 'from-red-900/80 to-black' },
]

function ExampleCard({ title, subtitle, energy, word, color }: typeof exampleCards[0]) {
  return (
    <div
      className={`shrink-0 w-44 h-56 md:w-52 md:h-64 rounded-2xl bg-gradient-to-b ${color} border border-white/10 p-4 flex flex-col justify-between overflow-hidden relative`}
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 200 200%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22n%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.85%22 numOctaves%3D%223%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div>
        <p className="text-white/50 text-xs font-medium tracking-widest">{title}</p>
        <p className="text-white font-clash font-bold text-sm mt-1 leading-tight">{subtitle}</p>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs">energy</span>
          <span className="text-white text-xs font-bold">{energy}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs">word</span>
          <span className="text-white text-xs font-bold">{word}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-white/20 text-[10px] text-center">Made with Dumpd</p>
        </div>
      </div>
    </div>
  )
}

export function ExampleCardsScroll() {
  const doubled = [...exampleCards, ...exampleCards]

  return (
    <section className="py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-center text-dumpd-subtle text-sm uppercase tracking-widest mb-8">
          Cards dropped this month
        </p>

        {/* Row 1 – left to right */}
        <div className="relative mb-4">
          <div className="flex gap-4 animate-marquee">
            {doubled.map((card, i) => (
              <ExampleCard key={i} {...card} />
            ))}
          </div>
        </div>

        {/* Row 2 – right to left */}
        <div className="relative">
          <div className="flex gap-4 animate-marquee-reverse">
            {[...doubled].reverse().map((card, i) => (
              <ExampleCard key={i} {...card} />
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-dumpd-void to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-dumpd-void to-transparent z-10" />
      </motion.div>
    </section>
  )
}
