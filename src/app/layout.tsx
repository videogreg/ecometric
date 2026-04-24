import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  metadataBase: new URL('https://ecometric-carbon-calc.netlify.app'),
  title: 'EcoMetric | Carbon Footprint Calculator USA & Canada',
  description: 'Free carbon footprint calculator using EPA & NREL data. Get 10 personalized actions. Compare USA & Canada averages.',
  openGraph: {
    title: 'EcoMetric | Carbon Footprint Calculator USA & Canada',
    description: 'Free carbon footprint calculator using EPA & NREL data. Get 10 personalized actions. Compare USA & Canada averages.',
    url: 'https://ecometric-carbon-calc.netlify.app',
    siteName: 'EcoMetric',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoMetric Carbon Footprint Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoMetric | Carbon Footprint Calculator USA & Canada',
    description: 'Free carbon footprint calculator using EPA & NREL data. Get 10 personalized actions. Compare USA & Canada averages.',
    images: ['/og-image.jpg'],
    creator: '@ecometric',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}