"use client"

import { useState, useEffect, useCallback } from "react"
import { UploadDialog } from "@/components/upload-dialog"
import { AddProductDialog } from "@/components/add-product-dialog"
import { EditableTable } from "@/components/editable-table"
import { mockCatalog } from "@/lib/mock-data"
import { Package, Database, RefreshCw, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProducts,
  uploadUserBehavior,
  type Product
} from "@/lib/api"

interface CatalogItem {
  product_id: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
  features: string
}

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>(mockCatalog)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "name", label: "Product Name", editable: true },
    { key: "brand", label: "Brand", editable: true },
    { key: "category", label: "Category", editable: true, type: "badge" as const },
    { key: "price", label: "Price (₹)", editable: true, type: "number" as const },
    { key: "rating", label: "Rating", editable: true, type: "number" as const },
    { key: "features", label: "Features", editable: true },
  ]

  // Fetch products from API
  const fetchProducts = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true)
      const data = await getProducts()
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setCatalog(data)
      } else if (data?.products && Array.isArray(data.products)) {
        setCatalog(data.products)
      } else if (data?.data && Array.isArray(data.data)) {
        setCatalog(data.data)
      }
      
      if (showToast) {
        toast.success("Products refreshed successfully")
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      if (showToast) {
        toast.error("Failed to fetch products", {
          description: error instanceof Error ? error.message : "Using local data"
        })
      }
      // Keep using mock data on error
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Load products on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleUpdate = async (rowIndex: number, data: Record<string, string | number>) => {
    const item = catalog[rowIndex]
    const productId = item.product_id
    
    try {
      // Prepare product data for API
      const productData: Product = {
        product_id: productId,
        name: String(data.name),
        brand: String(data.brand),
        category: String(data.category),
        price: Number(data.price),
        rating: Number(data.rating),
        features: String(data.features),
      }
      
      await updateProduct(productId, productData)
      
      // Update local state
      setCatalog((prev) => {
        const updated = [...prev]
        updated[rowIndex] = { ...data, product_id: productId } as CatalogItem
        return updated
      })
      
      toast.success("Product updated successfully")
    } catch (error) {
      console.error("Failed to update product:", error)
      toast.error("Failed to update product", {
        description: error instanceof Error ? error.message : "Please try again"
      })
      // Still update locally for better UX
      setCatalog((prev) => {
        const updated = [...prev]
        updated[rowIndex] = { ...prev[rowIndex], ...data } as CatalogItem
        return updated
      })
    }
  }

  const handleDelete = async (rowIndex: number) => {
    const item = catalog[rowIndex]
    const productId = item.product_id
    
    try {
      await deleteProduct(productId)
      setCatalog((prev) => prev.filter((_, idx) => idx !== rowIndex))
      toast.success("Product deleted successfully")
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product", {
        description: error instanceof Error ? error.message : "Please try again"
      })
      // Still delete locally for better UX
      setCatalog((prev) => prev.filter((_, idx) => idx !== rowIndex))
    }
  }

  const handleAddFromDialog = async (data: {
    product_id: string
    name: string
    category: string
    price: number
    rating: number
    brand: string
    features: string
  }) => {
    try {
      const productData: Product = {
        product_id: data.product_id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price,
        rating: data.rating,
        features: data.features,
      }
      
      const result = await addProduct(productData)
      
      // Use returned data or the input
      const newProduct: CatalogItem = {
        ...productData,
        product_id: result?.product_id || data.product_id,
      }
      
      setCatalog((prev) => [...prev, newProduct])
      toast.success("Product added successfully")
    } catch (error) {
      console.error("Failed to add product:", error)
      toast.error("Failed to add product", {
        description: error instanceof Error ? error.message : "Please try again"
      })
      throw error // Re-throw to let dialog handle it
    }
  }

  const handleUpload = async (catalogFile: File | null, behaviourFile: File | null) => {
    setIsLoading(true)
    
    try {
      if (catalogFile) {
        await uploadProducts(catalogFile)
        toast.success("Products uploaded successfully")
      }
      
      if (behaviourFile) {
        await uploadUserBehavior(behaviourFile)
        toast.success("User behavior uploaded successfully")
      }
      
      // Refresh products after upload
      await fetchProducts()
      
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again"
      })
    } finally {
      setIsLoading(false)
    }
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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchProducts(true)}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <AddProductDialog onAdd={handleAddFromDialog} />
            <UploadDialog onUpload={handleUpload} />
          </div>
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
              data={catalog as unknown as Record<string, string | number>[]}
              columns={columns}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
