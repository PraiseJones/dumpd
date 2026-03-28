import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { THEMES } from '@/lib/card/themes'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = await createClient()
    const { data: dump } = await supabase
      .from('monthly_dumps')
      .select('card_title, narrative, theme, month_year')
      .eq('id', id)
      .single()

    const themeKey = (dump?.theme as string | null) ?? 'noir'
    const theme = THEMES[themeKey] ?? THEMES.noir
    const title = (dump?.card_title as string | null) ?? 'My Monthly Dump'
    const narrative = (dump?.narrative as string | null) ?? 'A cinematic month.'
    const [year, month] = ((dump?.month_year as string | null) ?? '2026-03').split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    const monthStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: theme.background,
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at 80% 20%, ${theme.gradient1.colors[0]}88, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ color: theme.monthColor, fontSize: '20px', fontWeight: 500, letterSpacing: '0.15em' }}>
              {monthStr.toUpperCase()} · DUMPD
            </span>

            <h1
              style={{
                color: theme.titleColor,
                fontSize: '64px',
                fontWeight: 700,
                lineHeight: 1.1,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                color: theme.narrativeColor,
                fontSize: '24px',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '820px',
              }}
            >
              {narrative}
            </p>

            <span
              style={{
                color: theme.watermarkColor,
                fontSize: '16px',
                marginTop: '12px',
              }}
            >
              Made with Dumpd · dumpd.app
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      }
    )
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#080808',
            color: 'white',
            fontSize: '48px',
            fontWeight: 700,
          }}
        >
          Dumpd – Monthly Life Recap
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
