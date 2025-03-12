"use client"

import { useJewelry } from "@/lib/jewelry-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

export function RecentItems() {
  const { jewelry } = useJewelry()

  // Ordenar por fecha de creación (más reciente primero) y tomar los primeros 5
  const recentItems = [...jewelry]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

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

  if (recentItems.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No hay piezas en el inventario.</div>
  }

  return (
    <div className="space-y-4">
      {recentItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src="/placeholder.svg" alt={item.name} />
              <AvatarFallback className="rounded-md bg-primary/20 text-primary">
                {item.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                  {getTypeLabel(item.type)}
                </Badge>
                <span className="text-xs text-muted-foreground">Añadido el {formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{formatPrice(item.price)}</p>
              <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
            </div>
            <Link href={`/dashboard/inventory/${item.id}`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
      <div className="text-center pt-2">
        <Link href="/dashboard/inventory">
          <Button variant="outline">Ver todo el inventario</Button>
        </Link>
      </div>
    </div>
  )
}

