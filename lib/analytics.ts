'use client'

// Unified analytics facade for PostHog + Mixpanel
// Both are initialized lazily to avoid SSR issues

let posthogReady = false
let mixpanelReady = false

export async function initAnalytics() {
  if (typeof window === 'undefined') return

  // PostHog
  const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

  if (phKey && !posthogReady) {
    const posthog = (await import('posthog-js')).default
    posthog.init(phKey, {
      api_host: phHost,
      capture_pageview: false,
      persistence: 'localStorage+cookie',
    })
    posthogReady = true
  }

  // Mixpanel
  const mpToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (mpToken && !mixpanelReady) {
    const mixpanel = (await import('mixpanel-browser')).default
    mixpanel.init(mpToken, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: false,
    })
    mixpanelReady = true
  }
}

async function getPosthog() {
  if (typeof window === 'undefined') return null
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null
  const posthog = (await import('posthog-js')).default
  return posthog
}

async function getMixpanel() {
  if (typeof window === 'undefined') return null
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) return null
  const mixpanel = (await import('mixpanel-browser')).default
  return mixpanel
}

type Props = Record<string, string | number | boolean | null>

async function track(event: string, props?: Props) {
  const [ph, mp] = await Promise.all([getPosthog(), getMixpanel()])
  ph?.capture(event, props)
  mp?.track(event, props)
}

export const analytics = {
  pageView: (path: string) => track('$pageview', { path }),

  quizStarted: () => track('quiz_started'),

  quizStepCompleted: (step: number, questionId: string) =>
    track('quiz_step_completed', { step, questionId }),

  quizAbandoned: (step: number) =>
    track('quiz_abandoned', { step }),

  quizCompleted: () => track('quiz_completed'),

  cardGenerated: (theme: string) =>
    track('card_generated', { theme }),

  cardDownloaded: (format: 'png' | 'jpg', aspect: '4:5' | '1:1') =>
    track('card_downloaded', { format, aspect }),

  cardShared: (platform: string) =>
    track('card_shared', { platform }),

  themeChanged: (from: string, to: string) =>
    track('theme_changed', { from, to }),

  authCompleted: (method: string) =>
    track('auth_completed', { method }),

  archiveViewed: () => track('archive_viewed'),
}
