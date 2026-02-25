'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type ThemeKey = 'dark-minimal' | 'soft-white'

function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function generateUniqueVcardSlug(username: string, title: string) {
    const base = `${username}-${slugify(title || 'card')}`.replace(/-+$/, '')
    let candidate = base || username
    let i = 1
    while (true) {
        const { data: exist } = await supabase.from('vcards').select('id').eq('slug', candidate).maybeSingle()
        if (!exist) return candidate
        i++
        candidate = `${base}-${i}`
    }
}

export default function VCardForm({
    mode,
    vcardId
}: {
    mode: 'create' | 'edit'
    vcardId?: string
}) {
    const [userId, setUserId] = useState<string | null>(null)
    const [username, setUsername] = useState<string>('') // for slug generation
    const [msg, setMsg] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editEnabled, setEditEnabled] = useState(mode === 'create')
    const [card, setCard] = useState<any>({
        title: '',
        theme: { key: 'dark-minimal' as ThemeKey },
        data: {
            name: '',
            role: '',
            company: '',
            bio: '',
            phone: '',
            email: '',
            whatsapp: '',
            linkedin: '',
            instagram: '',
            website: '',
            avatar_url: ''
        }
    })

    useEffect(() => {
        (async () => {
            // current user
            const u = await supabase.auth.getUser()
            if (!u.data?.user) {
                window.location.href = '/auth/login'
                return
            }
            setUserId(u.data.user.id)

            // fetch username for slug
            const { data: prof } = await supabase
                .from('profiles')
                .select('username')
                .eq('user_id', u.data.user.id)
                .single()
            setUsername(prof?.username || '')

            // load existing card if edit
            if (mode === 'edit' && vcardId) {
                const { data: existing } = await supabase.from('vcards').select('*').eq('id', vcardId).single()
                if (existing) {
                    setCard(existing)
                    setEditEnabled(false)
                }
            }

            setLoading(false)
        })()
    }, [mode, vcardId])

    async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !userId) return
        const path = `${userId}/vcard/${Date.now()}_${file.name}`
        const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
        if (error) { setMsg(error.message); return }
        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
        setCard({ ...card, data: { ...card.data, avatar_url: pub.publicUrl } })
    }

    function validate(): string | null {
        if (!card.title) return 'Title is required.'
        // add more rules if you want
        return null
    }

    async function onSave() {
        const v = validate()
        if (v) { setMsg(v); return }
        if (!userId) return
        setSaving(true); setMsg(null)

        if (mode === 'create') {
            // generate slug from username + title
            const newSlug = await generateUniqueVcardSlug(username || 'user', card.title)
            const payload = {
                user_id: userId,
                title: card.title,
                slug: newSlug,
                theme: card.theme,
                data: card.data
            }
            const { error } = await supabase.from('vcards').insert(payload)
            if (error) setMsg(error.message)
            else setMsg('Created!')
        } else {
            const payload = {
                title: card.title,
                theme: card.theme,
                data: card.data
            }
            const { error } = await supabase.from('vcards').update(payload).eq('id', vcardId)
            if (error) setMsg(error.message)
            else setMsg('Saved!')
        }

        setSaving(false)
        setEditEnabled(false)
    }

    if (loading) return <div className="card p-4 shadow-sm">Loading…</div>

    const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return (
        <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">{mode === 'create' ? 'Create vCard' : 'Edit vCard'}</h4>
                {mode === 'edit' && (
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditEnabled((e) => !e)}>
                        {editEnabled ? 'Cancel' : 'Edit'}
                    </button>
                )}
            </div>

            {msg && <div className="alert alert-warning py-2">{msg}</div>}

            {/* Basic */}
            <div className="form-floating mb-3">
                <input
                    id="title"
                    className="form-control"
                    placeholder="Title"
                    value={card.title}
                    onChange={(e) => setCard({ ...card, title: e.target.value })}
                    disabled={!editEnabled}
                />
                <label htmlFor="title">Card Title</label>
            </div>

            {/* Person */}
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="name"
                            className="form-control"
                            placeholder="Display Name"
                            value={card.data.name}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, name: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="name">Display Name</label>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="role"
                            className="form-control"
                            placeholder="Role / Title"
                            value={card.data.role}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, role: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="role">Role / Title</label>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="company"
                            className="form-control"
                            placeholder="Company"
                            value={card.data.company}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, company: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="company">Company</label>
                    </div>
                </div>
            </div>

            <div className="form-floating mt-3">
                <textarea
                    id="bio"
                    className="form-control"
                    style={{ height: 100 }}
                    placeholder="Bio"
                    value={card.data.bio}
                    onChange={(e) => setCard({ ...card, data: { ...card.data, bio: e.target.value } })}
                    disabled={!editEnabled}
                />
                <label htmlFor="bio">Bio</label>
            </div>

            {/* Contact */}
            <div className="row g-3 mt-1">
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="phone"
                            className="form-control"
                            placeholder="Phone"
                            value={card.data.phone}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, phone: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="phone">Phone</label>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="email"
                            className="form-control"
                            placeholder="Email"
                            value={card.data.email}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, email: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="wa"
                            className="form-control"
                            placeholder="WhatsApp"
                            value={card.data.whatsapp}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, whatsapp: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="wa">WhatsApp</label>
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="row g-3 mt-1">
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="linkedin"
                            className="form-control"
                            placeholder="LinkedIn URL"
                            value={card.data.linkedin}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, linkedin: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="linkedin">LinkedIn URL</label>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="instagram"
                            className="form-control"
                            placeholder="Instagram URL"
                            value={card.data.instagram}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, instagram: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="instagram">Instagram URL</label>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-floating">
                        <input
                            id="website"
                            className="form-control"
                            placeholder="Website"
                            value={card.data.website}
                            onChange={(e) => setCard({ ...card, data: { ...card.data, website: e.target.value } })}
                            disabled={!editEnabled}
                        />
                        <label htmlFor="website">Website</label>
                    </div>
                </div>
            </div>

            {/* Avatar */}
            <div className="mt-3">
                <label className="form-label">Avatar</label>
                <input type="file" accept="image/*" className="form-control" onChange={onUploadAvatar} disabled={!editEnabled} />
                {card.data.avatar_url && (
                    <img
                        src={card.data.avatar_url}
                        width={96}
                        height={96}
                        className="rounded border mt-2"
                        style={{ objectFit: 'cover' }}
                        alt="avatar"
                    />
                )}
            </div>

            <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary" onClick={onSave} disabled={saving || !editEnabled}>
                    {saving ? 'Saving…' : 'Save'}
                </button>
                {mode === 'edit' && (
                    <button className="btn btn-outline-secondary" onClick={() => setEditEnabled(true)} disabled={editEnabled}>
                        Edit
                    </button>
                )}
                {/* Quick public link preview if editing existing card */}
                {'slug' in card && card.slug && (
                    <a className="btn btn-outline-secondary" href={`${site}/card/${card.slug}`} target="_blank">
                        Open Public Page
                    </a>
                )}
            </div>
        </div>
    )
}