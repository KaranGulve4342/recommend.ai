"use client"

import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  progress: number
  label: string
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2"
        aria-label={`${label}: ${progress}%`}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
