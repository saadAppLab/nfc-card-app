'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function AuthNavButtons() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        // check current session
        supabase.auth.getUser().then(({ data }) => {
            if (!mounted) return
            setUser(data?.user || null)
            setLoading(false)
        })

        // listen to auth changes
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!mounted) return
            setUser(session?.user || null)
        })

        return () => {
            mounted = false
            sub.subscription.unsubscribe()
        }
    }, [])

    async function logout() {
        await supabase.auth.signOut()
        window.location.href = '/auth/login'
    }

    if (loading) return null

    return (
        <>
            {!user && (
                <>
                    <Link href="/auth/login">Login</Link>
                    <Link href="/auth/signup">Create Account</Link >
                </>
            )
            }

            {
                user && (
                    <button className="btn btn-sm btn-outline-light ms-2" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>
                )
            }
        </>
    )
}