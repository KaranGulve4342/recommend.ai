"use client"

import { useState, useCallback } from "react"
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
import { Upload, X, FileSpreadsheet } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadDialogProps {
  onUpload?: (catalogFile: File | null, behaviourFile: File | null) => Promise<void>
}

export function UploadDialog({ onUpload }: UploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [catalogFile, setCatalogFile] = useState<File | null>(null)
  const [behaviourFile, setBehaviourFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleCatalogChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
        setCatalogFile(file)
        setError("")
      } else {
        setError("Please select a valid CSV file for product catalog")
      }
    }
  }, [])

  const handleBehaviourChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
        setBehaviourFile(file)
        setError("")
      } else {
        setError("Please select a valid CSV file for user behaviour")
      }
    }
  }, [])

  const handleUpload = async () => {
    if (!catalogFile && !behaviourFile) {
      setError("Please select at least one file to upload")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      if (onUpload) {
        await onUpload(catalogFile, behaviourFile)
      }
      // Reset and close dialog on success
      setCatalogFile(null)
      setBehaviourFile(null)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload files")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveCatalog = () => setCatalogFile(null)
  const handleRemoveBehaviour = () => setBehaviourFile(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload CSV Files</DialogTitle>
          <DialogDescription>Upload product catalog and/or user behaviour data files.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Catalog File */}
          <div className="space-y-2">
            <Label htmlFor="catalog-file">Product Catalog CSV</Label>
            {catalogFile ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span className="flex-1 truncate text-sm">{catalogFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveCatalog}
                  disabled={isUploading}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="catalog-file"
                type="file"
                accept=".csv,text/csv"
                onChange={handleCatalogChange}
                disabled={isUploading}
              />
            )}
          </div>

          {/* User Behaviour File */}
          <div className="space-y-2">
            <Label htmlFor="behaviour-file">User Behaviour CSV</Label>
            {behaviourFile ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span className="flex-1 truncate text-sm">{behaviourFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveBehaviour}
                  disabled={isUploading}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="behaviour-file"
                type="file"
                accept=".csv,text/csv"
                onChange={handleBehaviourChange}
                disabled={isUploading}
              />
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || (!catalogFile && !behaviourFile)}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
