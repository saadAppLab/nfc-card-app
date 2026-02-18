
'use client'
import QRCode from 'qrcode.react'

export default function ProfileCard({ profile }: { profile: any }){
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${site}/profile/${profile.slug}`
  const themeColor = profile.theme?.primary || '#3b82f6'

  function openLink(href?: string){ if (href) window.open(href, '_blank', 'noopener') }

  return (
    <div className="panel" style={{borderColor: themeColor}}>
      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        {profile.avatar_url && <img src={profile.avatar_url} alt="avatar" width={72} height={72} style={{borderRadius:12, objectFit:'cover', border:'1px solid #223042'}}/>}
        <div>
          <h2 style={{margin:'4px 0'}}>{profile.name}</h2>
          <div className="small">{profile.title}</div>
        </div>
        <div style={{marginLeft:'auto'}}>
          <QRCode value={url} size={88} bgColor="#0c121a" fgColor={themeColor} includeMargin={false} />
        </div>
      </div>
      {profile.bio && <p style={{marginTop:12}}>{profile.bio}</p>}
      <div className="grid three" style={{marginTop:12}}>
        {profile.phone && <button className="btn" onClick={()=>openLink(`tel:${profile.phone}`)}>Call</button>}
        {profile.email && <button className="btn" onClick={()=>openLink(`mailto:${profile.email}`)}>Email</button>}
        {profile.whatsapp && <button className="btn" onClick={()=>openLink(`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g,'')}`)}>WhatsApp</button>}
        {profile.linkedin && <button className="btn" onClick={()=>openLink(profile.linkedin)}>LinkedIn</button>}
        {profile.instagram && <button className="btn" onClick={()=>openLink(profile.instagram)}>Instagram</button>}
        {profile.website && <button className="btn" onClick={()=>openLink(profile.website)}>Website</button>}
      </div>
      <div style={{marginTop:16, display:'flex', gap:8, flexWrap:'wrap'}}>
        <a className="btn secondary" href={`${site}/api/vcard/${profile.slug}`}>Download vCard</a>
        <a className="btn secondary" href={url} target="_blank">Open Profile URL</a>
      </div>
    </div>
  )
}
