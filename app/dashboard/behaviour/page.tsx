"use client"

import { useState } from "react"
import { UploadDialog } from "@/components/upload-dialog"
import { EditableTable } from "@/components/editable-table"
import { mockUserBehaviour } from "@/lib/mock-data"
import { Users, Activity, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BehaviourPage() {
  const [behaviour, setBehaviour] = useState(mockUserBehaviour)

  const columns = [
    { key: "user_id", label: "User ID", editable: false },
    { key: "product_id", label: "Product ID", editable: true },
    { key: "action", label: "Action", editable: true },
    { key: "timestamp", label: "Timestamp", editable: true },
    { key: "duration_seconds", label: "Duration (s)", editable: true, type: "number" as const },
  ]

  const handleUpdate = (rowIndex: number, data: Record<string, string | number>) => {
    setBehaviour((prev) => {
      const updated = [...prev]
      updated[rowIndex] = data as typeof behaviour[0]
      return updated
    })
  }

  const handleDelete = (rowIndex: number) => {
    setBehaviour((prev) => prev.filter((_, idx) => idx !== rowIndex))
  }

  const handleAdd = (data: Record<string, string | number>) => {
    const newUserId = `U${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    setBehaviour((prev) => [...prev, { ...data, user_id: newUserId } as typeof behaviour[0]])
  }

  const handleUpload = async (catalogFile: File | null, behaviourFile: File | null) => {
    // TODO: Implement actual CSV parsing and upload
    console.log("Files to upload:", { catalogFile, behaviourFile })
    // For now, simulate success
    alert("Files uploaded successfully!")
  }

  // Calculate stats
  const uniqueUsers = new Set(behaviour.map((b) => b.user_id)).size
  const totalActions = behaviour.length
  const purchases = behaviour.filter((b) => b.action === "purchase").length

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Behaviour</h1>
            <p className="text-sm text-muted-foreground">Track user interactions and activities</p>
          </div>
          <UploadDialog onUpload={handleUpload} />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">Unique users tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActions}</div>
              <p className="text-xs text-muted-foreground">User interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases}</div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Data</CardTitle>
            <CardDescription>
              View and edit user behaviour logs. Track views, cart additions, and purchases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditableTable
              data={behaviour}
              columns={columns}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
