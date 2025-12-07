"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = []

  // Generate page numbers to show
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)

  // Adjust if at start or end
  if (currentPage <= 3) {
    endPage = Math.min(totalPages, 5)
  }
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination navigation">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Prev</span>
      </Button>

      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)} aria-label="Go to page 1">
              1
            </Button>
            {startPage > 2 && (
              <span className="px-2 text-muted-foreground" aria-hidden="true">
                ...
              </span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-muted-foreground" aria-hidden="true">
                ...
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}
