import './globals.css'

export const metadata = {
  title: 'EcoMetric - Carbon Intelligence Platform',
  description: 'Calculate your carbon footprint',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}