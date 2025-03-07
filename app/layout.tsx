import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Digital Detective | Browser Fingerprinting Demo by WorkOS',
  description: 'An educational demonstration of browser fingerprinting techniques. See how your browser creates a unique digital fingerprint through canvas rendering, WebGL capabilities, audio processing, and more.',
  generator: 'Next.js',
  authors: [{ name: 'WorkOS' }],
  keywords: ['browser fingerprinting', 'digital fingerprint', 'device fingerprinting', 'web security', 'WorkOS'],
  openGraph: {
    title: 'Digital Detective | Browser Fingerprinting Demo',
    description: 'Explore how your browser creates a unique digital fingerprint through various technical characteristics.',
    url: 'https://workos.com',
    siteName: 'WorkOS',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
