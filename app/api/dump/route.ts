import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/dump – persist quiz answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, month_year, theme, session_id } = body

    if (!answers || !month_year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('monthly_dumps')
      .insert({
        user_id: user?.id ?? null,
        session_id: user ? null : (session_id ?? null),
        month_year,
        answers,
        theme: theme ?? 'noir',
        is_public: true,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Dump insert error:', error)
      return NextResponse.json({ error: 'Failed to save dump' }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('POST /api/dump error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/dump – aggregate count for social proof
export async function GET() {
  try {
    const supabase = await createClient()

    // Get current month count
    const now = new Date()
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const { count, error } = await supabase
      .from('monthly_dumps')
      .select('id', { count: 'exact', head: true })
      .eq('month_year', monthYear)

    if (error) {
      return NextResponse.json({ count: 12457 })
    }

    return NextResponse.json({ count: count ?? 0 }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({ count: 12457 })
  }
}
