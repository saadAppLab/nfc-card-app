'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProfileForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [profile, setProfile] = useState<any>({
    name: '',
    title: '',
    bio: '',
    phone: '',
    email: '',
    whatsapp: '',
    linkedin: '',
    instagram: '',
    website: '',
    slug: '',
    avatar_url: '',
    theme: { key: 'blue', primary: '#3b82f6' },
  })

  const [editMode, setEditMode] = useState(true) // enable edit initially; you can default to false if you prefer

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setProfile((prev: any) => ({ ...prev, ...data }))
        setEditMode(false) // if a profile exists, start in view mode
      }
      setLoading(false)
    })()
  }, [userId])

  async function onSave() {
    setSaving(true)
    setMsg('')

    if (!profile.slug || !/^[a-z0-9-]{3,}$/.test(profile.slug)) {
      setMsg('Slug must be lowercase letters, numbers, or dashes (min 3).')
      setSaving(false)
      return
    }

    // ensure unique slug
    const { data: taken } = await supabase
      .from('profiles')
      .select('id,user_id')
      .eq('slug', profile.slug)
      .maybeSingle()

    if (taken && taken.user_id !== userId) {
      setMsg('This URL slug is already taken. Try another.')
      setSaving(false)
      return
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
      theme: profile.theme,
    }

    const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'user_id' })
    setMsg(error ? error.message : 'Saved!')
    setSaving(false)

    if (!error) setEditMode(false) // lock after save
  }

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const path = `${userId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (error) {
      setMsg(error.message)
      return
    }
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
          {!editMode && (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditMode(true)}>
              <i className="bi bi-pencil-square me-1" />
              Edit
            </button>
          )}
          {editMode && (
            <button className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
              <i className="bi bi-check2-circle me-1" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {msg && <div className="alert alert-warning py-2">{msg}</div>}

      <div className="row g-3">
        {/* LEFT COLUMN */}
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="name">Full Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="title"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="title">Title</label>
          </div>

          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="bio"
              style={{ height: 100 }}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="bio">Bio</label>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="form-floating">
                <input
                  className="form-control"
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!editMode}
                />
                <label htmlFor="phone">Phone</label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating">
                <input
                  className="form-control"
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!editMode}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
          </div>

          <div className="form-floating mt-3">
            <input
              className="form-control"
              id="website"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="website">Website</label>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="whatsapp"
              value={profile.whatsapp}
              onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="whatsapp">WhatsApp (digits / +country)</label>
          </div>

          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="linkedin"
              value={profile.linkedin}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="linkedin">LinkedIn URL</label>
          </div>

          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="instagram"
              value={profile.instagram}
              onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
              disabled={!editMode}
            />
            <label htmlFor="instagram">Instagram URL</label>
          </div>

          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="slug"
              value={profile.slug}
              onChange={(e) => setProfile({ ...profile, slug: e.target.value })}
              disabled={!editMode /* slug is editable only in edit mode */}
            />
            <label htmlFor="slug">Public Slug</label>
          </div>

          <div className="small text-muted mb-3">
            Profile URL: <strong>{site}/profile/{profile.slug || 'your-slug'}</strong>
          </div>

          {/* Avatar */}
          <label className="form-label">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={onUploadAvatar}
            disabled={!editMode}
          />
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              width={96}
              height={96}
              className="rounded border"
              style={{ objectFit: 'cover' }}
              alt="avatar"
            />
          )}
        </div>
      </div>
    </div>
  )
}
