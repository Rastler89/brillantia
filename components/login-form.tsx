"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Diamond, Lock, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación simple
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña")
      return
    }

    // En un caso real, esto sería una llamada a una API
    if (username === "admin" && password === "admin123") {
      login({
        id: "1",
        name: "Administrador",
        email: "admin@joyeria.com",
      })
      router.push("/dashboard")
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Diamond className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Joyería Elegante</h1>
        <p className="mt-2 text-muted-foreground">Acceda al sistema de gestión de inventario</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Usuario
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Iniciar Sesión
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>Usuario de demostración: admin</p>
        <p>Contraseña: admin123</p>
      </div>
    </div>
  )
}

