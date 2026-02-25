'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardGate() {
  const router = useRouter()

  useEffect(() => {
    let mounted = true
      ; (async () => {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        if (!data?.user) {
          router.replace('/auth/login')
          return
        }

        // Check profile completion: require full_name + username (you can add more fields if you want)
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('user_id', data.user.id)
          .maybeSingle()

        const isComplete = !!(profile?.full_name && profile?.username)
        router.replace(isComplete ? '/dashboard/vcards' : '/dashboard/profile')
      })()

    return () => { mounted = false }
  }, [router])

  return (
    <div className="container text-center mt-5">
      <div className="spinner-border text-primary" />
    </div>
  )
}