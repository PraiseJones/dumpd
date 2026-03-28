import { QuizShell } from '@/components/quiz/quiz-shell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dumpd – Your Monthly Dump',
  description: 'Answer 15 questions about your month and get a cinematic card.',
}

export default function QuizPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <QuizShell />
      </div>
    </main>
  )
}
