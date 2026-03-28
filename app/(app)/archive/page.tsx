import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArchiveClient } from './archive-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Dumpd Archive',
  description: 'Your monthly cinematic life recaps.',
}

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/?auth=required')
  }

  const { data: dumps } = await supabase
    .from('monthly_dumps')
    .select('id, month_year, card_title, generated_card_url, theme, share_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <ArchiveClient dumps={dumps ?? []} />
}
