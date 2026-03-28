import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/dump/claim – migrate guest dumps to authenticated user
export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find guest dumps for this session
    const { data: guestDumps } = await supabase
      .from('monthly_dumps')
      .select('id')
      .eq('session_id', session_id)
      .is('user_id', null)

    if (!guestDumps || guestDumps.length === 0) {
      return NextResponse.json({ claimed: 0 })
    }

    const ids = guestDumps.map((d) => d.id)

    // Update each to assign user_id
    const { error } = await supabase
      .from('monthly_dumps')
      .update({ user_id: user.id, session_id: null })
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: 'Failed to claim dumps' }, { status: 500 })
    }

    return NextResponse.json({ claimed: ids.length })
  } catch (err) {
    console.error('POST /api/dump/claim error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
