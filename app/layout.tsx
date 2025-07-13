import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FridgeTrack - Smart Food Waste Management | Save Money & Help Planet",
  description:
    "Track grocery expiry dates, get smart reminders, and discover recipes for expiring items. Join thousands saving $1,500+ annually while reducing food waste.",
  keywords:
    "food waste, expiry tracking, grocery management, save money, sustainability, meal planning, recipe suggestions",
  authors: [{ name: "FridgeTrack Team" }],
  creator: "FridgeTrack",
  publisher: "FridgeTrack",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fridgetrack.com",
    title: "FridgeTrack - Smart Food Waste Management",
    description: "Save money and help the planet by tracking food expiry dates and reducing waste.",
    siteName: "FridgeTrack",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FridgeTrack - Smart Food Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FridgeTrack - Smart Food Waste Management",
    description: "Save money and help the planet by tracking food expiry dates and reducing waste.",
    images: ["/og-image.jpg"],
    creator: "@fridgetrack",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#16a34a",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FridgeTrack" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Register service worker for PWA
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
              
              // Analytics (replace with your tracking ID)
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
              
              ga('create', 'UA-XXXXXXXX-X', 'auto');
              ga('send', 'pageview');
            `,
          }}
        />
      </body>
    </html>
  )
}
