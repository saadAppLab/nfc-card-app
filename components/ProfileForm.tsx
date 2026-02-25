'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  userId: string
  onSaved?: () => void
  forceEdit?: boolean
}

export default function ProfileForm({ userId, onSaved, forceEdit }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editMode, setEditMode] = useState(Boolean(forceEdit))

  const [profile, setProfile] = useState<any>({
    full_name: '',
    username: '',
    name: '',
    title: '',
    bio: '',
    phone: '',
    email: '',
    whatsapp: '',
    linkedin: '',
    instagram: '',
    website: '',
    avatar_url: '',
    theme: { key: 'blue', primary: '#3b82f6' }
  })

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single()
      if (data) {
        setProfile((p: any) => ({ ...p, ...data }))
        if (!forceEdit) setEditMode(false)
      } else {
        setEditMode(true) // brand-new profile
      }
      setLoading(false)
    })()
  }, [userId, forceEdit])

  async function onSave() {
    setSaving(true); setMsg('')

    // REQUIRED: full_name and username
    const uname = String(profile.username || '').toLowerCase().trim()
    if (!profile.full_name || !uname) {
      setMsg('Full Name and Username are required.')
      setSaving(false)
      return
    }
    if (!/^[a-z0-9_-]{3,}$/.test(uname)) {
      setMsg('Username must be 3+ chars, lowercase letters, numbers, _ or -.')
      setSaving(false)
      return
    }

    // Ensure username unique (if user changed it)
    const { data: taken } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('username', uname)
      .maybeSingle()

    if (taken && taken.user_id !== userId) {
      setMsg('This username is already taken.')
      setSaving(false)
      return
    }

    // IMPORTANT: slug = username (no UI)
    const row = {
      user_id: userId,
      full_name: profile.full_name,
      username: uname,
      slug: uname,
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
      theme: profile.theme
    }

    const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'user_id' })
    setMsg(error ? error.message : 'Saved!')
    setSaving(false)

    if (!error) {
      setEditMode(false)
      onSaved?.()
    }
  }

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const path = `${userId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (error) { setMsg(error.message); return }
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
    setProfile({ ...profile, avatar_url: pub.publicUrl })
  }

  if (loading) return <div className="card p-4 shadow-sm">Loading...</div>
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">Your Profile</h4>
        <div className="d-flex gap-2">
          {!editMode && !forceEdit && (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditMode(true)}>
              <i className="bi bi-pencil-square me-1" />
              Edit
            </button>
          )}
          {(editMode || forceEdit) && (
            <button className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
              <i className="bi bi-check2-circle me-1" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {msg && <div className="alert alert-warning py-2">{msg}</div>}

      <div className="row g-3">
        {/* LEFT: Required identity */}
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              id="full_name"
              className="form-control"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              disabled={!editMode && !forceEdit}
            />
            <label htmlFor="full_name">Full Name*</label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="username"
              className="form-control"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              disabled={!editMode && !forceEdit /* set true to make username permanent */}
            />
            <label htmlFor="username">Username* (will be your profile URL)</label>
          </div>

          <div className="form-text mb-3">
            Public Profile URL: <strong>{site}/profile/{profile.username || 'your-username'}</strong>
          </div>

          <div className="form-floating mb-3">
            <textarea
              id="bio"
              className="form-control"
              style={{ height: 100 }}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!editMode && !forceEdit}
            />
            <label htmlFor="bio">Bio</label>
          </div>
        </div>

        {/* RIGHT: Contacts + avatar */}
        <div className="col-md-6">
          <div className="row g-3">
            <div className="col-6">
              <div className="form-floating">
                <input
                  id="phone"
                  className="form-control"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!editMode && !forceEdit}
                />
                <label htmlFor="phone">Phone</label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating">
                <input
                  id="email"
                  className="form-control"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!editMode && !forceEdit}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
          </div>

          <div className="form-floating mt-3">
            <input
              id="website"
              className="form-control"
              value={profile.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              disabled={!editMode && !forceEdit}
            />
            <label htmlFor="website">Website</label>
          </div>

          <div className="form-floating mt-3">
            <input
              id="whatsapp"
              className="form-control"
              value={profile.whatsapp || ''}
              onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              disabled={!editMode && !forceEdit}
            />
            <label htmlFor="whatsapp">WhatsApp (+country or digits)</label>
          </div>

          <div className="form-floating mt-3">
            <input
              id="linkedin"
              className="form-control"
              value={profile.linkedin || ''}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              disabled={!editMode && !forceEdit}
            />
            <label htmlFor="linkedin">LinkedIn URL</label>
          </div>

          <div className="form-floating mt-3">
            <input
              id="instagram"
              className="form-control"
              value={profile.instagram || ''}
              onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
              disabled={!editMode && !forceEdit}
            />
            <label htmlFor="instagram">Instagram URL</label>
          </div>

          <label className="form-label mt-3">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={onUploadAvatar}
            disabled={!editMode && !forceEdit}
          />
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              width={96}
              height={96}
              className="rounded border mt-2"
              style={{ objectFit: 'cover' }}
              alt="avatar"
            />
          )}
        </div>
      </div>
    </div>
  )
}