import type { ThemeConfig } from '@/types/card'
import type { Answers } from '@/types/quiz'
import { THEMES } from './themes'
import { generateCardContent, getStatsForCard } from './title-generator'

// Canvas dimensions
const POSTER_W = 1080
const POSTER_H = 1350
const SQUARE_W = 1080
const SQUARE_H = 1080

interface RenderOptions {
  answers: Answers
  theme: string
  month: string
  aspect: '4:5' | '1:1'
}

// Using any for canvas context to avoid napi-rs type conflicts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CanvasLike = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CanvasRenderingContext2DLike = any

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function drawFilmGrain(ctx: CanvasRenderingContext2DLike, w: number, h: number, opacity: number) {
  ctx.save()
  ctx.globalAlpha = opacity

  // Draw random noise dots
  const dotCount = Math.floor(w * h * 0.003)
  for (let i = 0; i < dotCount; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const radius = Math.random() * 1.2
    const brightness = Math.random() * 255
    ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawBackground(ctx: CanvasRenderingContext2DLike, w: number, h: number, theme: ThemeConfig) {
  // Base fill
  ctx.fillStyle = theme.background
  ctx.fillRect(0, 0, w, h)

  // Gradient 1
  const g1 = ctx.createRadialGradient(
    theme.gradient1.x * w,
    theme.gradient1.y * h,
    0,
    theme.gradient1.x * w,
    theme.gradient1.y * h,
    theme.gradient1.radius * Math.max(w, h)
  )
  const [r1, g1c, b1] = hexToRgb(theme.gradient1.colors[0])
  g1.addColorStop(0, `rgba(${r1},${g1c},${b1},0.7)`)
  g1.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, w, h)

  // Gradient 2 (optional)
  if (theme.gradient2) {
    const g2 = ctx.createRadialGradient(
      theme.gradient2.x * w,
      theme.gradient2.y * h,
      0,
      theme.gradient2.x * w,
      theme.gradient2.y * h,
      theme.gradient2.radius * Math.max(w, h)
    )
    const [r2, g2c, b2] = hexToRgb(theme.gradient2.colors[0])
    g2.addColorStop(0, `rgba(${r2},${g2c},${b2},0.55)`)
    g2.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g2
    ctx.fillRect(0, 0, w, h)
  }
}

function wrapText(
  ctx: CanvasRenderingContext2DLike,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
  const words = text.split(' ')
  let line = ''
  let lineCount = 0

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const { width } = ctx.measureText(testLine)

    if (width > maxWidth && line !== '') {
      if (lineCount < maxLines) {
        if (lineCount === maxLines - 1 && i < words.length - 1) {
          // Truncate last line
          const truncated = line.trim() + '…'
          ctx.fillText(truncated, x, y + lineCount * lineHeight)
        } else {
          ctx.fillText(line.trim(), x, y + lineCount * lineHeight)
        }
        lineCount++
        line = words[i] + ' '
      }
    } else {
      line = testLine
    }
  }

  if (lineCount < maxLines && line.trim()) {
    ctx.fillText(line.trim(), x, y + lineCount * lineHeight)
    lineCount++
  }

  return lineCount
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2DLike,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (ctx.roundRect) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
  } else {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0)
    ctx.lineTo(x + w, y + h - r)
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
    ctx.lineTo(x + r, y + h)
    ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
    ctx.lineTo(x, y + r)
    ctx.arc(x + r, y + r, r, Math.PI, -Math.PI / 2)
    ctx.closePath()
  }
}

export async function renderCard(options: RenderOptions): Promise<{ poster: Buffer; square: Buffer }> {
  // Dynamic import to avoid bundling in edge runtime
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createCanvas } = await import('@napi-rs/canvas')

  const { answers, theme: themeName, month } = options
  const theme = THEMES[themeName] ?? THEMES.noir
  const { title, subtitle, narrative } = generateCardContent(answers as Answers, month)
  const stats = getStatsForCard(answers as Answers)

  // Render both aspects
  const [poster, square] = await Promise.all([
    renderSingleCard(createCanvas as CanvasLike, POSTER_W, POSTER_H, theme, { title, subtitle, narrative, stats, month }),
    renderSingleCard(createCanvas as CanvasLike, SQUARE_W, SQUARE_H, theme, { title, subtitle, narrative, stats, month }),
  ])

  return { poster, square }
}

