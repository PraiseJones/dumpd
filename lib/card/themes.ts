import type { ThemeConfig } from '@/types/card'

export const THEMES: Record<string, ThemeConfig> = {
  noir: {
    background: '#080808',
    gradient1: {
      colors: ['#1a0a3a', '#080808'],
      x: 0.8,
      y: 0.1,
      radius: 0.6,
    },
    gradient2: {
      colors: ['#0a1a2a', '#080808'],
      x: 0.1,
      y: 0.9,
      radius: 0.5,
    },
    accent: '#e2e8f0',
    highlight: '#7c3aed',
    titleColor: '#ffffff',
    subtitleColor: '#a78bfa',
    statBackground: 'rgba(255,255,255,0.04)',
    statBorder: 'rgba(255,255,255,0.08)',
    watermarkColor: 'rgba(255,255,255,0.2)',
    monthColor: 'rgba(167,139,250,0.7)',
    narrativeColor: 'rgba(226,232,240,0.7)',
    grainOpacity: 0.045,
  },
  neon: {
    background: '#050510',
    gradient1: {
      colors: ['#2d0070', '#050510'],
      x: 0.1,
      y: 0.1,
      radius: 0.65,
    },
    gradient2: {
      colors: ['#003a3a', '#050510'],
      x: 0.9,
      y: 0.9,
      radius: 0.55,
    },
    accent: '#00ffff',
    highlight: '#bf00ff',
    titleColor: '#ffffff',
    subtitleColor: '#00ffff',
    statBackground: 'rgba(0,255,255,0.04)',
    statBorder: 'rgba(0,255,255,0.15)',
    watermarkColor: 'rgba(0,255,255,0.3)',
    monthColor: 'rgba(0,255,255,0.6)',
    narrativeColor: 'rgba(200,200,255,0.7)',
    grainOpacity: 0.04,
  },
  vintage: {
    background: '#100a00',
    gradient1: {
      colors: ['#3d1800', '#100a00'],
      x: 0.5,
      y: 0.3,
      radius: 0.7,
    },
    accent: '#f59e0b',
    highlight: '#ef4444',
    titleColor: '#fef3c7',
    subtitleColor: '#f59e0b',
    statBackground: 'rgba(245,158,11,0.06)',
    statBorder: 'rgba(245,158,11,0.18)',
    watermarkColor: 'rgba(245,158,11,0.35)',
    monthColor: 'rgba(245,158,11,0.65)',
    narrativeColor: 'rgba(254,243,199,0.65)',
    grainOpacity: 0.06,
  },
}

export const THEME_LABELS: Record<string, string> = {
  noir: 'Cinematic Noir',
  neon: 'Neon Nostalgia',
  vintage: 'Warm Vintage',
}
