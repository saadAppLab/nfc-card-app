
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request){
  const body = await req.json().catch(()=>({})) as any
  const admin = supabaseAdmin()
  const row = {
    profile_id: body.profile_id,
    event: body.event || 'view',
    ip: (body.ip || '').toString().slice(0, 120),
    user_agent: (body.user_agent || '').toString().slice(0, 255),
    referrer: (body.referrer || '').toString().slice(0, 255)
  }
  if (!row.profile_id) return NextResponse.json({ ok:false, error:'missing profile_id' }, { status: 400 })
  await admin.from('analytics').insert(row)
  return NextResponse.json({ ok:true })
}
