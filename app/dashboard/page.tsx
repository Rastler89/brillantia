"use client"

import { useJewelry } from "@/lib/jewelry-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { PriceChart } from "@/components/price-chart"
import { RecentItems } from "@/components/recent-items"

export default function Dashboard() {
  const { jewelry } = useJewelry()

  // Calcular estadísticas
  const totalItems = jewelry.length
  const totalStock = jewelry.reduce((sum, item) => sum + item.stock, 0)
  const totalValue = jewelry.reduce((sum, item) => sum + item.price * item.stock, 0)
  const averagePrice = totalItems > 0 ? jewelry.reduce((sum, item) => sum + item.price, 0) / totalItems : 0

  // Formatear valores monetarios
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido, {name}</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Piezas</p>
                <h3 className="text-2xl font-bold mt-1">{totalItems}</h3>
              </div>
              <div className="p-3 rounded-full bg-primary/20">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Total</p>
                <h3 className="text-2xl font-bold mt-1">{totalStock}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Inventario</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalValue)}</h3>
              </div>
              <div className="p-3 rounded-full bg-amber-500/20">
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Precio Medio</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(averagePrice)}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Distribución de Stock</CardTitle>
            <CardDescription>Cantidad de piezas por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <StockChart data={jewelry} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Precios por Categoría</CardTitle>
            <CardDescription>Precio promedio por tipo de joya</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PriceChart data={jewelry} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Piezas recientes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Piezas Recientes</CardTitle>
          <CardDescription>Últimas piezas añadidas al inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentItems />
        </CardContent>
      </Card>
    </div>
  )
}

