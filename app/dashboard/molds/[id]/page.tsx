"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMolds, type MoldStatus, type MoldTechnique } from "@/lib/molds-context"
import { useJewelry } from "@/lib/jewelry-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Pencil,
  Trash2,
  Package,
  Calendar,
  Ruler,
  Weight,
  Layers,
  ScrollText,
  MapPin,
  ArrowUpDown,
  Gauge,
  ArchiveIcon,
  Factory,
  Wrench,
  Share2,
  XCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function MoldDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { molds, updateMold, removeMold, updateMoldUsage } = useMolds()
  const { jewelry } = useJewelry()

  const [mold, setMold] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<MoldStatus | "">("")
  const [statusNotes, setStatusNotes] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const fetchMold = async () => {
    if (params.id) {
      try {
        const res = await fetch(`/api/molds/${params.id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch molds")
        }
        const data = await res.json()
        setMold(data)
        setLoading(false)
      } catch(error) {
        console.error(error)
        setError("Error al cargar el molde")
      }
    }
  }

  // Cargar el molde
  useEffect(() => {
    fetchMold()
  }, [params.id, molds, router])

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Obtener piezas relacionadas
  const relatedJewelry = mold ? jewelry.filter((item) => mold.jewelryIds.includes(item.id)) : []

  // Mapa para mostrar nombres amigables de técnicas
  const techniqueLabels: Record<MoldTechnique, string> = {
    "cera-perdida": "Cera perdida",
    microfusion: "Microfusión",
    electroforming: "Electroforming",
    estampacion: "Estampación",
    grabado: "Grabado",
    "3d-printing": "Impresión 3D",
    otro: "Otro",
  }

  // Manejar cambio de estado
  const handleStatusChange = () => {
    if (!newStatus || !mold) return

    const now = new Date().toISOString()
    const updatedMold = {
      ...mold,
      status: newStatus,
      notes: statusNotes
        ? `${mold.notes ? mold.notes + "\n\n" : ""}[${formatDate(now)}] Cambio de estado a ${newStatus}: ${statusNotes}`
        : mold.notes,
    }

    updateMold(mold.id, updatedMold)
    setMold(updatedMold)
    setSuccess(`Estado actualizado a ${newStatus}`)
    setNewStatus("")
    setStatusNotes("")
    setIsChangeStatusDialogOpen(false)

    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  // Manejar eliminación
  const handleDelete = () => {
    if (!mold) return

    removeMold(mold.id)
    setIsDeleteDialogOpen(false)
    router.push("/dashboard/molds")
  }

  // Manejar registro de uso
  const handleRecordUsage = () => {
    if (!mold) return

    updateMoldUsage(mold.id)

    // Actualizar el molde en el estado local
    const updatedMold = {
      ...mold,
      usageCount: mold.usageCount + 1,
      lastUsed: new Date().toISOString(),
    }

    setMold(updatedMold)
    setSuccess("Uso registrado correctamente")

    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  // Iconos para acciones de cambio de estado
  const statusActions = [
    {
      status: "almacenado",
      icon: ArchiveIcon,
      label: "Guardar en Almacén",
      color: "bg-green-500/10 hover:bg-green-500/20 text-green-500",
    },
    {
      status: "produccion",
      icon: Factory,
      label: "Enviar a Producción",
      color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500",
    },
    {
      status: "mantenimiento",
      icon: Wrench,
      label: "Enviar a Mantenimiento",
      color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500",
    },
    {
      status: "prestado",
      icon: Share2,
      label: "Marcar como Prestado",
      color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-500",
    },
    {
      status: "descatalogado",
      icon: XCircle,
      label: "Descatalogar",
      color: "bg-destructive/10 hover:bg-destructive/20 text-destructive",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/molds">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{mold.name}</h1>
          <MoldStatusBadge status={mold.status} />
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/molds/${mold.id}/edit`}>
            <Button variant="outline" className="border-border">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  ¿Está seguro de que desea eliminar este molde? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {success && (
        <Alert className="bg-primary/10 border-primary/20 text-primary">
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Información del Molde</CardTitle>
              <CardDescription className="text-muted-foreground">Detalles completos del molde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Código</Label>
                  <p className="font-medium">{mold.code}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Material del Molde</Label>
                  <p className="font-medium">{mold.moldMaterial}</p>
                </div>

                {mold.location && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      Ubicación
                    </Label>
                    <p className="font-medium">{mold.location}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Gauge className="h-4 w-4 text-primary" />
                    Usos
                  </Label>
                  <p className="font-medium">{mold.usageCount}</p>
                </div>

                {mold.manufacturingDate && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      Fecha de Fabricación
                    </Label>
                    <p className="font-medium">{formatDate(mold.manufacturingDate)}</p>
                  </div>
                )}

                {mold.lastUsed && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <ArrowUpDown className="h-4 w-4 text-primary" />
                      Último Uso
                    </Label>
                    <p className="font-medium">{formatDate(mold.lastUsed)}</p>
                  </div>
                )}

                {mold.weight && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Weight className="h-4 w-4 text-primary" />
                      Peso
                    </Label>
                    <p className="font-medium">{mold.weight} g</p>
                  </div>
                )}

                {mold.dimensions && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-primary" />
                      Dimensiones
                    </Label>
                    <p className="font-medium">
                      {mold.dimensions.width && `Ancho: ${mold.dimensions.width} ${mold.dimensions.unit}`}
                      {mold.dimensions.height && ` × Alto: ${mold.dimensions.height} ${mold.dimensions.unit}`}
                      {mold.dimensions.depth && ` × Prof: ${mold.dimensions.depth} ${mold.dimensions.unit}`}
                    </p>
                  </div>
                )}
              </div>

              {mold.description && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Descripción</Label>
                  <div className="p-3 bg-secondary/50 rounded-md border border-border">
                    <p>{mold.description}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mold.castingMaterial && mold.castingMaterial.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Layers className="h-4 w-4 text-primary" />
                      Materiales para Fundición
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {mold.castingMaterial.map((material: string) => (
                        <Badge key={material} variant="outline" className="bg-primary/10">
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {mold.techniques && mold.techniques.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <ScrollText className="h-4 w-4 text-primary" />
                      Técnicas
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {mold.techniques.map((technique: MoldTechnique) => (
                        <Badge key={technique} variant="outline" className="bg-primary/10">
                          {techniqueLabels[technique]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mold.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Notas</Label>
                  <div className="p-3 bg-secondary/50 rounded-md border border-border whitespace-pre-line">
                    <p>{mold.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Piezas relacionadas */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Piezas Relacionadas</CardTitle>
              <CardDescription className="text-muted-foreground">
                Piezas de joyería que utilizan este molde
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatedJewelry.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay piezas relacionadas con este molde.</div>
              ) : (
                <div className="space-y-4">
                  {relatedJewelry.map((item) => (
                    <Link href={`/dashboard/inventory/${item.id}`} key={item.id}>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-primary/20">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - Stock: {item.stock}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/10">
                          {item.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de acciones */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-6">
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
              <CardDescription className="text-muted-foreground">Gestione el estado y uso del molde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleRecordUsage}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Gauge className="h-4 w-4 mr-2" />
                Registrar Uso
              </Button>

              <Separator />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Cambiar Estado</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Dialog open={isChangeStatusDialogOpen} onOpenChange={setIsChangeStatusDialogOpen}>
                    <DialogContent className="bg-card border-border">
                      <DialogHeader>
                        <DialogTitle>Cambiar Estado del Molde</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Seleccione el nuevo estado y añada notas si es necesario
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="newStatus">Nuevo Estado</Label>
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Seleccione un estado" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="almacenado">En Almacén</SelectItem>
                              <SelectItem value="produccion">En Producción</SelectItem>
                              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                              <SelectItem value="prestado">Prestado</SelectItem>
                              <SelectItem value="descatalogado">Descatalogado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="statusNotes">Notas (opcional)</Label>
                          <Textarea
                            id="statusNotes"
                            value={statusNotes}
                            onChange={(e) => setStatusNotes(e.target.value)}
                            placeholder="Añada notas sobre el cambio de estado..."
                            className="bg-secondary border-border"
                            rows={3}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangeStatusDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleStatusChange}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={!newStatus}
                        >
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <TooltipProvider>
                    {statusActions.map((action) => (
                      <Tooltip key={action.status}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className={`justify-start ${action.color} ${mold.status === action.status ? "border-2" : ""}`}
                            disabled={mold.status === action.status}
                            onClick={() => {
                              setNewStatus(action.status as MoldStatus)
                              setIsChangeStatusDialogOpen(true)
                            }}
                          >
                            <action.icon className="h-4 w-4 mr-2" />
                            {action.label}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cambiar estado a: {action.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

