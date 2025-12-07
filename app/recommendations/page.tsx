"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { FileUploader } from "@/components/file-uploader"
import { FileList } from "@/components/file-list"
import { ProgressBar } from "@/components/progress-bar"
import { RecommendationsTable } from "@/components/recommendations-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Recommendation, UploadProgress, FileWithMeta } from "@/lib/types"
import { mockRecommendations } from "@/lib/mock-data"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function RecommendationsPage() {
  const [files, setFiles] = useState<FileWithMeta[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ overall: 0, perFile: {} })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [explanation, setExplanation] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [mockMode, setMockMode] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [showLargeFileWarning, setShowLargeFileWarning] = useState(false)
  const [pendingLargeFiles, setPendingLargeFiles] = useState<File[]>([])

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const validFiles: FileWithMeta[] = []
    const largeFiles: File[] = []
    let hasInvalidType = false

    for (const file of selectedFiles) {
      const isCSV = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")

      if (!isCSV) {
        hasInvalidType = true
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        largeFiles.push(file)
      } else {
        validFiles.push({
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
        })
      }
    }

    if (hasInvalidType) {
      setError("Only CSV files are allowed")
    } else {
      setError("")
    }

    if (largeFiles.length > 0) {
      setPendingLargeFiles(largeFiles)
      setShowLargeFileWarning(true)
    }

    setFiles((prev) => [...prev, ...validFiles])
  }, [])

  const handleConfirmLargeFiles = useCallback(() => {
    const newFiles: FileWithMeta[] = pendingLargeFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
    }))
    setFiles((prev) => [...prev, ...newFiles])
    setPendingLargeFiles([])
    setShowLargeFileWarning(false)
  }, [pendingLargeFiles])

  const handleCancelLargeFiles = useCallback(() => {
    setPendingLargeFiles([])
    setShowLargeFileWarning(false)
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return

    setError("")
    setRecommendations([])
    setExplanation("")

    if (mockMode) {
      setIsUploading(true)
      setUploadProgress({ overall: 0, perFile: {} })

      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        const perFileProgress: Record<string, number> = {}
        files.forEach((f) => {
          perFileProgress[f.id] = i
        })
        setUploadProgress({ overall: i, perFile: perFileProgress })
      }

      setRecommendations(mockRecommendations.recommendations)
      setExplanation(mockRecommendations.explanation || "")
      setIsUploading(false)
      return
    }

    const controller = new AbortController()
    setAbortController(controller)
    setIsUploading(true)
    setUploadProgress({ overall: 0, perFile: {} })

    const formData = new FormData()
    files.forEach((f) => formData.append("files", f.file))

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        const perFileProgress: Record<string, number> = {}
        files.forEach((f) => {
          perFileProgress[f.id] = percent
        })
        setUploadProgress({ overall: percent, perFile: perFileProgress })
      }
    }

    xhr.onload = () => {
      setIsUploading(false)
      setAbortController(null)

      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText)
          if (data.recommendations && data.recommendations.length > 0) {
            setRecommendations(data.recommendations)
            setExplanation(data.explanation || "")
          } else {
            setError("No recommendations found for uploaded data.")
          }
        } catch {
          setError("Unexpected server response.")
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText)
          setError(errorData.message || errorData.error || "Server error occurred.")
        } catch {
          setError(xhr.responseText || "Server error occurred.")
        }
      }
    }

    xhr.onerror = () => {
      setIsUploading(false)
      setAbortController(null)
      setError("Network error. Please check your connection.")
    }

    xhr.onabort = () => {
      setIsUploading(false)
      setAbortController(null)
      setUploadProgress({ overall: 0, perFile: {} })
    }

    controller.signal.addEventListener("abort", () => {
      xhr.abort()
    })

    xhr.open("POST", "/api/recommend")
    xhr.send(formData)
  }, [files, mockMode])

  const handleCancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort()
    }
  }, [abortController])

  const canUpload = files.length > 0 && !isUploading

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Recommendations</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your CSV files to analyze products and get personalized recommendations.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Developer Mode Toggle */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Developer Options</CardTitle>
                  <CardDescription>Enable mock mode to test without a backend</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="mock-mode"
                    checked={mockMode}
                    onCheckedChange={setMockMode}
                    aria-describedby="mock-mode-desc"
                  />
                  <Label htmlFor="mock-mode" className="text-sm font-medium">
                    Mock Mode
                  </Label>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Select CSV files to analyze and get product recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader onFilesSelected={handleFilesSelected} disabled={isUploading} />

              {files.length > 0 && (
                <FileList
                  files={files}
                  onRemove={handleRemoveFile}
                  disabled={isUploading}
                  progress={uploadProgress.perFile}
                />
              )}

              {isUploading && <ProgressBar progress={uploadProgress.overall} label="Overall Upload Progress" />}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className="flex items-center gap-2"
                  aria-label={files.length === 0 ? "Select CSV files first" : "Upload and analyze files"}
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Upload & Analyze
                </Button>

                {isUploading && (
                  <Button
                    variant="destructive"
                    onClick={handleCancelUpload}
                    className="flex items-center gap-2"
                    aria-label="Cancel upload"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Cancel
                  </Button>
                )}
              </div>

              {files.length === 0 && !error && (
                <p className="text-sm text-muted-foreground">Select one or more CSV files to begin.</p>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {(recommendations.length > 0 || explanation) && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                {explanation && <CardDescription className="text-base">{explanation}</CardDescription>}
              </CardHeader>
              <CardContent>
                <RecommendationsTable recommendations={recommendations} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Large File Warning Dialog */}
      <AlertDialog open={showLargeFileWarning} onOpenChange={setShowLargeFileWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Large File Warning</AlertDialogTitle>
            <AlertDialogDescription>
              The following file(s) exceed 5 MB and may take longer to upload:
              <ul className="mt-2 list-disc pl-5">
                {pendingLargeFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
              Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLargeFiles}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLargeFiles}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
