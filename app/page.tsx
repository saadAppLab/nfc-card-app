
import Link from 'next/link'

export default function HomePage(){
  return (
    <div className="container">
      <section className="panel" style={{textAlign:'center'}}>
        <h1 style={{fontSize:36, marginBottom: 8}}>Tap. Scan. Connect.</h1>
        <p className="small" style={{maxWidth: 640, margin: '0 auto'}}>
          Create a beautiful digital business card with NFC + QR + vCard download. Update your details anytime without reprinting.
        </p>
        <div style={{marginTop:24, display:'flex', gap:12, justifyContent:'center'}}>
          <Link className="btn" href="/login">Get Started</Link>
          <Link className="btn secondary" href="/profile/demo-user">View Demo</Link>
        </div>
      </section>
    </div>
  )
}
