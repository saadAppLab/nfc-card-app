
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProfileForm from '@/components/ProfileForm'
import ProfileCard from '@/components/ProfileCard'

export default function Dashboard(){
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any[]>([])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    // initial
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      setProfile(data)
      if (data){
        const { data: events } = await supabase.from('analytics').select('*').eq('profile_id', data.id).order('ts', { ascending: false }).limit(50)
        setAnalytics(events || [])
      }
    })()
  }, [user])

  async function signOut(){ await supabase.auth.signOut(); setUser(null) }

  if (!user){
    return (
      <div className="container">
        <div className="panel" style={{maxWidth:600, margin:'0 auto'}}>
          <h2>Welcome</h2>
          <p>Please <a href="/login">login</a> to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{margin: '12px 0'}}>Dashboard</h1>
        <button className="btn secondary" onClick={signOut}>Sign out</button>
      </div>
      <ProfileForm userId={user.id} />
      {profile && (
        <>
          <h3 style={{marginTop:24}}>Preview</h3>
          <ProfileCard profile={profile} />

          <h3 style={{marginTop:24}}>Recent Analytics</h3>
          <div className="panel">
            {analytics.length === 0 && <div className="small">No events yet. Share your profile link and come back later.</div>}
            {analytics.map((e) => (
              <div key={e.id} className="small" style={{display:'grid', gridTemplateColumns:'160px 1fr 1fr', gap:8, padding:'6px 0', borderBottom:'1px solid #1f2937'}}>
                <span>{new Date(e.ts).toLocaleString()}</span>
                <span>{e.event}</span>
                <span style={{opacity:0.7}}>{e.referrer || e.ip}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
