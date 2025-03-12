"use client"

import { useEffect, useRef } from "react"
import type { JewelryItem } from "@/lib/jewelry-context"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface StockChartProps {
  data: JewelryItem[]
}

export function StockChart({ data }: StockChartProps) {
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
          acc[type] = 0
        }
        acc[type] += item.stock
        return acc
      },
      {} as Record<string, number>,
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

    const stockValues = Object.values(typeGroups)

    // Crear el gráfico
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: stockValues,
              backgroundColor: [
                "rgba(75, 192, 192, 0.7)",
                "rgba(54, 162, 235, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 159, 64, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(255, 205, 86, 0.7)",
              ],
              borderColor: "rgba(22, 22, 22, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: "rgb(200, 200, 200)",
                padding: 15,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "rgb(255, 255, 255)",
              bodyColor: "rgb(255, 255, 255)",
              displayColors: false,
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.raw as number
                  return `${label}: ${value} unidades`
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

