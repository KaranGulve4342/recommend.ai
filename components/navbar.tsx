"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold text-foreground">RecommendAI</span>
        </Link>

        <nav className="flex items-center gap-6" aria-label="Main navigation">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Home
          </Link>
          <Link
            href="/dashboard/recommendations"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground",
            )}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
