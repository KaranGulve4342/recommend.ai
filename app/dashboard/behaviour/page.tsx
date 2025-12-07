"use client"

import { useState, useEffect, useCallback } from "react"
import { UploadDialog } from "@/components/upload-dialog"
import { AddBehaviorDialog } from "@/components/add-behavior-dialog"
import { EditableTable } from "@/components/editable-table"
import { mockUserBehaviour } from "@/lib/mock-data"
import { Users, Activity, ShoppingCart, RefreshCw, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  getBehaviors,
  addBehavior,
  updateBehavior,
  deleteBehavior,
  uploadProducts,
  uploadUserBehavior,
  type UserBehavior
} from "@/lib/api"

interface BehaviorItem {
  user_id: string
  product_id: string
  action: string
  timestamp: string
  behavior_id?: string
  _id?: string
}

export default function BehaviourPage() {
  const [behaviour, setBehaviour] = useState<BehaviorItem[]>(mockUserBehaviour)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const columns = [
    { key: "user_id", label: "User ID", editable: false },
    { key: "product_id", label: "Product ID", editable: true },
    { 
      key: "action", 
      label: "Action", 
      editable: true,
      type: "select" as const,
      options: [
        { value: "view", label: "View" },
        { value: "add_to_cart", label: "Add to Cart" },
        { value: "purchase", label: "Purchase" }
      ]
    },
    { key: "timestamp", label: "Timestamp", editable: true },
  ]

  // Fetch behaviors from API
  const fetchBehaviors = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true)
      const data = await getBehaviors()
      
      console.log("Fetched behaviors data:", data)
      
      // Handle different response formats
      let behaviorsList: BehaviorItem[] = []
      if (Array.isArray(data)) {
        behaviorsList = data
      } else if (data?.behaviors && Array.isArray(data.behaviors)) {
        behaviorsList = data.behaviors
      } else if (data?.data && Array.isArray(data.data)) {
        behaviorsList = data.data
      }
      
      console.log("Behaviors list with IDs:", behaviorsList.slice(0, 2))
      setBehaviour(behaviorsList)
      
      if (showToast) {
        toast.success("Behaviors refreshed successfully")
      }
    } catch (error) {
      console.error("Failed to fetch behaviors:", error)
      if (showToast) {
        toast.error("Failed to fetch behaviors", {
          description: error instanceof Error ? error.message : "Using local data"
        })
      }
      // Keep using mock data on error
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Load behaviors on mount
  useEffect(() => {
    fetchBehaviors()
  }, [fetchBehaviors])

  const handleUpdate = async (rowIndex: number, data: Record<string, string | number>) => {
    const item = behaviour[rowIndex]
    // Use _id first, then fallback to behavior_id, then user_id
    const behaviorId = item._id || item.behavior_id || item.user_id
    
    console.log("Updating behavior:", { item, behaviorId, _id: item._id })
    
    if (!item._id) {
      toast.error("Cannot update: Missing _id field", {
        description: "Please refresh the page to load the latest data with IDs"
      })
      return
    }
    
    try {
      // Prepare behavior data for API
      const behaviorData: UserBehavior = {
        user_id: String(data.user_id || item.user_id),
        product_id: String(data.product_id),
        action: String(data.action),
        timestamp: String(data.timestamp),
      }
      
      await updateBehavior(behaviorId, behaviorData)
      
      // Update local state
      setBehaviour((prev) => {
        const updated = [...prev]
        updated[rowIndex] = { ...prev[rowIndex], ...data } as BehaviorItem
        return updated
      })
      
      toast.success("Behavior updated successfully")
    } catch (error) {
      console.error("Failed to update behavior:", error)
      toast.error("Failed to update behavior", {
        description: error instanceof Error ? error.message : "Please try again"
      })
      // Still update locally for better UX
      setBehaviour((prev) => {
        const updated = [...prev]
        updated[rowIndex] = { ...prev[rowIndex], ...data } as BehaviorItem
        return updated
      })
    }
  }

  const handleDelete = async (rowIndex: number) => {
    const item = behaviour[rowIndex]
    // Use _id first, then fallback to behavior_id, then user_id
    const behaviorId = item._id || item.behavior_id || item.user_id
    
    console.log("Deleting behavior:", { item, behaviorId, _id: item._id })
    
    if (!item._id) {
      toast.error("Cannot delete: Missing _id field", {
        description: "Please refresh the page to load the latest data with IDs"
      })
      return
    }
    
    try {
      await deleteBehavior(behaviorId)
      setBehaviour((prev) => prev.filter((_, idx) => idx !== rowIndex))
      toast.success("Behavior deleted successfully")
    } catch (error) {
      console.error("Failed to delete behavior:", error)
      toast.error("Failed to delete behavior", {
        description: error instanceof Error ? error.message : "Please try again"
      })
      // Still delete locally for better UX
      setBehaviour((prev) => prev.filter((_, idx) => idx !== rowIndex))
    }
  }

  const handleAddFromDialog = async (data: { user_id: string; product_id: string; action: string; timestamp: string }) => {
    try {
      const behaviorData: UserBehavior = {
        user_id: data.user_id,
        product_id: data.product_id,
        action: data.action,
        timestamp: data.timestamp,
      }
      
      const result = await addBehavior(behaviorData)
      
      // Use returned data or the input
      const newBehavior: BehaviorItem = {
        ...behaviorData,
        behavior_id: result?.behavior_id,
        _id: result?._id,
      }
      
      setBehaviour((prev) => [...prev, newBehavior])
      toast.success("Behavior added successfully")
    } catch (error) {
      console.error("Failed to add behavior:", error)
      toast.error("Failed to add behavior", {
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
      
      // Refresh behaviors after upload
      await fetchBehaviors()
      
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again"
      })
    } finally {
      setIsLoading(false)
    }
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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchBehaviors(true)}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <AddBehaviorDialog onAdd={handleAddFromDialog} />
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
              data={behaviour as unknown as Record<string, string | number>[]}
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
