'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [msg, setMsg] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    async function onSubmit() {
        setMsg(null)

        // Basic validations
        if (!fullName || !username || !email || !password || !confirm) {
            setMsg('Please fill all fields.')
            return
        }

        const uname = username.trim().toLowerCase()

        if (!/^[a-z0-9_-]{3,}$/.test(uname)) {
            setMsg('Username must be 3+ chars, lowercase letters, numbers, underscores or dashes.')
            return
        }

        if (password.length < 6) {
            setMsg('Password must be at least 6 characters.')
            return
        }

        if (password !== confirm) {
            setMsg('Passwords do not match.')
            return
        }

        setBusy(true)

        // -------------------------------------------
        // ✅ Check if username already taken
        // -------------------------------------------
        let taken
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', uname)
                .maybeSingle()

            if (error) throw error
            taken = data
        } catch (e: any) {
            setMsg('Failed to check username: ' + e.message)
            setBusy(false)
            return
        }

        if (taken) {
            setMsg('That username is already taken.')
            setBusy(false)
            return
        }

        // -------------------------------------------
        // ✅ Sign up user
        // -------------------------------------------
        let res
        try {
            res = await supabase.auth.signUp({
                email,
                password
            })
        } catch (e: any) {
            setMsg('Sign up failed: ' + e.message)
            setBusy(false)
            return
        }

        if (res.error) {
            setMsg(res.error.message || 'Sign up failed.')
            setBusy(false)
            return
        }

        // const userId = res.data?.user?.id
        // if (!userId) {
        //     setMsg('Sign up created, but no user id available. Please verify your email.')
        //     setBusy(false)
        //     return
        // }
        // Force Supabase to provide a session token immediately
        await supabase.auth.refreshSession();

        // Fetch the new session
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;

        if (!userId) {
            setMsg('Sign up created, but user session not ready. Try logging in manually.')
            setBusy(false)
            return
        }

        // -------------------------------------------
        // ✅ Upsert profile
        // -------------------------------------------
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert(
                    {
                        user_id: userId,
                        full_name: fullName,
                        username: uname,
                        slug: uname,
                        email
                    },
                    { onConflict: 'user_id' }
                )

            if (error) throw error
        } catch (e: any) {
            setMsg('Failed to save profile: ' + e.message)
            setBusy(false)
            return
        }

        // -------------------------------------------
        // ✅ Session check (email confirmation)
        // -------------------------------------------
        let sess
        try {
            sess = await supabase.auth.getSession()
        } catch {
            sess = { data: null }
        }

        if (!sess?.data?.session) {
            setMsg('Account created! Please check your email to confirm before logging in.')
            setBusy(false)
            return
        }

        router.replace('/dashboard')
    }

    return (
        <div className="container d-flex justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: 520 }}>
                <h3 className="text-center mb-2">
                    <i className="bi bi-person-plus me-2" />
                    Create Account
                </h3>
                <p className="text-muted text-center mb-4">
                    Create your account with a unique username and password.
                </p>

                {msg && <div className="alert alert-info py-2">{msg}</div>}

                <div className="form-floating mb-3">
                    <input
                        id="fullName"
                        className="form-control"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <label htmlFor="fullName">Full Name*</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        id="username"
                        className="form-control"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username">Username (permanent)*</label>
                    <div className="form-text">Lowercase letters, numbers, _ or -</div>
                </div>

                <div className="form-floating mb-3">
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email*</label>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password*</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating">
                            <input
                                id="confirm"
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            <label htmlFor="confirm">Confirm Password*</label>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-100 mt-4"
                    disabled={busy}
                    onClick={onSubmit}
                >
                    {busy ? 'Creating…' : 'Create Account'}
                </button>

                <div className="text-center mt-3">
                    Already have an account?{' '}
                    <Link href="/auth/login">Login</Link>
                </div>
            </div>
        </div>
    )
}