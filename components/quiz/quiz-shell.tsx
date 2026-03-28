'use client'

import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuizStore } from '@/store/quiz-store'
import { QUESTIONS, getQuestionByStep, TOTAL_STEPS } from '@/lib/questions'
import { ProgressBar } from './progress-bar'
import { QuestionCard } from './question-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { formatMonth } from '@/lib/utils'
import type { AnswerValue, YesNoAnswer, MultipleChoiceAnswer } from '@/types/quiz'

function isAnswerValid(answer: AnswerValue | undefined, questionId: string): boolean {
  if (answer === undefined || answer === null) return false

  const question = QUESTIONS.find((q) => q.id === questionId)
  if (!question) return false

  switch (question.type) {
    case 'text':
      return typeof answer === 'string' && answer.trim().length > 0
    case 'slider':
      return typeof answer === 'number'
    case 'yes-no': {
      const a = answer as YesNoAnswer
      return a.value !== undefined && a.value !== null
    }
    case 'multiple-choice': {
      const a = answer as MultipleChoiceAnswer
      if (!a.selected) return false
      if (a.selected === '__custom__') return (a.custom ?? '').trim().length > 0
      return true
    }
    default:
      return false
  }
}

export function QuizShell() {
  const router = useRouter()
  const {
    currentStep,
    answers,
    direction,
    isSubmitting,
    setAnswer,
    nextStep,
    prevStep,
    setSubmitting,
    setDumpId,
  } = useQuizStore()

  const question = getQuestionByStep(currentStep)
  const currentAnswer = question ? answers[question.id] : undefined
  const canAdvance = question ? isAnswerValid(currentAnswer, question.id) : false
  const isLastStep = currentStep === TOTAL_STEPS
  const month = formatMonth()

  // Initialize slider defaults
  const getInitializedAnswer = (): AnswerValue | undefined => {
    if (!question) return undefined
    if (currentAnswer !== undefined) return currentAnswer
    if (question.type === 'slider') {
      const cfg = question.config as { min: number }
      return cfg.min
    }
    return undefined
  }

  const handleNext = async () => {
    if (!canAdvance) return

    if (isLastStep) {
      await handleSubmit()
    } else {
      nextStep()
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const sessionId = typeof window !== 'undefined'
        ? (localStorage.getItem('dumpd-session-id') ?? (() => {
            const id = crypto.randomUUID()
            localStorage.setItem('dumpd-session-id', id)
            return id
          })())
        : ''

      const res = await fetch('/api/dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          month_year: useQuizStore.getState().monthYear,
          theme: useQuizStore.getState().selectedTheme,
          session_id: sessionId,
        }),
      })

      if (!res.ok) throw new Error('Failed to save dump')
      const { id } = await res.json()
      setDumpId(id)
      router.push(`/card/generating?id=${id}`)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canAdvance) {
      e.preventDefault()
      handleNext()
    }
  }

  if (currentStep === 0) {
    // Welcome screen
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div>
          <p className="text-dumpd-violet text-sm font-medium uppercase tracking-widest mb-3">
            {month} Dump
          </p>
          <h1 className="font-clash text-4xl md:text-5xl font-bold text-dumpd-white mb-4">
            Ready to dump?
          </h1>
          <p className="text-dumpd-muted text-lg max-w-sm mx-auto">
            15 questions. 3 minutes. One legendary card of your month.
          </p>
        </div>

        <div className="space-y-3 text-sm text-dumpd-subtle max-w-xs mx-auto">
          <p>✓ No account needed</p>
          <p>✓ Your answers stay private</p>
          <p>✓ Card ready to download instantly</p>
        </div>

        <Button
          size="xl"
          onClick={() => useQuizStore.getState().goToStep(1)}
          className="font-clash text-lg"
        >
          Start Dumping
          <ArrowRight size={20} />
        </Button>
      </motion.div>
    )
  }

  if (!question) return null

  return (
    <div className="w-full space-y-6" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep <= 1}
          className="flex items-center gap-1 text-dumpd-muted hover:text-dumpd-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span className="text-dumpd-violet text-xs font-medium uppercase tracking-widest">
          {month}
        </span>
      </div>

      {/* Progress */}
      <ProgressBar currentStep={currentStep} />

      {/* Question */}
      <div className="min-h-[320px] flex items-start overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionCard
            key={question.id}
            question={question}
            value={getInitializedAnswer()}
            onChange={(v) => setAnswer(question.id, v)}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="pt-4">
        <Button
          size="lg"
          onClick={handleNext}
          disabled={!canAdvance || isSubmitting}
          className="w-full font-clash text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating your card…
            </>
          ) : isLastStep ? (
            <>
              Generate my card ✨
            </>
          ) : (
            <>
              Next
              <ArrowRight size={18} />
            </>
          )}
        </Button>
        <p className="text-center text-dumpd-subtle text-xs mt-3">
          Press Enter to continue
        </p>
      </div>
    </div>
  )
}
