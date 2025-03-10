"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { JewelryList } from "@/components/jewelry-list"
import { AddJewelryForm } from "@/components/add-jewelry-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const router = useRouter()


  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Bienvenido</h1>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary">
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Inventario
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Agregar Pieza
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inventory" className="mt-6">
            <JewelryList />
          </TabsContent>
          <TabsContent value="add" className="mt-6">
            <AddJewelryForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

