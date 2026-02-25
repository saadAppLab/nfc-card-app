'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ProfileForm from '@/components/ProfileForm'

export default function ProfileCompletionPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let mounted = true
        supabase.auth.getUser().then(({ data }) => {
            if (!mounted) return
            if (!data.user) router.replace('/auth/login')
            else setUser(data.user)
            setReady(true)
        })
        return () => { mounted = false }
    }, [router])

    if (!ready) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-4">
            <div className="alert alert-info mb-3">
                <strong>Complete your profile</strong> to continue to your vCards.
            </div>
            {/* ProfileForm now supports onSaved to route forward */}
            <ProfileForm userId={user.id} onSaved={() => router.replace('/dashboard/vcards')} forceEdit />
        </div>
    )
}