import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
