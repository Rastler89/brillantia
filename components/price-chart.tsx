"use client"

import { useEffect, useRef } from "react"
import type { JewelryItem } from "@/lib/jewelry-context"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface PriceChartProps {
  data: JewelryItem[]
}

export function PriceChart({ data }: PriceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Procesar datos para el gráfico
    const typeGroups = data.reduce(
      (acc, item) => {
        const type = item.type
        if (!acc[type]) {
          acc[type] = { total: 0, count: 0 }
        }
        acc[type].total += item.price
        acc[type].count += 1
        return acc
      },
      {} as Record<string, { total: number; count: number }>,
    )

    const labels = Object.keys(typeGroups).map((type) => {
      const typeLabels: Record<string, string> = {
        anillo: "Anillos",
        collar: "Collares",
        pulsera: "Pulseras",
        pendientes: "Pendientes",
        reloj: "Relojes",
        otro: "Otros",
      }
      return typeLabels[type] || type
    })

    const averagePrices = Object.entries(typeGroups).map(([_, value]) =>
      value.count > 0 ? value.total / value.count : 0,
    )

    // Crear el gráfico
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Precio Promedio (€)",
              data: averagePrices,
              backgroundColor: "rgba(75, 192, 192, 0.7)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(200, 200, 200, 0.1)",
              },
              ticks: {
                color: "rgb(200, 200, 200)",
                callback: (value) => value + " €",
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "rgb(200, 200, 200)",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "rgb(255, 255, 255)",
              bodyColor: "rgb(255, 255, 255)",
              callbacks: {
                label: (context) => {
                  const value = context.raw as number
                  return `${value.toFixed(2)} €`
                },
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}

