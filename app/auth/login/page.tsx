'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
    const router = useRouter()
    const [userOrEmail, setUserOrEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    async function onLogin() {
        setMsg(null)
        setBusy(true)

        try {
            let emailToUse = userOrEmail.trim()

            // If user typed a username (no @), resolve to email via profiles
            if (!userOrEmail.includes('@')) {
                const lookup = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('username', userOrEmail.toLowerCase())
                    .maybeSingle()

                if (lookup.error) throw lookup.error
                if (!lookup.data?.email) {
                    setMsg('No account found for that username.')
                    setBusy(false)
                    return
                }
                emailToUse = lookup.data.email
            }

            const res = await supabase.auth.signInWithPassword({
                email: emailToUse,
                password,
            })

            if (res.error) {
                const m = res.error.message || 'Login failed.'
                if (/email not confirmed/i.test(m)) {
                    setMsg('Email not confirmed. Please check your inbox.')
                } else if (/invalid login credentials/i.test(m)) {
                    setMsg('Invalid email/username or password.')
                } else {
                    setMsg(m)
                }
                setBusy(false)
                return
            }

            // Verify session exists
            const sess = await supabase.auth.getSession()
            if (!sess?.data?.session) {
                setMsg('Login succeeded but no session yet. Confirm your email or try again.')
                setBusy(false)
                return
            }

            router.replace('/dashboard')
        } catch (e: any) {
            setMsg(e?.message || 'Unexpected error.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="container d-flex justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: 420 }}>
                <h3 className="text-center mb-3">
                    <i className="bi bi-door-open me-2" />
                    Login
                </h3>

                {msg && <div className="alert alert-warning py-2">{msg}</div>}

                <div className="form-floating mb-3">
                    <input
                        id="user"
                        className="form-control"
                        placeholder="Email or Username"
                        value={userOrEmail}
                        onChange={(e) => setUserOrEmail(e.target.value)}
                    />
                    <label htmlFor="user">Email or Username</label>
                </div>

                <div className="form-floating mb-4">
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <button className="btn btn-primary w-100" disabled={busy} onClick={onLogin}>
                    {busy ? 'Logging in…' : 'Login'}
                </button>

                <div className="d-flex justify-content-between mt-3">
                    <a href="/auth/forgot-password">Forgot Password?</a>
                    <a href="/auth/signup">Create Account</a>
                </div>
            </div >
        </div >
    )
}