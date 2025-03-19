"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Truck,
  Archive,
} from "lucide-react"
import { useState } from "react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/ecommerce-admin/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Pedidos",
    href: "/dashboard/ecommerce-admin/pedidos",
    icon: ShoppingBag,
  },
  {
    title: "Envios",
    href: "/dashboard/ecommerce-admin/envios",
    icon: Truck,
  },
  {
    title: "Produtos",
    href: "/dashboard/ecommerce-admin/produtos",
    icon: Package,
  },
  {
    title: "Estoque",
    href: "/dashboard/ecommerce-admin/estoque",
    icon: Archive,
  },
  {
    title: "Clientes",
    href: "/dashboard/ecommerce-admin/clientes",
    icon: Users,
  },
  {
    title: "Relatórios",
    href: "/dashboard/ecommerce-admin/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/dashboard/ecommerce-admin/configuracoes",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-bold text-xl">Les Amis</span>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium">AS</span>
              </div>
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">admin@lesamis.com</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

