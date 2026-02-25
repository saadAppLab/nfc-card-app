'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CreateAccountPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')

    const [msg, setMsg] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Require an authenticated session (via magic link or existing session)
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.replace('/auth/login')
                return
            }
            setUser(data.user)
            setLoading(false)
        })
    }, [router])

    async function handleSubmit() {
        setMsg(null)

        if (!username || !fullName || !password) {
            setMsg('Please fill all fields.')
            return
        }

        // enforce lowercase slug-style usernames
        const uname = username.toLowerCase().trim()

        // Validate simple pattern: letters, numbers, underscore, dash (3+)
        if (!/^[a-z0-9_-]{3,}$/.test(uname)) {
            setMsg('Username must be 3+ chars: lowercase letters, numbers, underscores or dashes.')
            return
        }

        setSaving(true)

        // 1) Check if username is taken
        const { data: taken, error: checkErr } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', uname)
            .maybeSingle()

        if (checkErr) {
            setMsg(checkErr.message)
            setSaving(false)
            return
        }
        if (taken) {
            setMsg('This username is already taken.')
            setSaving(false)
            return
        }

        // 2) Save password on auth user
        const { error: passErr } = await supabase.auth.updateUser({ password })
        if (passErr) {
            setMsg(passErr.message)
            setSaving(false)
            return
        }

        // 3) Update profile data (username is permanent — don’t allow edit elsewhere)
        const { error: profErr } = await supabase
            .from('profiles')
            .update({
                username: uname,
                full_name: fullName,
            })
            .eq('user_id', user.id)

        if (profErr) {
            setMsg(profErr.message)
            setSaving(false)
            return
        }

        // Done → go to dashboard
        router.replace('/dashboard')
    }

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        )
    }

    return (
        <div className="container d-flex justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: 460 }}>
                <h3 className="text-center mb-2">
                    <i className="bi bi-person-plus me-2" />
                    Create your account
                </h3>
                <p className="text-muted text-center mb-4">
                    Pick a permanent username, enter your full name, and set a password.
                </p>

                {msg && <div className="alert alert-warning py-2">{msg}</div>}

                <div className="form-floating mb-3">
                    <input
                        id="username"
                        className="form-control"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username">Username (permanent)</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        id="fullName"
                        className="form-control"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <label htmlFor="fullName">Full Name</label>
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

                <button className="btn btn-primary w-100" disabled={saving} onClick={handleSubmit}>
                    {saving ? 'Saving…' : 'Continue'}
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