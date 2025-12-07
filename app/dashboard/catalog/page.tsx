"use client"

import { useState } from "react"
import { UploadDialog } from "@/components/upload-dialog"
import { EditableTable } from "@/components/editable-table"
import { mockCatalog } from "@/lib/mock-data"
import { Package, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CatalogPage() {
  const [catalog, setCatalog] = useState(mockCatalog)

  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "name", label: "Product Name", editable: true },
    { key: "brand", label: "Brand", editable: true },
    { key: "category", label: "Category", editable: true, type: "badge" as const },
    { key: "price", label: "Price (₹)", editable: true, type: "number" as const },
    { key: "rating", label: "Rating", editable: true, type: "number" as const },
    { key: "features", label: "Features", editable: true },
  ]

  const handleUpdate = (rowIndex: number, data: Record<string, string | number>) => {
    setCatalog((prev) => {
      const updated = [...prev]
      updated[rowIndex] = data as typeof catalog[0]
      return updated
    })
  }

  const handleDelete = (rowIndex: number) => {
    setCatalog((prev) => prev.filter((_, idx) => idx !== rowIndex))
  }

  const handleAdd = (data: Record<string, string | number>) => {
    const newId = `P${String(catalog.length + 1).padStart(3, "0")}`
    setCatalog((prev) => [...prev, { ...data, product_id: newId } as typeof catalog[0]])
  }

  const handleUpload = async (catalogFile: File | null, behaviourFile: File | null) => {
    // TODO: Implement actual CSV parsing and upload
    console.log("Files to upload:", { catalogFile, behaviourFile })
    // For now, simulate success
    alert("Files uploaded successfully!")
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
            <p className="text-sm text-muted-foreground">Manage your product inventory</p>
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
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{catalog.length}</div>
              <p className="text-xs text-muted-foreground">In catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(catalog.map((p) => p.category)).size}</div>
              <p className="text-xs text-muted-foreground">Unique categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(catalog.reduce((sum, p) => sum + p.price, 0) / catalog.length).toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Per product</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Data</CardTitle>
            <CardDescription>View and edit product information. Click the edit icon to modify rows.</CardDescription>
          </CardHeader>
          <CardContent>
            <EditableTable
              data={catalog}
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
