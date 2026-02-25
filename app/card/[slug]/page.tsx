'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import QRCode from 'qrcode.react'

export default function PublicCardPage() {
    const { slug } = useParams() as { slug: string }
    const [card, setCard] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (!slug) return
            ; (async () => {
                setLoading(true)
                const { data, error } = await supabase
                    .from('vcards')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (error || !data) { setNotFound(true); setLoading(false); return }
                setCard(data)
                setLoading(false)

                // optional analytics
                fetch('/api/track', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        profile_id: data.id,           // you can rename to vcard_id in your API if you prefer
                        event: 'vcard:view',
                        referrer: document.referrer,
                        user_agent: navigator.userAgent,
                        ip: 'client',
                    }),
                }).catch(() => { })
            })()
    }, [slug])

    if (loading) {
        return <div className="container text-center mt-5"><div className="spinner-border text-primary" /></div>
    }
    if (notFound || !card) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center shadow-sm p-4">
                    <h4 className="mb-0">
                        <i className="bi bi-exclamation-triangle me-2" />
                        vCard not found
                    </h4>
                </div>
            </div>
        )
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = `${site}/card/${card.slug}`
    const d = card.data || {}
    const open = (href?: string) => href && window.open(href, '_blank', 'noopener')

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: 760 }}>
                <div className="d-flex align-items-center gap-3">
                    {d.avatar_url && <img src={d.avatar_url} width={84} height={84} className="rounded border" style={{ objectFit: 'cover' }} alt="avatar" />}
                    <div>
                        <h4 className="mb-1">{d.name || 'Your Name'}</h4>
                        <div className="text-muted">{[d.role, d.company].filter(Boolean).join(' • ')}</div>
                    </div>
                    <div className="ms-auto">
                        <QRCode value={url} size={90} />
                    </div>
                </div>

                {d.bio && <p className="mt-3 mb-2">{d.bio}</p>}

                <div className="d-flex flex-wrap gap-2 mt-2">
                    {d.phone && <button className="btn btn-primary" onClick={() => open(`tel:${d.phone}`)}><i className="bi bi-telephone me-2" />Call</button>}
                    {d.email && <button className="btn btn-secondary" onClick={() => open(`mailto:${d.email}`)}><i className="bi bi-envelope me-2" />Email</button>}
                    {d.whatsapp && <button className="btn btn-success" onClick={() => open(`https://wa.me/${String(d.whatsapp).replace(/[^0-9]/g, '')}`)}><i className="bi bi-whatsapp me-2" />WhatsApp</button>}
                    {d.linkedin && <button className="btn btn-outline-primary" onClick={() => open(d.linkedin)}><i className="bi bi-linkedin me-2" />LinkedIn</button>}
                    {d.instagram && <button className="btn btn-outline-danger" onClick={() => open(d.instagram)}><i className="bi bi-instagram me-2" />Instagram</button>}
                    {d.website && <button className="btn btn-outline-dark" onClick={() => open(d.website)}><i className="bi bi-globe me-2" />Website</button>}
                </div>

                <div className="d-flex gap-3 mt-4">
                    <a className="btn btn-outline-secondary" href={`${site}/api/vcard/${card.slug}`}>
                        <i className="bi bi-file-earmark-person me-2" />
                        Download vCard
                    </a>
                    <a className="btn btn-outline-secondary" href={url} target="_blank">
                        <i className="bi bi-link-45deg me-2" />
                        Open Public Page
                    </a>
                </div>
            </div>
        </div>
    )
}