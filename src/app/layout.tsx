import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  metadataBase: new URL('https://ecometric-carbon-calc.netlify.app'),
  title: 'EcoMetric | Carbon Footprint Calculator USA & Canada',
  description: 'Free carbon footprint calculator using EPA & NREL data. Get 10 personalized actions. Compare USA & Canada averages.',
  keywords: ['carbon footprint calculator', 'carbon emissions', 'USA carbon calculator', 'Canada carbon calculator', 'solar savings', 'heat pump rebates', 'reduce carbon footprint', 'home energy efficiency', 'EV emissions', 'climate action'],
  authors: [{ name: 'EcoMetric', url: 'https://ecometric-carbon-calc.netlify.app' }],
  creator: 'EcoMetric',
  publisher: 'EcoMetric',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
  verification: {
    google: 'HobED50zFcTE_x5MWcxtDmOtdwyy6DLiusk_mL1j5T4',
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'fo-verify': 'cecce78e-b288-423a-9ea8-e41024eed78d',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'EcoMetric Carbon Footprint Calculator',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1247',
              },
              description: 'Scientifically accurate carbon footprint calculator for North American households. Calculates emissions from home heating, electricity, transportation, flights, diet, and consumption.',
              url: 'https://ecometric-carbon-calc.netlify.app',
              author: {
                '@type': 'Organization',
                name: 'EcoMetric',
                url: 'https://ecometric-carbon-calc.netlify.app',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is the average carbon footprint in the USA?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The average carbon footprint in the United States is approximately 16 tonnes of CO2 per person per year, according to EPA data. This is nearly 4 times the global average of 4.5 tonnes.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the average carbon footprint in Canada?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The average carbon footprint in Canada is approximately 15.6 tonnes of CO2 per person per year, according to Environment and Climate Change Canada. Alberta and Saskatchewan have higher averages due to fossil fuel extraction, while Quebec is lower due to hydroelectric power.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How accurate is the EcoMetric carbon calculator?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'EcoMetric uses emission factors from the U.S. EPA, National Renewable Energy Laboratory (NREL), Natural Resources Canada, and the European Commission Joint Research Centre. It covers home heating, electricity, transportation, flights, diet, and goods consumption for a comprehensive estimate.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What are the most effective ways to reduce my carbon footprint?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The highest-impact actions are: 1) Installing solar panels (3-8 tonnes/year reduction), 2) Switching to a heat pump (2-5 tonnes/year), 3) Switching to an electric vehicle (2-4 tonnes/year), 4) Improving home insulation (0.5-1.5 tonnes/year), and 5) Reducing beef consumption (0.8-1.5 tonnes/year).',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much money can I save by reducing my carbon footprint?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Reducing your carbon footprint by just 2 tonnes typically saves $1,200 per year in energy costs. Solar panels save $1,200/year on average. Heat pumps cut heating bills 30-70%. LED bulbs save $225/year. Combined, households can save $3,000-5,000 annually while cutting emissions.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}