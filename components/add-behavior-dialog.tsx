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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

interface AddBehaviorDialogProps {
  onAdd: (data: { user_id: string; product_id: string; action: string; timestamp: string }) => Promise<void>
}

export function AddBehaviorDialog({ onAdd }: AddBehaviorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    user_id: "",
    product_id: "",
    action: "view",
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.user_id || !formData.product_id) {
      return
    }

    setIsAdding(true)

    try {
      await onAdd(formData)
      // Reset form and close dialog on success
      setFormData({
        user_id: "",
        product_id: "",
        action: "view",
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      })
      setOpen(false)
    } catch (err) {
      console.error("Failed to add behavior:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Behavior
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add User Behavior</DialogTitle>
          <DialogDescription>
            Add a new user behavior record to track user interactions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* User ID */}
            <div className="space-y-2">
              <Label htmlFor="user_id">
                User ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user_id"
                placeholder="e.g., U001"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                required
              />
            </div>

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

            {/* Action */}
            <div className="space-y-2">
              <Label htmlFor="action">
                Action <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.action}
                onValueChange={(value) => setFormData({ ...formData, action: value })}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timestamp */}
            <div className="space-y-2">
              <Label htmlFor="timestamp">
                Timestamp <span className="text-destructive">*</span>
              </Label>
              <Input
                id="timestamp"
                placeholder="YYYY-MM-DD HH:MM:SS"
                value={formData.timestamp}
                onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Format: YYYY-MM-DD HH:MM:SS
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
              {isAdding ? "Adding..." : "Add Behavior"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
