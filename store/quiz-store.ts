'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Answers, AnswerValue } from '@/types/quiz'
import type { Theme } from '@/types/card'
import { TOTAL_STEPS } from '@/lib/questions'
import { getMonthYear } from '@/lib/utils'

interface QuizStore {
  // State
  currentStep: number
  answers: Answers
  direction: 'forward' | 'back'
  isSubmitting: boolean
  dumpId: string | null
  selectedTheme: Theme
  monthYear: string

  // Actions
  setAnswer: (questionId: string, value: AnswerValue) => void
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setTheme: (theme: Theme) => void
  setDumpId: (id: string) => void
  setSubmitting: (v: boolean) => void
  resetQuiz: () => void
  isComplete: () => boolean
}

const initialState = {
  currentStep: 0,
  answers: {},
  direction: 'forward' as const,
  isSubmitting: false,
  dumpId: null,
  selectedTheme: 'noir' as Theme,
  monthYear: getMonthYear(),
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      goToStep: (step) =>
        set((state) => ({
          currentStep: step,
          direction: step > state.currentStep ? 'forward' : 'back',
        })),

      nextStep: () =>
        set((state) => {
          if (state.currentStep >= TOTAL_STEPS) return state
          return {
            currentStep: state.currentStep + 1,
            direction: 'forward',
          }
        }),

      prevStep: () =>
        set((state) => {
          if (state.currentStep <= 1) return state
          return {
            currentStep: state.currentStep - 1,
            direction: 'back',
          }
        }),

      setTheme: (theme) => set({ selectedTheme: theme }),
      setDumpId: (id) => set({ dumpId: id }),
      setSubmitting: (v) => set({ isSubmitting: v }),

      resetQuiz: () => set({ ...initialState, monthYear: getMonthYear() }),

      isComplete: () => {
        const { answers } = get()
        // Check all 15 questions have answers
        for (let i = 1; i <= TOTAL_STEPS; i++) {
          if (!answers[`q${i}`]) return false
        }
        return true
      },
    }),
    {
      name: 'dumpd-quiz',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
        selectedTheme: state.selectedTheme,
        monthYear: state.monthYear,
        dumpId: state.dumpId,
      }),
    }
  )
)
