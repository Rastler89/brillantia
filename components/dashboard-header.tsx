"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Diamond, LogOut, User } from "lucide-react"
import { signOut } from "next-auth/react"

export function DashboardHeader() {
  const router = useRouter()


  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Diamond className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Joyería Elegante</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium"></span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}

