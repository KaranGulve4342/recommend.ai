"use client"

import type React from "react"

import { useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function FileUploader({ onFilesSelected, disabled }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files
      if (fileList && fileList.length > 0) {
        onFilesSelected(Array.from(fileList))
      }
      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [onFilesSelected],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (disabled) return

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles)
      }
    },
    [onFilesSelected, disabled],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      inputRef.current?.click()
    }
  }, [])

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Drop CSV files here or click to browse"
      aria-disabled={disabled}
      className={`
        flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 
        transition-colors cursor-pointer
        ${
          disabled
            ? "border-muted bg-muted/50 cursor-not-allowed opacity-60"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Upload className="h-10 w-10 text-muted-foreground mb-4" aria-hidden="true" />
      <Label htmlFor="file-upload" className="text-lg font-medium text-foreground cursor-pointer">
        Drop CSV files here or click to browse
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">Accepts .csv files (max 5 MB recommended)</p>
      <Input
        ref={inputRef}
        id="file-upload"
        type="file"
        accept=".csv,text/csv"
        multiple
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-describedby="file-upload-help"
      />
      <span id="file-upload-help" className="sr-only">
        Select one or more CSV files to upload for product recommendations
      </span>
    </div>
  )
}
