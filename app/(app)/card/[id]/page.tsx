import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CardPreviewClient } from './card-preview-client'

interface CardPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ theme?: string }>
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: dump } = await supabase
    .from('monthly_dumps')
    .select('card_title, narrative, month_year')
    .eq('id', id)
    .single()

  const title = dump?.card_title ?? 'My Monthly Dump'
  const description = dump?.narrative ?? 'A cinematic monthly life recap.'
  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://dumpd.app'}/api/og/${id}`

  return {
    title: `${title} | Dumpd`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: dump, error } = await supabase
    .from('monthly_dumps')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !dump) {
    notFound()
  }

  const [year, month] = dump.month_year.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  const monthStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <CardPreviewClient
      dumpId={id}
      posterUrl={dump.generated_card_url ?? ''}
      squareUrl={dump.card_square_url ?? ''}
      cardTitle={dump.card_title ?? 'My Monthly Dump'}
      narrative={dump.narrative ?? ''}
      initialTheme={(dump.theme as 'noir' | 'neon' | 'vintage') ?? 'noir'}
      month={monthStr}
    />
  )
}
