import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/Toaster'
import XPixel from '@/components/XPixel'

// Optimize font with display swap for zero render blocking
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090a0f',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://no1domain.in/'),
  title: '',
  alternates: {
    canonical: 'https://no1domain.in/',
  },
  openGraph: {
    title: '',
    url: 'https://no1domain.in/',
    siteName: '',
  },
  twitter: {
    title: '',
  },
  icons: {
    icon: '/images/logo-transparent.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://static.ads-twitter.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('no1domain_theme');
                if (t === 'light') {
                  document.documentElement.classList.add('light-mode');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.remove('light-mode');
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch(e) {}
            `,
          }}
        />
        {/* Instant Fast Visitor & Ad Click Tracking (executes in 0.05s before React hydration) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var sid = sessionStorage.getItem('no1_visitor_session');
                var isNew = false;
                if (!sid) {
                  sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
                  sessionStorage.setItem('no1_visitor_session', sid);
                  sessionStorage.setItem('no1_is_new', '1');
                  isNew = true;
                }
                var params = new URLSearchParams(window.location.search);
                var twclid = params.get('twclid');
                if (twclid) {
                  sessionStorage.setItem('no1_twclid', twclid);
                  localStorage.setItem('no1_twclid', twclid);
                }
                if (window.location.pathname !== '/') {
                  var payload = JSON.stringify({ sessionId: sid, isNewSession: isNew });
                  if (navigator.sendBeacon) {
                    var blob = new Blob([payload], { type: 'application/json' });
                    navigator.sendBeacon('/api/track-visit', blob);
                  } else {
                    fetch('/api/track-visit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: payload,
                      keepalive: true
                    }).catch(function(){});
                  }
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-dark-50 font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <XPixel />
          {children}
          <Toaster />
        </Providers>

        {/* Defer non-critical third-party scripts to eliminate render-blocking delay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Script
          id="twitter-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('config','rgkb5');
              twq('event','PageView');
            `,
          }}
        />
      </body>
    </html>
  )
}