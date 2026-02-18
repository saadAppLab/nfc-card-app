import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabaseServer'
import { toVCard } from '@/utils/vcard'

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }>}) {
  const { slug } = await ctx.params  // unwrap params once for Next 15/16

  const s = supabasePublic()
  const { data: profile } = await s
    .from('profiles')
    .select('name,title,phone,email,website')
    .eq('slug', slug)
    .single()

  if (!profile) {
    return new NextResponse('Not found', { status: 404 })
  }

  const vcf = toVCard(profile)

  return new NextResponse(vcf, {
    headers: {
      'content-type': 'text/vcard; charset=utf-8',
      'content-disposition': `attachment; filename="${slug}.vcf"`
    }
  })
}
``