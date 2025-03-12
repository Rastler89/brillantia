"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMolds, type MoldStatus, type MoldTechnique } from "@/lib/molds-context"
import { useJewelry } from "@/lib/jewelry-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function AddMoldPage() {
  const router = useRouter()
  const { addMold } = useMolds()
  const { jewelry } = useJewelry()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "almacenado" as MoldStatus,
    location: "",
    moldMaterial: "",
    castingMaterial: [] as string[],
    techniques: [] as MoldTechnique[],
    jewelryIds: [] as string[],
    dimensions: {
      width: "",
      height: "",
      depth: "",
      unit: "mm" as "mm" | "cm",
    },
    weight: "",
    manufacturingDate: "",
    notes: "",
  })

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Manejar cambios en selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en checkboxes para castingMaterial
  const handleMaterialChange = (material: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, castingMaterial: [...prev.castingMaterial, material] }
      } else {
        return { ...prev, castingMaterial: prev.castingMaterial.filter((m) => m !== material) }
      }
    })
  }

  // Manejar cambios en checkboxes para techniques
  const handleTechniqueChange = (technique: MoldTechnique, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, techniques: [...prev.techniques, technique] }
      } else {
        return { ...prev, techniques: prev.techniques.filter((t) => t !== technique) }
      }
    })
  }

  // Manejar cambios en checkboxes para jewelryIds
  const handleJewelryChange = (jewelryId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, jewelryIds: [...prev.jewelryIds, jewelryId] }
      } else {
        return { ...prev, jewelryIds: prev.jewelryIds.filter((id) => id !== jewelryId) }
      }
    })
  }

  // Lista de técnicas disponibles
  const availableTechniques: MoldTechnique[] = [
    "cera-perdida",
    "microfusion",
    "electroforming",
    "estampacion",
    "grabado",
    "3d-printing",
    "otro",
  ]

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

  // Lista de materiales disponibles
  const availableMaterials = ["oro", "plata", "platino", "acero", "laton", "bronce", "cobre", "otro"]

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.code || !formData.name || !formData.moldMaterial) {
        setError("Por favor complete los campos obligatorios: código, nombre y material del molde")
        setIsSubmitting(false)
        return
      }

      // Crear el molde
      const moldData = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        location: formData.location,
        moldMaterial: formData.moldMaterial,
        castingMaterial: formData.castingMaterial,
        techniques: formData.techniques,
        jewelryIds: formData.jewelryIds,
        dimensions:
          formData.dimensions.width || formData.dimensions.height || formData.dimensions.depth
            ? {
                width: formData.dimensions.width ? Number(formData.dimensions.width) : undefined,
                height: formData.dimensions.height ? Number(formData.dimensions.height) : undefined,
                depth: formData.dimensions.depth ? Number(formData.dimensions.depth) : undefined,
                unit: formData.dimensions.unit,
              }
            : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        manufacturingDate: formData.manufacturingDate || undefined,
        notes: formData.notes || undefined,
      }

      // Añadir el molde
      addMold(moldData)

      setSuccess(true)

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        router.push("/dashboard/molds")
      }, 1500)
    } catch (err) {
      console.error("Error al registrar molde:", err)
      setError("Ocurrió un error al registrar el molde. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/molds">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nuevo Molde</h1>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Información del Molde</CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete el formulario para registrar un nuevo molde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-primary/10 border-primary/20 text-primary">
                <Check className="h-4 w-4" />
                <AlertDescription>Molde registrado correctamente</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="M-XXX-001"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del molde"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Estantería A, Cajón 3"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moldMaterial">Material del Molde *</Label>
                <Input
                  id="moldMaterial"
                  name="moldMaterial"
                  value={formData.moldMaterial}
                  onChange={handleChange}
                  placeholder="Ej: silicona, metal, etc."
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso (g)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Peso en gramos"
                  className="bg-secondary border-border no-spinner"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturingDate">Fecha de Fabricación</Label>
                <Input
                  id="manufacturingDate"
                  name="manufacturingDate"
                  type="date"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dimensiones</Label>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions.width">Ancho</Label>
                  <Input
                    id="dimensions.width"
                    name="dimensions.width"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    placeholder="Ancho"
                    className="bg-secondary border-border no-spinner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions.height">Alto</Label>
                  <Input
                    id="dimensions.height"
                    name="dimensions.height"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    placeholder="Alto"
                    className="bg-secondary border-border no-spinner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions.depth">Profundidad</Label>
                  <Input
                    id="dimensions.depth"
                    name="dimensions.depth"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.depth}
                    onChange={handleChange}
                    placeholder="Profundidad"
                    className="bg-secondary border-border no-spinner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions.unit">Unidad</Label>
                  <Select
                    value={formData.dimensions.unit}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          unit: value as "mm" | "cm",
                        },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Materiales para Fundición</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 rounded-md bg-secondary border border-border">
                {availableMaterials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={`material-${material}`}
                      checked={formData.castingMaterial.includes(material)}
                      onCheckedChange={(checked) => handleMaterialChange(material, checked as boolean)}
                    />
                    <Label htmlFor={`material-${material}`} className="text-sm font-normal cursor-pointer">
                      {material.charAt(0).toUpperCase() + material.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Técnicas</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 rounded-md bg-secondary border border-border">
                {availableTechniques.map((technique) => (
                  <div key={technique} className="flex items-center space-x-2">
                    <Checkbox
                      id={`technique-${technique}`}
                      checked={formData.techniques.includes(technique)}
                      onCheckedChange={(checked) => handleTechniqueChange(technique, checked as boolean)}
                    />
                    <Label htmlFor={`technique-${technique}`} className="text-sm font-normal cursor-pointer">
                      {techniqueLabels[technique]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Piezas Relacionadas</Label>
              <div className="max-h-60 overflow-y-auto p-4 rounded-md bg-secondary border border-border">
                {jewelry.length === 0 ? (
                  <p className="text-center text-muted-foreground">No hay piezas disponibles</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {jewelry.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`jewelry-${item.id}`}
                          checked={formData.jewelryIds.includes(item.id)}
                          onCheckedChange={(checked) => handleJewelryChange(item.id, checked as boolean)}
                        />
                        <Label htmlFor={`jewelry-${item.id}`} className="text-sm font-normal cursor-pointer">
                          {item.name} ({item.type})
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción detallada del molde..."
                rows={3}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notas adicionales sobre el molde..."
                rows={3}
                className="bg-secondary border-border"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Molde"}
              </Button>
              <Link href="/dashboard/molds">
                <Button variant="outline" className="border-border">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

