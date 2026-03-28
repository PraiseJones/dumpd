import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateAndUploadCard } from '@/lib/card/generate'
import type { Answers } from '@/types/quiz'

export const maxDuration = 60

// POST /api/card/generate
export async function POST(request: NextRequest) {
  try {
    const { dumpId, theme } = await request.json()

    if (!dumpId) {
      return NextResponse.json({ error: 'Missing dumpId' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Fetch dump
    const { data: dump, error: fetchErr } = await supabase
      .from('monthly_dumps')
      .select('*')
      .eq('id', dumpId)
      .single()

    if (fetchErr || !dump) {
      return NextResponse.json({ error: 'Dump not found' }, { status: 404 })
    }

    // Format month
    const monthYear: string = dump.month_year
    const [year, monthNum] = monthYear.split('-')
    const date = new Date(Number(year), Number(monthNum) - 1, 1)
    const monthStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Generate and upload
    const result = await generateAndUploadCard(
      {
        dumpId,
        answers: dump.answers as unknown as Answers,
        theme: (theme ?? dump.theme ?? 'noir') as string,
        month: monthStr,
      },
      supabase
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error('POST /api/card/generate error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Card generation failed' },
      { status: 500 }
    )
  }
}
