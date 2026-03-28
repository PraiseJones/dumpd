'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus } from 'lucide-react'
import { THEME_LABELS } from '@/lib/card/themes'

interface DumpSummary {
  id: string
  month_year: string
  card_title: string | null
  generated_card_url: string | null
  theme: string
  share_count: number
  created_at: string
}

interface ArchiveClientProps {
  dumps: DumpSummary[]
}

function formatMonthYear(monthYear: string): string {
  const [year, month] = monthYear.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function ArchiveClient({ dumps }: ArchiveClientProps) {
  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-clash text-4xl font-bold text-dumpd-white mb-2">My Archive</h1>
        <p className="text-dumpd-muted">Your monthly chapters, collected.</p>
      </motion.div>

      {dumps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20"
        >
          <p className="text-5xl mb-4">🎬</p>
          <h2 className="font-clash text-2xl font-bold text-dumpd-white mb-2">No dumps yet</h2>
          <p className="text-dumpd-muted mb-6">Your first card is waiting to be created.</p>
          <Button asChild size="lg">
            <Link href="/quiz">
              Start your first dump
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {dumps.map((dump, i) => (
              <motion.div
                key={dump.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/card/${dump.id}`} className="block group">
                  <div className="relative rounded-2xl overflow-hidden border border-dumpd-border group-hover:border-dumpd-violet/50 transition-colors"
                    style={{ aspectRatio: '4/5' }}>
                    {dump.generated_card_url ? (
                      <Image
                        src={dump.generated_card_url}
                        alt={dump.card_title ?? 'Monthly dump'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-dumpd-card flex items-center justify-center">
                        <p className="text-dumpd-subtle text-xs">No card</p>
                      </div>
                    )}

                    {/* Overlay info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-white text-xs font-medium">View card →</p>
                    </div>
                  </div>

                  <div className="mt-2 px-1">
                    <p className="text-dumpd-white text-sm font-semibold leading-tight truncate">
                      {dump.card_title ?? formatMonthYear(dump.month_year)}
                    </p>
                    <p className="text-dumpd-subtle text-xs mt-0.5">
                      {formatMonthYear(dump.month_year)} · {THEME_LABELS[dump.theme] ?? dump.theme}
                    </p>
                    {dump.share_count > 0 && (
                      <p className="text-dumpd-violet-light text-xs mt-0.5">
                        {dump.share_count} shares
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* New dump CTA */}
          <div className="text-center pt-4">
            <Button asChild size="lg">
              <Link href="/quiz" className="gap-2">
                <Plus size={18} />
                Dump this month
              </Link>
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
