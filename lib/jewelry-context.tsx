"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type JewelryItem = {
  id: string
  name: string
  type: string
  material: string
  weight: number
  price: number
  description: string
  stock: number
  createdAt: string
}

type JewelryContextType = {
  jewelry: JewelryItem[]
  addJewelry: (item: JewelryItem) => void
  removeJewelry: (id: string) => void
  updateJewelry: (id: string, item: Partial<JewelryItem>) => void
}

const JewelryContext = createContext<JewelryContextType | undefined>(undefined)

// Datos de ejemplo
const initialJewelry: JewelryItem[] = [
  {
    id: "1",
    name: "Anillo de Diamante",
    type: "anillo",
    material: "oro",
    weight: 5.2,
    price: 1500,
    description: "Anillo de oro de 18k con diamante de 0.5 quilates",
    stock: 3,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Collar de Perlas",
    type: "collar",
    material: "plata",
    weight: 25,
    price: 850,
    description: "Collar de plata con perlas cultivadas",
    stock: 5,
    createdAt: "2023-06-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Pulsera de Oro",
    type: "pulsera",
    material: "oro",
    weight: 12.8,
    price: 1200,
    description: "Pulsera de oro de 14k con diseño trenzado",
    stock: 2,
    createdAt: "2023-07-10T09:15:00Z",
  },
]

export function JewelryProvider({ children }: { children: ReactNode }) {
  const [jewelry, setJewelry] = useState<JewelryItem[]>(initialJewelry)

  const addJewelry = (item: JewelryItem) => {
    setJewelry((prev) => [...prev, item])
  }

  const removeJewelry = (id: string) => {
    setJewelry((prev) => prev.filter((item) => item.id !== id))
  }

  const updateJewelry = (id: string, updatedItem: Partial<JewelryItem>) => {
    setJewelry((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)))
  }

  return (
    <JewelryContext.Provider
      value={{
        jewelry,
        addJewelry,
        removeJewelry,
        updateJewelry,
      }}
    >
      {children}
    </JewelryContext.Provider>
  )
}

export function useJewelry() {
  const context = useContext(JewelryContext)
  if (context === undefined) {
    throw new Error("useJewelry must be used within a JewelryProvider")
  }
  return context
}

