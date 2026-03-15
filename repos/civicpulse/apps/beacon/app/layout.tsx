import type { Metadata, Viewport } from "next"
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "CivicPulse — Calbayog City Safety Dashboard",
  description:
    "Real-time city safety and risk management dashboard for emergency coordinators.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-background font-sans text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
