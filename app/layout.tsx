import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dumpd – Monthly Cinematic Life Recap',
  description: '15 questions. One month. One legendary card. Turn your raw month into a cinematic story.',
  openGraph: {
    title: 'Dumpd – Monthly Cinematic Life Recap',
    description: '15 questions. One month. One legendary card.',
    type: 'website',
    siteName: 'Dumpd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dumpd – Monthly Cinematic Life Recap',
    description: '15 questions. One month. One legendary card.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full flex flex-col">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
