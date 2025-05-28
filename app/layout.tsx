import type React from "react"
import "./globals.css"
import { Raleway } from "next/font/google"
import Navbar from "@/components/Navbar"
import FloatingMenuButton from "@/components/FloatingMenuButton"
import TopFloatingMenuButton from "@/components/TopFloatingMenuButton"
import Sparkles from "@/components/Sparkles"
import { UIOverlayProvider } from "@/contexts/ui-overlay-context" // Import the new provider

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
})

export const metadata = {
  title: "HODL - Heroes Of Diamond Legacy",
  description: "A tribute to those who hold strong and believe in the power of community.",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HODL%20AVATAR.jpg-modified-w4joFEAgrHTvn2HRDbp3FN8k8NfBMP.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HODL%20AVATAR.jpg-modified-w4joFEAgrHTvn2HRDbp3FN8k8NfBMP.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HODL%20AVATAR.jpg-modified-w4joFEAgrHTvn2HRDbp3FN8k8NfBMP.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  themeColor: "#0a1525",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HODL%20AVATAR.jpg-modified-w4joFEAgrHTvn2HRDbp3FN8k8NfBMP.png"
        />
        <link
          rel="apple-touch-icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HODL%20AVATAR.jpg-modified-w4joFEAgrHTvn2HRDbp3FN8k8NfBMP.png"
        />
        <meta name="theme-color" content="#0a1525" />
      </head>
      <body className={`font-raleway antialiased bg-[#0a1525] text-white`}>
        <UIOverlayProvider> {/* Wrap content with the provider */}
          <Sparkles instanceId="global" />
          <Navbar />
          <TopFloatingMenuButton />
          {children}
          <FloatingMenuButton />
        </UIOverlayProvider>
      </body>
    </html>
  )
}