"use client"

import type React from "react"

import { useState } from "react"
import { useJewelry } from "@/lib/jewelry-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AddJewelryForm() {
  const { addJewelry } = useJewelry()
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    material: "",
    weight: "",
    price: "",
    description: "",
    stock: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validación básica
    if (!formData.name || !formData.type || !formData.material || !formData.price || !formData.stock) {
      setError("Por favor complete todos los campos obligatorios")
      return
    }

    // Validar que precio y stock sean números
    if (isNaN(Number(formData.price)) || isNaN(Number(formData.stock))) {
      setError("El precio y el stock deben ser valores numéricos")
      return
    }

    // Agregar la pieza al contexto
    addJewelry({
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      material: formData.material,
      weight: formData.weight ? Number(formData.weight) : 0,
      price: Number(formData.price),
      description: formData.description,
      stock: Number(formData.stock),
      createdAt: new Date().toISOString(),
    })

    // Resetear el formulario
    setFormData({
      name: "",
      type: "",
      material: "",
      weight: "",
      price: "",
      description: "",
      stock: "",
    })

    setSuccess(true)

    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Agregar Nueva Pieza</CardTitle>
        <CardDescription className="text-muted-foreground">
          Complete el formulario para agregar una nueva pieza al inventario
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
              <AlertDescription>Pieza agregada correctamente</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Anillo de diamante"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="anillo">Anillo</SelectItem>
                  <SelectItem value="collar">Collar</SelectItem>
                  <SelectItem value="pulsera">Pulsera</SelectItem>
                  <SelectItem value="pendientes">Pendientes</SelectItem>
                  <SelectItem value="reloj">Reloj</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material *</Label>
              <Select value={formData.material} onValueChange={(value) => handleSelectChange("material", value)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Seleccione un material" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="oro">Oro</SelectItem>
                  <SelectItem value="plata">Plata</SelectItem>
                  <SelectItem value="platino">Platino</SelectItem>
                  <SelectItem value="acero">Acero</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="5.2"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="1500.00"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción detallada de la pieza..."
              rows={4}
              className="bg-secondary border-border"
            />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Agregar Pieza
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

