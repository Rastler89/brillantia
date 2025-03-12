import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { JewelryProvider } from "@/lib/jewelry-context"
import { ConfigProvider } from "@/lib/config-context"
import { NotificationsProvider } from "@/lib/notifications-context"
import { SalesProvider } from "@/lib/sales-context"
import { CustomersProvider } from "@/lib/customers-context"
import { MoldsProvider } from "@/lib/molds-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Joyería Elegante - Sistema de Inventario",
  description: "Sistema de gestión de inventario para joyería",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
          <ConfigProvider>
            <JewelryProvider>
              <CustomersProvider>
                <MoldsProvider>
                  <NotificationsProvider>
                    <SalesProvider>{children}</SalesProvider>
                  </NotificationsProvider>
                </MoldsProvider>
              </CustomersProvider>
            </JewelryProvider>
          </ConfigProvider>
      </body>
    </html>
  )
}



import './globals.css'