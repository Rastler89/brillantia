import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { JewelryProvider } from "@/lib/jewelry-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Joyería Elegante - Sistema de Inventario",
  description: "Sistema de gestión de inventario para joyería",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
          <JewelryProvider>{children}</JewelryProvider>
      </body>
    </html>
  )
}



import './globals.css'