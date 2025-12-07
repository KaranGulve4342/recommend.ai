"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface AddProductDialogProps {
  onAdd: (data: {
    product_id: string
    name: string
    category: string
    price: number
    rating: number
    brand: string
    features: string
  }) => Promise<void>
}

export function AddProductDialog({ onAdd }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    category: "",
    price: 0,
    rating: 0,
    brand: "",
    features: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.product_id || !formData.name || !formData.brand || !formData.category) {
      return
    }

    setIsAdding(true)

    try {
      await onAdd(formData)
      // Reset form and close dialog on success
      setFormData({
        product_id: "",
        name: "",
        category: "",
        price: 0,
        rating: 0,
        brand: "",
        features: "",
      })
      setOpen(false)
    } catch (err) {
      console.error("Failed to add product:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your catalog. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Product ID */}
            <div className="space-y-2">
              <Label htmlFor="product_id">
                Product ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product_id"
                placeholder="e.g., P001"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                required
              />
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Wireless Bluetooth Headphones"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brand"
                placeholder="e.g., SoundMax"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                placeholder="e.g., Electronics"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 2999"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label htmlFor="rating">
                Rating <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rating"
                type="number"
                placeholder="e.g., 4.5"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ""}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Rating from 0 to 5
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label htmlFor="features">
                Features <span className="text-destructive">*</span>
              </Label>
              <Input
                id="features"
                placeholder="e.g., Noise Cancellation;40hrs Battery;Foldable"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Separate features with semicolons (;)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
