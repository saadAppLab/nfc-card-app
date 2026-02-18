
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function signIn(){
    setSending(true); setMsg('')
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/dashboard' } })
    if (error) setMsg(error.message)
    else setMsg('Check your email for the login link.')
    setSending(false)
  }

  async function signOut(){
    await supabase.auth.signOut()
    setMsg('Signed out.')
  }

  async function goDashboard(){ router.push('/dashboard') }

  return (
    <div className="container">
      <div className="panel" style={{maxWidth:480, margin:'0 auto'}}>
        <h2>Login</h2>
        <p className="small">Use your email to receive a magic sign-in link.</p>
        <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button className="btn" disabled={sending} onClick={signIn}>{sending? 'Sending...':'Send Magic Link'}</button>
          <button className="btn secondary" onClick={goDashboard}>Go to Dashboard</button>
          <button className="btn secondary" onClick={signOut}>Sign out</button>
        </div>
        {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
      </div>
    </div>
  )
}
