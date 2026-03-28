import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="space-y-6">
        <p className="text-6xl">🎬</p>
        <h1 className="font-clash text-4xl font-bold text-dumpd-white">Card not found</h1>
        <p className="text-dumpd-muted">This card may have been deleted or the link is invalid.</p>
        <Button asChild>
          <Link href="/">Make your own →</Link>
        </Button>
      </div>
    </main>
  )
}
