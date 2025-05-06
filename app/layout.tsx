import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthLayout } from './components/AuthLayout'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gametamin - Achieve Together",
  description: "Great products are created by great teams",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthLayout>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthLayout>
      </body>
    </html>
  )
}
