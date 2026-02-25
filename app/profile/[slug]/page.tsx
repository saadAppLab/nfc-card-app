'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProfileCard from '@/components/ProfileCard'

export default function PublicProfilePage() {
  const { slug } = useParams() as { slug: string }
  const [profile, setProfile] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
      ; (async () => {
        setLoading(true)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error || !data) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setProfile(data)
        setLoading(false)

        // Fire-and-forget analytics
        fetch('/api/track', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            profile_id: data.id,
            event: 'view',
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            ip: 'client',
          }),
        }).catch(() => { })
      })()
  }, [slug])

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center shadow-sm p-4">
          <h4 className="mb-0">
            <i className="bi bi-exclamation-triangle me-2" />
            Profile not found
          </h4>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div style={{ width: '100%', maxWidth: 720 }}>
        <ProfileCard profile={profile} />
      </div>
    </div>
  )
}