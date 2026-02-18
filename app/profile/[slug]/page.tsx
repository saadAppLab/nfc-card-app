import { supabasePublic } from '@/lib/supabaseServer'
import ProfileCard from '@/components/ProfileCard'
import { headers } from 'next/headers'

export const revalidate = 0

export default async function PublicProfilePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params

  const supabase = supabasePublic()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!profile) {
    return (
      <div className="container">
        <div className="panel">Profile not found.</div>
      </div>
    )
  }

  // ---------- FIXED ANALYTICS BLOCK ----------
  try {
    const h = headers()

    const ref = h.get?.('referer') ?? ''
    const ua = h.get?.('user-agent') ?? ''
    const ipraw = h.get?.('x-forwarded-for') ?? ''
    const ip = typeof ipraw === 'string' ? ipraw.split(',')[0] : ''

    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/track`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        profile_id: profile.id,
        event: 'view',
        referrer: ref,
        user_agent: ua,
        ip
      })
    }).catch(() => {})
  } catch (err) {
    console.log('Analytics error:', err)
  }
  // --------------------------------------------

  return (
    <div className="container">
      <ProfileCard profile={profile} />
    </div>
  )
}