async function renderSingleCard(
  createCanvas: CanvasLike,
  w: number,
  h: number,
  theme: ThemeConfig,
  content: {
    title: string
    subtitle: string
    narrative: string
    stats: ReturnType<typeof getStatsForCard>
    month: string
  }
): Promise<Buffer> {
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')
  const { title, subtitle, narrative, stats, month } = content
  const isSquare = w === h
  const pad = Math.round(w * 0.07)

  // ── 1. Background ──────────────────────────────────────────────
  drawBackground(ctx, w, h, theme)

  // ── 2. Top horizontal line accent ──────────────────────────────
  const [hr, hg, hb] = hexToRgb(theme.highlight)
  const lineGrad = ctx.createLinearGradient(pad, 0, w - pad, 0)
  lineGrad.addColorStop(0, 'rgba(0,0,0,0)')
  lineGrad.addColorStop(0.3, `rgba(${hr},${hg},${hb},0.8)`)
  lineGrad.addColorStop(0.7, `rgba(${hr},${hg},${hb},0.8)`)
  lineGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(pad, pad * 0.9)
  ctx.lineTo(w - pad, pad * 0.9)
  ctx.stroke()

  // ── 3. Month label ─────────────────────────────────────────────
  const monthY = pad * 1.25
  ctx.font = `500 ${Math.round(w * 0.026)}px 'GeneralSans', sans-serif`
  ctx.fillStyle = theme.monthColor
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(month.toUpperCase(), pad, monthY)

  // Dumpd label (right aligned)
  ctx.textAlign = 'right'
  ctx.fillStyle = theme.watermarkColor
  ctx.fillText('DUMPD', w - pad, monthY)
  ctx.textAlign = 'left'

  // ── 4. Title ───────────────────────────────────────────────────
  const titleY = isSquare ? h * 0.22 : h * 0.17
  const titleSize = isSquare ? Math.round(w * 0.075) : Math.round(w * 0.082)

  ctx.font = `700 ${titleSize}px 'ClashDisplay', sans-serif`
  ctx.fillStyle = theme.titleColor
  ctx.textBaseline = 'top'

  // Title shadow for depth
  ctx.shadowColor = theme.highlight + '44'
  ctx.shadowBlur = 40
  wrapText(ctx, title, pad, titleY, w - pad * 2, titleSize * 1.2, 3)
  ctx.shadowBlur = 0

  // ── 5. Subtitle (one-word) ────────────────────────────────────
  const subtitleY = isSquare ? h * 0.4 : h * 0.33
  ctx.font = `600 ${Math.round(w * 0.04)}px 'ClashDisplay', sans-serif`
  ctx.fillStyle = theme.subtitleColor
  ctx.textBaseline = 'top'
  ctx.fillText(subtitle, pad, subtitleY)

  // ── 6. Divider ────────────────────────────────────────────────
  const dividerY = isSquare ? h * 0.46 : h * 0.38
  ctx.strokeStyle = theme.statBorder
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, dividerY)
  ctx.lineTo(w - pad, dividerY)
  ctx.stroke()

  // ── 7. Stats grid ────────────────────────────────────────────
  const statsStartY = dividerY + pad * 0.5
  const cols = 2
  const statW = (w - pad * 2 - pad * 0.5) / cols
  const statH = Math.round(h * 0.08)
  const statGap = Math.round(h * 0.012)
  const displayStats = stats.slice(0, isSquare ? 4 : 6)

  displayStats.forEach((stat, idx) => {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const sx = pad + col * (statW + pad * 0.5)
    const sy = statsStartY + row * (statH + statGap)

    // Stat card background
    ctx.fillStyle = theme.statBackground
    drawRoundedRect(ctx, sx, sy, statW, statH, 12)
    ctx.fill()

    // Stat card border
    ctx.strokeStyle = theme.statBorder
    ctx.lineWidth = 1
    drawRoundedRect(ctx, sx, sy, statW, statH, 12)
    ctx.stroke()

    // Emoji
    const emojiSize = Math.round(statH * 0.38)
    ctx.font = `${emojiSize}px sans-serif`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = theme.accent
    ctx.fillText(stat.emoji, sx + 12, sy + statH / 2)

    // Label
    const labelX = sx + 12 + emojiSize + 8
    ctx.font = `400 ${Math.round(statH * 0.24)}px 'GeneralSans', sans-serif`
    ctx.fillStyle = theme.narrativeColor
    ctx.textBaseline = 'middle'
    ctx.fillText(stat.label, labelX, sy + statH * 0.35)

    // Value
    ctx.font = `700 ${Math.round(statH * 0.3)}px 'GeneralSans', sans-serif`
    ctx.fillStyle = theme.titleColor
    ctx.fillText(stat.value, labelX, sy + statH * 0.68)
  })

  // ── 8. Narrative ──────────────────────────────────────────────
  const statsEndY = statsStartY + Math.ceil(displayStats.length / 2) * (statH + statGap)
  const narrativeY = statsEndY + pad * 0.7
  const narrativeFontSize = Math.round(w * 0.028)

  ctx.font = `400 ${narrativeFontSize}px 'GeneralSans', sans-serif`
  ctx.fillStyle = theme.narrativeColor
  ctx.textBaseline = 'top'
  wrapText(ctx, narrative, pad, narrativeY, w - pad * 2, narrativeFontSize * 1.6, 3)

  // ── 9. Bottom bar ─────────────────────────────────────────────
  const barY = h - pad * 0.8
  ctx.strokeStyle = theme.statBorder
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, barY - 20)
  ctx.lineTo(w - pad, barY - 20)
  ctx.stroke()

  ctx.font = `500 ${Math.round(w * 0.022)}px 'GeneralSans', sans-serif`
  ctx.fillStyle = theme.watermarkColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Made with Dumpd · dumpd.app', w / 2, barY)
  ctx.textAlign = 'left'

  // ── 10. Film grain ────────────────────────────────────────────
  drawFilmGrain(ctx, w, h, theme.grainOpacity)

  return canvas.toBuffer('image/png')
}
