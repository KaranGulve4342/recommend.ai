"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, Users, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Recommendations",
    href: "/dashboard/recommendations",
    icon: Sparkles,
  },
  {
    title: "Product Catalog",
    href: "/dashboard/catalog",
    icon: Package,
  },
  {
    title: "User Behaviour",
    href: "/dashboard/behaviour",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold text-foreground">RecommendAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4" aria-label="Sidebar navigation">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          © 2025 RecommendAI
          <br />
          E-commerce Product Recommendations
        </p>
      </div>
    </div>
  )
}
