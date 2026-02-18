
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { THEMES } from '@/utils/themes'

export default function ProfileForm({ userId }: { userId: string }){
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [profile, setProfile] = useState<any>({
    name: '', title: '', bio: '', phone: '', email: '', whatsapp: '', linkedin: '', instagram: '', website: '', slug: '', avatar_url: '', theme: { key: 'blue', primary: '#3b82f6' }
  })

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single()
      if (data){
        setProfile(prev => ({...prev, ...data}))
      }
      setLoading(false)
    })()
  }, [userId])

  async function onSave(){
    setSaving(true); setMsg('')
    if (!profile.slug || !/^[a-z0-9-]{3,}$/.test(profile.slug)){
      setMsg('Choose a slug (min 3 chars, lowercase letters, numbers, dashes).')
      setSaving(false); return
    }
    const { data: taken } = await supabase.from('profiles').select('id,user_id').eq('slug', profile.slug).maybeSingle()
    if (taken && taken.user_id !== userId){
      setMsg('This URL slug is already taken. Try another.')
      setSaving(false); return
    }

    const row = {
      user_id: userId,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      phone: profile.phone,
      email: profile.email,
      whatsapp: profile.whatsapp,
      linkedin: profile.linkedin,
      instagram: profile.instagram,
      website: profile.website,
      avatar_url: profile.avatar_url,
      slug: profile.slug,
      theme: profile.theme
    }

    const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'user_id' })
    if (!error) setMsg('Saved!')
    else setMsg(error.message)
    setSaving(false)
  }

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]
    if (!file) return
    const filePath = `${userId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (error){ setMsg(error.message); return }
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(filePath)
    setProfile({ ...profile, avatar_url: pub.publicUrl })
  }

  if (loading) return <div className="panel">Loading...</div>

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>Your Profile</h3>
      <div className="grid two">
        <div className="card">
          <label>Name</label>
          <input className="input" value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} />
          <label style={{marginTop:12}}>Title</label>
          <input className="input" value={profile.title} onChange={e=>setProfile({...profile, title:e.target.value})} />
          <label style={{marginTop:12}}>Bio</label>
          <textarea className="textarea" rows={4} value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})} />
          <div className="grid two" style={{marginTop:12}}>
            <div>
              <label>Phone</label>
              <input className="input" value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} />
            </div>
            <div>
              <label>Email</label>
              <input className="input" value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})} />
            </div>
          </div>
          <div className="grid two" style={{marginTop:12}}>
            <div>
              <label>WhatsApp</label>
              <input className="input" placeholder="e.g., +923001234567" value={profile.whatsapp} onChange={e=>setProfile({...profile, whatsapp:e.target.value})} />
            </div>
            <div>
              <label>Website</label>
              <input className="input" value={profile.website} onChange={e=>setProfile({...profile, website:e.target.value})} />
            </div>
          </div>
          <div className="grid two" style={{marginTop:12}}>
            <div>
              <label>LinkedIn</label>
              <input className="input" value={profile.linkedin} onChange={e=>setProfile({...profile, linkedin:e.target.value})} />
            </div>
            <div>
              <label>Instagram</label>
              <input className="input" value={profile.instagram} onChange={e=>setProfile({...profile, instagram:e.target.value})} />
            </div>
          </div>
        </div>
        <div className="card">
          <label>Public URL Slug</label>
          <input className="input" placeholder="your-name" value={profile.slug} onChange={e=>setProfile({...profile, slug:e.target.value})} />
          <div className="small" style={{marginTop:6}}>Profile URL: {site}/profile/{profile.slug || 'your-slug'}</div>
          <label style={{marginTop:12}}>Avatar</label>
          <input className="input" type="file" accept="image/*" onChange={onUploadAvatar} />
          {profile.avatar_url && <img src={profile.avatar_url} alt="avatar" style={{marginTop:8, width:96, height:96, borderRadius:12, objectFit:'cover', border:'1px solid #223042'}}/>}
          <label style={{marginTop:12}}>Theme</label>
          <select className="select" value={profile.theme?.key} onChange={e=>{
            const t = THEMES.find(x=>x.key===e.target.value)
            setProfile({...profile, theme: t})
            document.documentElement.style.setProperty('--primary', t?.primary || '#3b82f6')
          }}>
            {THEMES.map(t=> <option key={t.key} value={t.key}>{t.name}</option>)}
          </select>
          <button className="btn" style={{marginTop:16}} onClick={onSave} disabled={saving}>{saving? 'Saving...':'Save'}</button>
          {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
        </div>
      </div>
    </div>
  )
}
