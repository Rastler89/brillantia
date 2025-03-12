"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useJewelry } from "@/lib/jewelry-context"
import { useNotifications } from "@/lib/notifications-context"
import { useCustomers } from "@/lib/customers-context"

export type SaleChannel = "tienda" | "feria" | "etsy" | "otro"

export type SaleStatus = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado"

export type SaleItem = {
  jewelryId: string
  quantity: number
  pricePerUnit: number
}

export type Sale = {
  id: string
  date: string
  channel: SaleChannel
  status: SaleStatus
  customerId: string // ID del cliente en lugar de nombre y email
  items: SaleItem[]
  total: number
  notes?: string
  // Campos específicos para ventas en ferias
  fairName?: string
  fairLocation?: string
  // Campos específicos para ventas en Etsy
  etsyOrderId?: string
  trackingNumber?: string
  shippingDate?: string
}

type SalesContextType = {
  sales: Sale[]
  addSale: (sale: Omit<Sale, "id" | "date" | "total">) => void
  updateSaleStatus: (id: string, status: SaleStatus) => void
  updateSale: (id: string, sale: Partial<Sale>) => void
  deleteSale: (id: string) => void
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

// Ventas iniciales de ejemplo
const initialSales: Sale[] = [
  {
    id: "1",
    date: "2023-05-15T10:30:00Z",
    channel: "tienda",
    status: "pagado",
    customerId: "1", // María García
    items: [
      {
        jewelryId: "1",
        quantity: 1,
        pricePerUnit: 1500,
      },
    ],
    total: 1500,
    notes: "Cliente habitual",
  },
  {
    id: "2",
    date: "2023-06-20T14:45:00Z",
    channel: "etsy",
    status: "enviado",
    customerId: "2", // Juan Rodríguez
    items: [
      {
        jewelryId: "2",
        quantity: 1,
        pricePerUnit: 850,
      },
    ],
    total: 850,
    notes: "Envío internacional",
    etsyOrderId: "ETSY12345",
    trackingNumber: "TRACK98765",
    shippingDate: "2023-06-21T10:00:00Z",
  },
]

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const { jewelry, updateJewelry } = useJewelry()
  const { addNotification } = useNotifications()
  const { updateCustomerPurchase } = useCustomers()

  // Añadir una nueva venta
  const addSale = (sale: Omit<Sale, "id" | "date" | "total">) => {
    // Calcular el total de la venta
    const total = sale.items.reduce((sum, item) => {
      return sum + item.quantity * item.pricePerUnit
    }, 0)

    // Fecha actual
    const currentDate = new Date().toISOString()

    // Crear la nueva venta
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      date: currentDate,
      total,
    }

    // Actualizar el stock de cada pieza vendida
    sale.items.forEach((item) => {
      const jewelryItem = jewelry.find((j) => j.id === item.jewelryId)
      if (jewelryItem) {
        const newStock = Math.max(0, jewelryItem.stock - item.quantity)
        updateJewelry(item.jewelryId, { stock: newStock })
      }
    })

    // Actualizar información del cliente
    updateCustomerPurchase(sale.customerId, currentDate)

    // Añadir la venta
    setSales((prev) => [newSale, ...prev])

    // Crear notificación
    addNotification({
      type: "sale",
      title: "Nueva venta registrada",
      message: `Se ha registrado una nueva venta por ${total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`,
      relatedId: newSale.id,
    })
  }

  // Actualizar el estado de una venta
  const updateSaleStatus = (id: string, status: SaleStatus) => {
    setSales((prev) => prev.map((sale) => (sale.id === id ? { ...sale, status } : sale)))

    // Crear notificación
    const sale = sales.find((s) => s.id === id)
    if (sale) {
      addNotification({
        type: "sale",
        title: "Estado de venta actualizado",
        message: `La venta ha cambiado a estado: ${status}`,
        relatedId: id,
      })
    }
  }

  // Actualizar una venta
  const updateSale = (id: string, updatedSale: Partial<Sale>) => {
    setSales((prev) => prev.map((sale) => (sale.id === id ? { ...sale, ...updatedSale } : sale)))
  }

  // Eliminar una venta
  const deleteSale = (id: string) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id))
  }

  return (
    <SalesContext.Provider
      value={{
        sales,
        addSale,
        updateSaleStatus,
        updateSale,
        deleteSale,
      }}
    >
      {children}
    </SalesContext.Provider>
  )
}

export function useSales() {
  const context = useContext(SalesContext)
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider")
  }
  return context
}

