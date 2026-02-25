// app/layout.tsx
import AuthNavButtons from '@/components/AuthNavButtons'
import './globals.css'
import Link from 'next/link'
import Script from 'next/script'
import Marquee from '@/components/Marquee'
// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'NFC Business Card',
  description: 'Digital NFC business card profiles with QR, vCard and analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap 5 CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />

        {/* Bootstrap Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>

      <body className="bg-body text-body">
        {/* Simple server-safe header (no onClick here) */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div className="container">
            <Link href="/" className="navbar-brand fw-bold">
              NFC Card
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ms-auto gap-2">
                <li className="nav-item">
                  <Link href="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <AuthNavButtons />
                {/* <li className="nav-item">
                  <Link href="/auth/signup" className="nav-link">Create Account</Link>
                </li>
                <li className="nav-item">
                  <Link href="/auth/login" className="nav-link">Login</Link>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>

        <main className="py-4">{children}</main>

        {/* <footer className="bg-dark text-center text-secondary py-3 mt-5">
          © {new Date().getFullYear()} NFC Card
        </footer> */}
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="">
                  <p className="copyright-text">
                    © {new Date().getFullYear()} <a href="/">Taply</a>. Designed by <a href="https://www.isaadahmad.com">Saad Ahmad</a>
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <div className="footer-link-box">
                  <ul>
                    <li>
                      <Link href="/auth/login">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="#contact">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <Marquee items={["Get", "Your", "NFC", "Taply"]} speed={80} repeat={10} />
          {/* <div className="row g-0 w-100">
            <div className="col-12 text-center">
              <p className="copyright-text">
                © {new Date().getFullYear()} <a href="/">Taply</a>. Designed by <a href="https://www.isaadahmad.com">Saad Ahmad</a>
              </p>
            </div>
          </div> */}
        </footer>

        {/* Bootstrap JS Bundle (Popper included) – loaded after page is interactive */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ENjdO4Dr2bkBIFxQpeoY9F0Z2V1p2Qp3KkS7Z1Yd2Rr3nYhZr+8abtTE1Pi6jizo"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}