import { renderCard } from './canvas-renderer'
import type { Answers } from '@/types/quiz'
import type { SupabaseClient } from '@supabase/supabase-js'

interface GenerateCardOptions {
  dumpId: string
  answers: Answers
  theme: string
  month: string
}

interface GeneratedCardUrls {
  posterUrl: string
  squareUrl: string
  title: string
  narrative: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateAndUploadCard(
  options: GenerateCardOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>
): Promise<GeneratedCardUrls> {
  const { dumpId, answers, theme, month } = options

  // 1. Render cards
  const { poster, square } = await renderCard({ answers, theme, month, aspect: '4:5' })

  // 2. Generate title/narrative
  const { generateCardContent } = await import('./title-generator')
  const { title, narrative } = generateCardContent(answers, month)

  const bucket = supabase.storage.from('cards')

  // 3. Upload poster (4:5)
  const posterPath = `${dumpId}/poster-${theme}.png`
  const { error: posterErr } = await bucket.upload(posterPath, poster, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000',
  })
  if (posterErr) throw new Error(`Failed to upload poster: ${JSON.stringify(posterErr)}`)

  // 4. Upload square (1:1)
  const squarePath = `${dumpId}/square-${theme}.png`
  const { error: squareErr } = await bucket.upload(squarePath, square, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000',
  })
  if (squareErr) throw new Error(`Failed to upload square: ${JSON.stringify(squareErr)}`)

  // 5. Get public URLs
  const posterUrl = bucket.getPublicUrl(posterPath).data.publicUrl
  const squareUrl = bucket.getPublicUrl(squarePath).data.publicUrl

  // 6. Update dump row
  const { error: updateErr } = await supabase
    .from('monthly_dumps')
    .update({
      generated_card_url: posterUrl,
      card_square_url: squareUrl,
      card_title: title,
      narrative,
    })
    .eq('id', dumpId)

  if (updateErr) throw new Error(`Failed to update dump: ${JSON.stringify(updateErr)}`)

  return { posterUrl, squareUrl, title, narrative }
}
