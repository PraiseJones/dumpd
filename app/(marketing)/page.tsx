import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { SocialProofCounter } from '@/components/landing/social-proof-counter'
import { ExampleCardsScroll } from '@/components/landing/example-cards-scroll'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <Hero />

      {/* Social proof counter */}
      <SocialProofCounter />

      {/* Example cards */}
      <div className="relative">
        <ExampleCardsScroll />
      </div>

      {/* How it works */}
      <HowItWorks />

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-clash text-4xl md:text-5xl font-bold text-dumpd-white mb-4">
            Ready to dump?
          </h2>
          <p className="text-dumpd-muted text-lg mb-8">
            Your month deserves a cinematic recap. Start now — it&apos;s free.
          </p>
          <Button asChild size="xl" className="group font-clash text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-shadow">
            <Link href="/quiz">
              Dump this month
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-dumpd-border text-center">
        <p className="text-dumpd-subtle text-sm">
          © {new Date().getFullYear()} Dumpd. No ads. No BS. Just vibes.
        </p>
      </footer>
    </main>
  )
}
