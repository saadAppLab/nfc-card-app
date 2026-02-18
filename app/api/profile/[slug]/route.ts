import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabaseServer'

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }>}) {
  const { slug } = await ctx.params   // ✅ unwrap

  const s = supabasePublic()
  const { data } = await s
    .from('profiles')
    .select('*')
    .eq('slug', slug)                 // ✅ use slug
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(data)
}