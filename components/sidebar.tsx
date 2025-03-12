"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Users,
  DraftingCompass,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/lib/notifications-context"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { unreadCount } = useNotifications()

  const handleLogout = () => {
    
    router.push("/")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Inventario",
      href: "/dashboard/inventory",
      icon: Package,
    },
    {
      title: "Moldes",
      href: "/dashboard/molds",
      icon: DraftingCompass,
    },
    {
      title: "Ventas",
      href: "/dashboard/sales",
      icon: ShoppingBag,
    },
    {
      title: "Clientes",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Reportes",
      href: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Notificaciones",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      title: "Configuración",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className={cn("relative flex flex-col h-screen", className)}>
      <div
        className={cn(
          "bg-card border-r border-border h-full transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[250px]",
        )}
      >
        {/* Header */}
        <div className="flex items-center h-[60px] border-b border-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Diamond className="h-6 w-6 text-primary" />
            {!collapsed && <span className="text-lg font-semibold">Joyería</span>}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
              {item.badge && (
                <Badge
                  className={cn(
                    "bg-primary text-primary-foreground ml-auto",
                    collapsed && "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center",
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto p-2 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0 mr-2" />
            {!collapsed && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </div>

      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </div>
  )
}

