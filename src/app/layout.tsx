import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'EcoMetric - Carbon Intelligence Platform',
  description: 'Calculate your carbon footprint',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}