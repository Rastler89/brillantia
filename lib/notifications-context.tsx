"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useJewelry } from "@/lib/jewelry-context"
import { useConfig } from "@/lib/config-context"

export type Notification = {
  id: string
  type: "stock" | "sale" | "system"
  title: string
  message: string
  read: boolean
  date: string
  relatedId?: string
}

type NotificationsContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  checkLowStock: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Notificaciones iniciales de ejemplo
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "system",
    title: "Bienvenido al sistema",
    message: "Bienvenido al sistema de gestión de joyería",
    read: false,
    date: new Date().toISOString(),
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const { jewelry } = useJewelry()
  const { stockLevels } = useConfig()

  // Calcular el número de notificaciones no leídas
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Añadir una nueva notificación
  const addNotification = (notification: Omit<Notification, "id" | "date" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  // Marcar una notificación como leída
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Eliminar una notificación
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Comprobar si hay productos con stock bajo
  const checkLowStock = () => {
    // Encontrar el nivel de stock "bajo"
    const lowStockLevel = stockLevels.find((level) => level.name.toLowerCase() === "bajo")

    if (!lowStockLevel) return

    // Comprobar cada pieza de joyería
    jewelry.forEach((item) => {
      // Si el stock está en el nivel "bajo"
      if (item.stock <= lowStockLevel.max) {
        // Comprobar si ya existe una notificación para esta pieza
        const existingNotification = notifications.find((n) => n.type === "stock" && n.relatedId === item.id && !n.read)

        // Si no existe, crear una nueva notificación
        if (!existingNotification) {
          addNotification({
            type: "stock",
            title: "Stock bajo",
            message: `La pieza "${item.name}" tiene un stock bajo (${item.stock} unidades)`,
            relatedId: item.id,
          })
        }
      }
    })
  }

  // Comprobar el stock bajo al cargar el componente y cuando cambie el inventario
  useEffect(() => {
    checkLowStock()
  }, [jewelry, stockLevels])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        checkLowStock,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

