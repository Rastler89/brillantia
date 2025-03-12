"use client"

import { useState } from "react"
import { useMolds, type MoldStatus } from "@/lib/molds-context"
import { useJewelry } from "@/lib/jewelry-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, Gauge, ArrowUpDown, Layers, ScrollText, Package, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Componente para mostrar el estado del molde con un color apropiado
function MoldStatusBadge({ status }: { status: MoldStatus }) {
  const getStatusInfo = (status: MoldStatus) => {
    const statusMap: Record<MoldStatus, { label: string; color: string }> = {
      almacenado: { label: "En Almacén", color: "bg-green-500/20 text-green-500 border-green-500/50" },
      produccion: { label: "En Producción", color: "bg-blue-500/20 text-blue-500 border-blue-500/50" },
      mantenimiento: { label: "Mantenimiento", color: "bg-amber-500/20 text-amber-500 border-amber-500/50" },
      prestado: { label: "Prestado", color: "bg-purple-500/20 text-purple-500 border-purple-500/50" },
      descatalogado: { label: "Descatalogado", color: "bg-destructive/20 text-destructive border-destructive/50" },
    }

    return statusMap[status]
  }

  const { label, color } = getStatusInfo(status)

  return (
    <Badge variant="outline" className={color}>
      {label}
    </Badge>
  )
}

export default function MoldsPage() {
  const { molds } = useMolds()
  const { jewelry } = useJewelry()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState<MoldStatus | "all">("all")

  // Filtrar moldes
  const filteredMolds = molds
    .filter(
      (mold) =>
        mold.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mold.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mold.description && mold.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .filter((mold) => currentTab === "all" || mold.status === currentTab)

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Obtener nombres de piezas relacionadas
  const getJewelryNames = (jewelryIds: string[]) => {
    return jewelryIds
      .map((id) => {
        const item = jewelry.find((j) => j.id === id)
        return item ? item.name : "Desconocido"
      })
      .join(", ")
  }

  // Obtener el recuento de moldes por estado
  const getMoldCountsByStatus = () => {
    const counts: Record<MoldStatus | "all", number> = {
      all: molds.length,
      almacenado: 0,
      produccion: 0,
      mantenimiento: 0,
      prestado: 0,
      descatalogado: 0,
    }

    molds.forEach((mold) => {
      counts[mold.status]++
    })

    return counts
  }

  const statusCounts = getMoldCountsByStatus()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Moldes</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/molds/add">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Molde
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Inventario de Moldes</CardTitle>
          <CardDescription className="text-muted-foreground">
            Gestione y consulte todos los moldes registrados
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, código o descripción..."
                className="pl-8 bg-secondary border-border w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
            <TabsList className="mb-4 bg-secondary">
              <TabsTrigger value="all" className="relative">
                Todos
                <Badge className="ml-2 bg-primary/20 text-primary border-none">{statusCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="almacenado">
                En Almacén
                <Badge className="ml-2 bg-green-500/20 text-green-500 border-none">{statusCounts.almacenado}</Badge>
              </TabsTrigger>
              <TabsTrigger value="produccion">
                En Producción
                <Badge className="ml-2 bg-blue-500/20 text-blue-500 border-none">{statusCounts.produccion}</Badge>
              </TabsTrigger>
              <TabsTrigger value="mantenimiento">
                Mantenimiento
                <Badge className="ml-2 bg-amber-500/20 text-amber-500 border-none">{statusCounts.mantenimiento}</Badge>
              </TabsTrigger>
              <TabsTrigger value="prestado">
                Prestado
                <Badge className="ml-2 bg-purple-500/20 text-purple-500 border-none">{statusCounts.prestado}</Badge>
              </TabsTrigger>
              <TabsTrigger value="descatalogado">
                Descatalogado
                <Badge className="ml-2 bg-destructive/20 text-destructive border-none">
                  {statusCounts.descatalogado}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentTab} className="mt-0">
              {molds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay moldes registrados. Registre un nuevo molde para comenzar.
                </div>
              ) : filteredMolds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron moldes que coincidan con su búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMolds.map((mold) => (
                    <Link href={`/dashboard/molds/${mold.id}`} key={mold.id}>
                      <Card className="bg-secondary/30 hover:bg-secondary/50 transition-colors border-border h-full">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{mold.name}</h3>
                              <p className="text-sm text-muted-foreground">{mold.code}</p>
                            </div>
                            <MoldStatusBadge status={mold.status} />
                          </div>

                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-primary" />
                              <span>Material: {mold.moldMaterial}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Gauge className="h-4 w-4 text-primary" />
                              <span>Usos: {mold.usageCount}</span>
                            </div>

                            {mold.jewelryIds.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                <span>Piezas: {mold.jewelryIds.length}</span>
                              </div>
                            )}

                            {mold.techniques.length > 0 && (
                              <div className="flex items-center gap-2">
                                <ScrollText className="h-4 w-4 text-primary" />
                                <span>Técnicas: {mold.techniques.length}</span>
                              </div>
                            )}

                            {mold.lastUsed && (
                              <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-primary" />
                                <span>Último uso: {formatDate(mold.lastUsed)}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

