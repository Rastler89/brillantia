"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type StockLevel = {
  name: string
  min: number
  max: number
  color: string
}

type ConfigContextType = {
  stockLevels: StockLevel[]
  updateStockLevels: (levels: StockLevel[]) => void
  collections: Collection[]
  addCollection: (collection: Collection) => void
  updateCollection: (id: string, collection: Partial<Collection>) => void
  removeCollection: (id: string) => void
  materials: Material[]
  addMaterial: (material: Material) => void
  updateMaterial: (id: string, material: Partial<Material>) => void
  removeMaterial: (id: string) => void
}

export type Collection = {
  id: string
  name: string
  description: string
  createdAt: string
}

export type Material = {
  id: string
  name: string
  description: string
}

const initialStockLevels: StockLevel[] = [
  { name: "Bajo", min: 0, max: 3, color: "destructive" },
  { name: "Medio", min: 4, max: 10, color: "warning" },
  { name: "Alto", min: 11, max: 999, color: "success" },
]

const initialCollections: Collection[] = [
  {
    id: "1",
    name: "Primavera 2023",
    description: "Colección inspirada en la naturaleza y los colores de la primavera",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Clásicos",
    description: "Piezas atemporales que nunca pasan de moda",
    createdAt: "2023-02-20T14:45:00Z",
  },
]

const initialMaterials: Material[] = [
  { id: "oro", name: "Oro", description: "Oro de 18 quilates" },
  { id: "plata", name: "Plata", description: "Plata de ley 925" },
  { id: "platino", name: "Platino", description: "Platino puro" },
  { id: "diamante", name: "Diamante", description: "Diamantes de alta calidad" },
  { id: "perla", name: "Perla", description: "Perlas cultivadas" },
  { id: "zafiro", name: "Zafiro", description: "Zafiros azules" },
  { id: "rubi", name: "Rubí", description: "Rubíes rojos intensos" },
  { id: "esmeralda", name: "Esmeralda", description: "Esmeraldas verdes" },
  { id: "acero", name: "Acero", description: "Acero inoxidable" },
]

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>(initialStockLevels)
  const [collections, setCollections] = useState<Collection[]>(initialCollections)
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)

  const updateStockLevels = (levels: StockLevel[]) => {
    setStockLevels(levels)
  }

  const addCollection = (collection: Collection) => {
    setCollections((prev) => [...prev, collection])
  }

  const updateCollection = (id: string, updatedCollection: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((collection) => (collection.id === id ? { ...collection, ...updatedCollection } : collection)),
    )
  }

  const removeCollection = (id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id))
  }

  const addMaterial = (material: Material) => {
    setMaterials((prev) => [...prev, material])
  }

  const updateMaterial = (id: string, updatedMaterial: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((material) => (material.id === id ? { ...material, ...updatedMaterial } : material)),
    )
  }

  const removeMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((material) => material.id !== id))
  }

  return (
    <ConfigContext.Provider
      value={{
        stockLevels,
        updateStockLevels,
        collections,
        addCollection,
        updateCollection,
        removeCollection,
        materials,
        addMaterial,
        updateMaterial,
        removeMaterial,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}

