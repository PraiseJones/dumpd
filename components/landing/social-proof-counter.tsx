'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface SocialProofCounterProps {
  initialCount?: number
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 20 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => {
      setDisplayValue(Math.floor(v))
    })
    return unsubscribe
  }, [springValue])

  return <span>{displayValue.toLocaleString()}</span>
}

export function SocialProofCounter({ initialCount = 12457 }: SocialProofCounterProps) {
  const [count, setCount] = useState(initialCount)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Fetch real count
          fetch('/api/dump')
            .then((r) => r.json())
            .then((data) => {
              if (data.count) setCount(data.count)
            })
            .catch(() => {})
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <p className="text-dumpd-muted text-sm uppercase tracking-widest mb-2">This month</p>
      <p className="font-clash text-4xl md:text-5xl font-bold text-dumpd-white">
        {isVisible ? <AnimatedNumber value={count} /> : count.toLocaleString()}
        <span className="text-dumpd-violet"> cards dropped</span>
      </p>
      <p className="text-dumpd-subtle text-sm mt-2">Real people. Real months. Real chaos.</p>
    </motion.div>
  )
}
