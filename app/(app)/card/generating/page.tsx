import { Suspense } from 'react'
import { GeneratingContent } from './generating-content'

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-dumpd-void">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-dumpd-violet animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </main>
      }
    >
      <GeneratingContent />
    </Suspense>
  )
}
