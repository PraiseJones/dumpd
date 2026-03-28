import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/share – log share event
export async function POST(request: NextRequest) {
  try {
    const { dumpId, platform } = await request.json()

    if (!dumpId || !platform) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert share event
    await supabase
      .from('share_events')
      .insert({ dump_id: dumpId, platform })

    // Increment share count (best-effort)
    const { data } = await supabase
      .from('monthly_dumps')
      .select('share_count')
      .eq('id', dumpId)
      .single()

    if (data) {
      await supabase
        .from('monthly_dumps')
        .update({ share_count: ((data.share_count as number) ?? 0) + 1 })
        .eq('id', dumpId)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // Non-critical, don't fail the client
  }
}
