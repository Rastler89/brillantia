"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type MoldStatus =
  | "almacenado" // En almacén
  | "produccion" // En producción/forja
  | "mantenimiento" // En mantenimiento/reparación
  | "prestado" // Prestado a otro artesano
  | "descatalogado" // Ya no se usa

export type MoldTechnique =
  | "cera-perdida"
  | "microfusion"
  | "electroforming"
  | "estampacion"
  | "grabado"
  | "3d-printing"
  | "otro"

export type Mold = {
  id: string
  code: string // Código único del molde
  name: string
  description?: string
  status: MoldStatus
  location?: string // Ubicación específica donde se guarda
  moldMaterial: string // Material del molde (silicona, metal, etc.)
  castingMaterial: string[] // Materiales que se pueden usar con este molde
  techniques: MoldTechnique[] // Técnicas asociadas
  jewelryIds: string[] // IDs de las piezas relacionadas
  dimensions?: {
    width?: number
    height?: number
    depth?: number
    unit: "mm" | "cm"
  }
  weight?: number // Peso en gramos
  manufacturingDate?: string // Fecha de fabricación
  lastUsed?: string // Última vez usado
  usageCount: number // Cuántas veces se ha usado
  notes?: string
  images?: string[] // URLs de imágenes
  createdAt: string
}

type MoldsContextType = {
  molds: Mold[]
  addMold: (mold: Omit<Mold, "id" | "createdAt" | "usageCount">) => void
  updateMold: (id: string, mold: Partial<Mold>) => void
  removeMold: (id: string) => void
  getMoldById: (id: string) => Mold | undefined
  getMoldsByJewelryId: (jewelryId: string) => Mold[]
  updateMoldUsage: (id: string) => void
  linkMoldToJewelry: (moldId: string, jewelryId: string) => void
  unlinkMoldFromJewelry: (moldId: string, jewelryId: string) => void
}

const MoldsContext = createContext<MoldsContextType | undefined>(undefined)


export function MoldsProvider({ children }: { children: ReactNode }) {
  const [molds, setMolds] = useState<Mold[]>([])

  const fetchMolds = async () => {
    try {
      const res = await fetch("/api/molds")
      if (!res.ok) {
        throw new Error("Failed to fetch molds")
      }
      const data = await res.json()

      const formattedData = data.map((mold:any) => ({
        ...mold,
        jewelryIds: mold.jewelryIds ?? [], // Si es undefined, poner un array vacío
        techniques: mold.techniques ?? [], // Si es undefined, poner un array vacío
        
      }));

      console.log(data)
      setMolds(formattedData) 
    } catch(error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchMolds()
  }, [])

  const addMold = (mold: Omit<Mold, "id" | "createdAt" | "usageCount">) => {
    const newMold: Mold = {
      ...mold,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      usageCount: 0,
    }
    setMolds((prev) => [...prev, newMold])
  }

  const updateMold = (id: string, updatedMold: Partial<Mold>) => {
    setMolds((prev) => prev.map((mold) => (mold.id === id ? { ...mold, ...updatedMold } : mold)))
  }

  const removeMold = (id: string) => {
    setMolds((prev) => prev.filter((mold) => mold.id !== id))
  }

  const getMoldById = (id: string) => {
    return molds.find((mold) => mold.id === id)
  }

  const getMoldsByJewelryId = (jewelryId: string): Mold[] => {
    return molds.filter((mold) => mold.jewelryIds.includes(jewelryId))
  }

  const updateMoldUsage = (id: string) => {
    setMolds((prev) =>
      prev.map((mold) =>
        mold.id === id
          ? {
              ...mold,
              lastUsed: new Date().toISOString(),
              usageCount: mold.usageCount + 1,
            }
          : mold,
      ),
    )
  }

  const linkMoldToJewelry = (moldId: string, jewelryId: string) => {
    setMolds((prev) =>
      prev.map((mold) =>
        mold.id === moldId
          ? {
              ...mold,
              jewelryIds: mold.jewelryIds.includes(jewelryId) ? mold.jewelryIds : [...mold.jewelryIds, jewelryId],
            }
          : mold,
      ),
    )
  }

  const unlinkMoldFromJewelry = (moldId: string, jewelryId: string) => {
    setMolds((prev) =>
      prev.map((mold) =>
        mold.id === moldId
          ? {
              ...mold,
              jewelryIds: mold.jewelryIds.filter((id) => id !== jewelryId),
            }
          : mold,
      ),
    )
  }

  return (
    <MoldsContext.Provider
      value={{
        molds,
        addMold,
        updateMold,
        removeMold,
        getMoldById,
        getMoldsByJewelryId,
        updateMoldUsage,
        linkMoldToJewelry,
        unlinkMoldFromJewelry,
      }}
    >
      {children}
    </MoldsContext.Provider>
  )
}

export function useMolds() {
  const context = useContext(MoldsContext)
  if (context === undefined) {
    throw new Error("useMolds must be used within a MoldsProvider")
  }
  return context
}

