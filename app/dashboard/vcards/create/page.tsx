'use client'
import VCardForm from '@/components/VCardForm'

export default function CreateVCardPage() {
    return (
        <div className="container py-4">
            <VCardForm mode="create" />
        </div>
    )
}