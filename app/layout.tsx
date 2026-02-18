
import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'NFC Business Card',
  description: 'Digital NFC business card profiles with QR, vCard and analytics.'
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body>
        <header style={{borderBottom:'1px solid #1f2937'}}>
          <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
            <Link href="/" style={{fontWeight:800, fontSize:18}}>NFC Card</Link>
            <nav style={{display:'flex', gap:12}}>
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer style={{borderTop:'1px solid #1f2937', marginTop: 40}}>
          <div className="container small">© {new Date().getFullYear()} NFC Card</div>
        </footer>
      </body>
    </html>
  )
}
