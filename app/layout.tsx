import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Playfair_Display } from "next/font/google"
import { Suspense } from "react"

import { SiteFooter } from "@/components/footer"

import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex-1">{children}</div>
          </Suspense>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
