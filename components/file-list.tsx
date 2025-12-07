"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, FileSpreadsheet } from "lucide-react"
import type { FileWithMeta } from "@/lib/types"

interface FileListProps {
  files: FileWithMeta[]
  onRemove: (id: string) => void
  disabled?: boolean
  progress?: Record<string, number>
}

function formatFileSize(bytes: number): string {
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }
  return `${(kb / 1024).toFixed(2)} MB`
}

export function FileList({ files, onRemove, disabled, progress }: FileListProps) {
  if (files.length === 0) return null

  return (
    <div className="space-y-2" role="list" aria-label="Selected files">
      {files.map((file) => (
        <div key={file.id} role="listitem" className="flex items-center justify-between rounded-lg border bg-card p-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <FileSpreadsheet className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{file.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {formatFileSize(file.size)}
                </Badge>
                {progress && progress[file.id] !== undefined && progress[file.id] < 100 && (
                  <div className="flex-1 max-w-32">
                    <Progress
                      value={progress[file.id]}
                      className="h-1"
                      aria-label={`Upload progress for ${file.name}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(file.id)}
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
            className="flex-shrink-0 ml-2"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ))}
    </div>
  )
}
