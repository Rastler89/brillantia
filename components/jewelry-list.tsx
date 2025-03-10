"use client"

import { useState } from "react"
import { useJewelry } from "@/lib/jewelry-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function JewelryList() {
  const { jewelry, removeJewelry } = useJewelry()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredJewelry = jewelry.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    removeJewelry(id)
    setDeleteId(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      anillo: "Anillo",
      collar: "Collar",
      pulsera: "Pulsera",
      pendientes: "Pendientes",
      reloj: "Reloj",
      otro: "Otro",
    }
    return types[type] || type
  }

  const getMaterialLabel = (material: string) => {
    const materials: Record<string, string> = {
      oro: "Oro",
      plata: "Plata",
      platino: "Platino",
      acero: "Acero",
      otro: "Otro",
    }
    return materials[material] || material
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Inventario de Joyería</CardTitle>
        <CardDescription className="text-muted-foreground">Gestione su inventario de piezas de joyería</CardDescription>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, tipo o material..."
              className="pl-8 bg-secondary border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {jewelry.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay piezas en el inventario. Agregue una nueva pieza para comenzar.
          </div>
        ) : filteredJewelry.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron resultados para "{searchTerm}".
          </div>
        ) : (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-secondary/50">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJewelry.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{getTypeLabel(item.type)}</TableCell>
                    <TableCell>{getMaterialLabel(item.material)}</TableCell>
                    <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.stock > 0 ? "outline" : "destructive"}
                        className="border-primary text-primary"
                      >
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatDate(item.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog open={deleteId === item.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(item.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              Esta acción eliminará permanentemente la pieza "{item.name}" del inventario.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-secondary/80">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

