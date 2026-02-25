'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function VCardsListPage() {
    const [user, setUser] = useState<any>(null)
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const { data } = await supabase.auth.getUser()
                if (!mounted) return
                if (!data?.user) { window.location.href = '/auth/login'; return }
                setUser(data.user)

                const { data: cards } = await supabase
                    .from('vcards')
                    .select('*')
                    .eq('user_id', data.user.id)
                    .order('created_at', { ascending: false })
                setRows(cards || [])
                setLoading(false)
            })()
        return () => { mounted = false }
    }, [])

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">
                    <i className="bi bi-collection me-2" />
                    My vCards
                </h3>
                <Link href="/dashboard/vcards/create">
                    <i className="bi bi-plus-lg me-1" />
                    Create New
                </Link>
            </div>

            {
                rows.length === 0 ? (
                    <div className="alert alert-info">No cards yet. Click “Create New”.</div>
                ) : (
                    <div className="row g-3">
                        {rows.map((c) => (
                            <div className="col-md-6" key={c.id}>
                                <div className="card p-3 shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-semibold">{c.title || 'Untitled Card'}</div>
                                            <div className="text-muted small">/card/{c.slug}</div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link
                                                href={`/dashboard/vcards/${c.id}/edit`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="bi bi-pencil-square me-1" />
                                                Edit
                                            </Link>
                                            <a className="btn btn-sm btn-outline-secondary" href={`/card/${c.slug}`} target="_blank">
                                                <i className="bi bi-box-arrow-up-right me-1" />
                                                View
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div >
                )
            }
        </div >
    )
}