import type { Answers } from '@/types/quiz'
import { truncate } from '@/lib/utils'

interface CardContent {
  title: string
  subtitle: string
  narrative: string
}

function getMainCharacterLabel(score: number): string {
  if (score <= 2) return 'The Quiet Collapse'
  if (score <= 4) return 'Surviving With Style'
  if (score <= 6) return 'The Soft Reset'
  if (score <= 8) return 'The Redemption Arc'
  if (score <= 9) return 'The Glow-Up Chronicles'
  return 'Absolute Cinema'
}

function getSituationshipModifier(selected: string): string {
  if (selected.includes('thriving') || selected.includes('love')) return 'Golden Era: '
  if (selected.includes('complicated') || selected.includes('chaos')) return ''
  if (selected.includes('Healing') || selected.includes('healing')) return 'The Healing Season: '
  if (selected.includes('unbothered') || selected.includes('Single')) return 'Solo Ascension: '
  return ''
}

function getBrokeLabel(score: number): string {
  if (score <= 3) return 'financially stable'
  if (score <= 6) return 'fiscally creative'
  if (score <= 8) return 'voluntarily broke'
  return 'economically liberated'
}

function getTextAnswer(answers: Answers, key: string): string {
  const v = answers[key]
  if (typeof v === 'string') return v
  return ''
}

function getSliderAnswer(answers: Answers, key: string, fallback = 5): number {
  const v = answers[key]
  if (typeof v === 'number') return v
  return fallback
}

export function generateCardContent(answers: Answers, month: string): CardContent {
  const mainCharacterScore = getSliderAnswer(answers, 'q14', 5)
  const brokeScore = getSliderAnswer(answers, 'q3', 5)
  const win = getTextAnswer(answers, 'q1')
  const loss = getTextAnswer(answers, 'q2')
  const unhinged = getTextAnswer(answers, 'q7')
  const lesson = getTextAnswer(answers, 'q8')
  const sanityPerson = getTextAnswer(answers, 'q13')
  const oneWord = getTextAnswer(answers, 'q15')
  const song = getTextAnswer(answers, 'q11')
  const meal = getTextAnswer(answers, 'q6')

  const situationship = answers['q9'] as { selected?: string; custom?: string } | undefined
  const situationshipText = situationship?.selected === '__custom__'
    ? (situationship.custom ?? '')
    : (situationship?.selected ?? '')

  const ghosted = answers['q5'] as { value?: boolean; followup?: string } | undefined

  // Build title
  const energyLabel = getMainCharacterLabel(mainCharacterScore)
  const situationshipMod = getSituationshipModifier(situationshipText)
  const wordCap = oneWord
    ? oneWord.charAt(0).toUpperCase() + oneWord.slice(1).toLowerCase()
    : 'The Month'

  // Combine: month + modifier + energy label
  const title = `${situationshipMod}${energyLabel}`
  const subtitle = oneWord ? `"${wordCap}"` : month

  // Build narrative (template-based, conversational)
  const brokeLabel = getBrokeLabel(brokeScore)
  const ghostSnippet = ghosted?.value ? 'left someone on read' : 'kept your karma clean'

  let narrative = ''

  if (win && sanityPerson) {
    narrative = `${month}: ${brokeLabel}, ${ghostSnippet}, and ${sanityPerson} kept you sane. `
    if (win) narrative += `W of the month: ${truncate(win, 50)}. `
    if (unhinged) narrative += `Most chaotic moment: ${truncate(unhinged, 45)}.`
  } else if (win) {
    narrative = `${month}: Your biggest W was "${truncate(win, 60)}". `
    if (lesson) narrative += `The universe said: ${truncate(lesson, 50)}.`
  } else if (meal) {
    narrative = `Carried by ${truncate(meal, 40)} and sheer determination. `
    if (song) narrative += `${truncate(song, 35)} on repeat.`
  } else {
    narrative = `${month} happened. ${truncate(loss || 'It was a whole journey', 60)}. Still standing.`
  }

  return { title, subtitle, narrative: narrative.trim() }
}

export function getStatsForCard(answers: Answers) {
  const brokeScore = typeof answers['q3'] === 'number' ? answers['q3'] : 5
  const sleepScore = typeof answers['q4'] === 'number' ? answers['q4'] : 5
  const healingCount = typeof answers['q10'] === 'number' ? answers['q10'] : 0
  const fitnessScore = typeof answers['q12'] === 'number' ? answers['q12'] : 5
  const mainCharScore = typeof answers['q14'] === 'number' ? answers['q14'] : 5
  const ghosted = (answers['q5'] as { value?: boolean })?.value

  const one = typeof answers['q15'] === 'string' ? answers['q15'] : '—'

  return [
    { label: 'Broke-o-meter', value: `${brokeScore}/10`, emoji: '💸' },
    { label: 'Sleep game', value: `${sleepScore}/10`, emoji: '😴' },
    { label: 'Ghosted?', value: ghosted ? 'Yes 👻' : 'No 😇', emoji: '👻' },
    { label: 'Healing count', value: `${healingCount}x`, emoji: '🌱' },
    { label: 'Fitness', value: `${fitnessScore}/10`, emoji: '💪' },
    { label: 'Main character', value: `${mainCharScore}/10`, emoji: '🎬' },
    { label: 'Word of month', value: one, emoji: '💬' },
  ]
}
