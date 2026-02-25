'use client'
import { useParams } from 'next/navigation'
import VCardForm from '@/components/VCardForm'

export default function EditVCardPage() {
    const { id } = useParams() as { id: string }

    return (
        <div className="container py-4">
            <VCardForm mode="edit" vcardId={id} />
        </div>
    )
}