'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    async function submit() {
        setMsg(null)
        if (!email) {
            setMsg('Please enter your email.')
            return
        }

        setBusy(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl}/auth/login` // you can create /auth/reset-password and use that instead
        })
        setBusy(false)

        if (error) {
            if (/rate limit/i.test(error.message)) {
                setMsg('Too many requests. Please wait a minute and try again.')
            } else {
                setMsg(error.message)
            }
            return
        }

        setMsg('Reset link sent! Please check your email.')
    }

    return (
        <div className="container d-flex justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: 460 }}>
                <h3 className="text-center mb-3">
                    <i className="bi bi-shield-lock me-2" />
                    Forgot password
                </h3>

                {msg && <div className="alert alert-info py-2">{msg}</div>}

                <div className="form-floating mb-3">
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <button className="btn btn-primary w-100" disabled={busy} onClick={submit}>
                    {busy ? 'Sending…' : 'Send Reset Link'}
                </button>

                <button
                    className="btn btn-outline-secondary w-100 mt-3"
                    onClick={() => history.back()}
                >
                    Back
                </button>
            </div>
        </div>
    )
}