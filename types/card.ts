export type Theme = 'noir' | 'neon' | 'vintage'
export type CardAspect = '4:5' | '1:1'

export interface CardGenerationRequest {
  dumpId: string
  answers: Record<string, unknown>
  theme: Theme
  month: string
}

export interface GeneratedCard {
  posterUrl: string
  squareUrl: string
  title: string
  narrative: string
}

export interface ThemeConfig {
  background: string
  gradient1: { colors: [string, string]; x: number; y: number; radius: number }
  gradient2?: { colors: [string, string]; x: number; y: number; radius: number }
  accent: string
  highlight: string
  titleColor: string
  subtitleColor: string
  statBackground: string
  statBorder: string
  watermarkColor: string
  monthColor: string
  narrativeColor: string
  grainOpacity: number
}
