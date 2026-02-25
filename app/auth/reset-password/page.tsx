'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
    const router = useRouter()

    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [msg, setMsg] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        // When user clicks the email reset link, Supabase sets a temporary session.
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                setMsg('Invalid or expired link. Please request a new password reset.')
            }
            setReady(true)
        })
    }, [])

    async function handleReset() {
        setMsg(null)

        if (!newPassword || !confirm) {
            setMsg('Please enter a new password in both fields.')
            return
        }
        if (newPassword.length < 6) {
            setMsg('Password must be at least 6 characters.')
            return
        }
        if (newPassword !== confirm) {
            setMsg('Passwords do not match.')
            return
        }

        setBusy(true)

        const { error } = await supabase.auth.updateUser({ password: newPassword })

        if (error) {
            setMsg(error.message)
            setBusy(false)
            return
        }

        setMsg('Password updated successfully! Redirecting to login...')
        setTimeout(() => router.replace('/auth/login'), 1200)
    }

    if (!ready) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        )
    }

    return (
        <div className="container d-flex justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: 460 }}>
                <h3 className="text-center mb-3">
                    <i className="bi bi-shield-lock me-2" />
                    Reset Password
                </h3>

                {msg && <div className="alert alert-info py-2">{msg}</div>}

                <div className="form-floating mb-3">
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label htmlFor="password">New Password</label>
                </div>

                <div className="form-floating mb-4">
                    <input
                        type="password"
                        id="confirm"
                        className="form-control"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                    <label htmlFor="confirm">Confirm New Password</label>
                </div>

                <button className="btn btn-primary w-100" disabled={busy} onClick={handleReset}>
                    {busy ? 'Updating…' : 'Update Password'}
                </button>

                <button
                    className="btn btn-outline-secondary w-100 mt-3"
                    onClick={() => router.replace('/auth/login')}
                >
                    Back to Login
                </button>
            </div>
        </div>
    )
}