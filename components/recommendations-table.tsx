"use client"

import { useState, useMemo } from "react"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpDown, ArrowUp, ArrowDown, Copy, Check } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Recommendation, SortConfig } from "@/lib/types"

interface RecommendationsTableProps {
  recommendations: Recommendation[]
}

const ROWS_PER_PAGE = 10

type SortField = "price" | "rating" | "similarity_score" | "overall_score"

export function RecommendationsTable({ recommendations }: RecommendationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const [topNFilter, setTopNFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // Filter by search query
  const filteredData = useMemo(() => {
    let data = [...recommendations]

    // Apply Top N filter first (by overall_score)
    if (topNFilter !== "all") {
      const n = Number.parseInt(topNFilter, 10)
      data = data.sort((a, b) => b.overall_score - a.overall_score).slice(0, n)
    }

    // Then apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      data = data.filter((item) => item.name.toLowerCase().includes(query) || item.brand.toLowerCase().includes(query))
    }

    return data
  }, [recommendations, searchQuery, topNFilter])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.field!]
      const bVal = b[sortConfig.field!]

      if (sortConfig.direction === "asc") {
        return aVal - bVal
      }
      return bVal - aVal
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE
    return sortedData.slice(start, start + ROWS_PER_PAGE)
  }, [sortedData, currentPage])

  // Reset to page 1 when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTopNChange = (value: string) => {
    setTopNFilter(value)
    setCurrentPage(1)
  }

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3" aria-hidden="true" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" aria-hidden="true" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" aria-hidden="true" />
    )
  }

  const renderFeatures = (features: string) => {
    const featureList = features.split(";").filter(Boolean)
    return (
      <div className="flex flex-wrap gap-1">
        {featureList.map((feature, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {feature.trim()}
          </Badge>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No recommendations found for uploaded data.</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={searchQuery} onChange={handleSearchChange} placeholder="Search by name or brand..." />
        <div className="flex items-center gap-2">
          <label htmlFor="top-n-filter" className="text-sm font-medium text-foreground whitespace-nowrap">
            Quick Filter:
          </label>
          <Select value={topNFilter} onValueChange={handleTopNChange}>
            <SelectTrigger id="top-n-filter" className="w-32" aria-label="Filter top results">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {sortedData.length} results
      </p>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-4" role="list" aria-label="Product recommendations">
          {paginatedData.map((item) => (
            <Card key={item.product_id} role="listitem">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.brand} • {item.category}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyId(item.product_id)}
                    aria-label={`Copy product ID ${item.product_id}`}
                    className="flex-shrink-0"
                  >
                    {copiedId === item.product_id ? (
                      <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>{" "}
                    <span className="font-medium text-foreground">₹{item.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span>{" "}
                    <span className="font-medium text-foreground">{item.rating.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    <Badge variant="secondary" className="font-normal">{item.category}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>{" "}
                    <span className="font-mono text-xs text-foreground">{item.product_id}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary">Similarity: {item.similarity_score.toFixed(2)}</Badge>
                  <Badge>Score: {item.overall_score.toFixed(2)}</Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Features:</p>
                  {renderFeatures(item.features)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="w-24">
                  Product ID
                </TableHead>
                <TableHead scope="col">Name</TableHead>
                <TableHead scope="col">Brand</TableHead>
                <TableHead scope="col">Category</TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("price")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    aria-label={`Sort by price ${sortConfig.field === "price" ? (sortConfig.direction === "asc" ? "descending" : "ascending") : "ascending"}`}
                  >
                    Price {getSortIcon("price")}
                  </Button>
                </TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("rating")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    aria-label={`Sort by rating ${sortConfig.field === "rating" ? (sortConfig.direction === "asc" ? "descending" : "ascending") : "ascending"}`}
                  >
                    Rating {getSortIcon("rating")}
                  </Button>
                </TableHead>
                <TableHead scope="col" className="min-w-48">
                  Features
                </TableHead>
                <TableHead scope="col">Category</TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("similarity_score")}
                    className="h-auto p-0 font-semibold hover:bg-transparent whitespace-nowrap"
                    aria-label={`Sort by similarity score ${sortConfig.field === "similarity_score" ? (sortConfig.direction === "asc" ? "descending" : "ascending") : "ascending"}`}
                  >
                    Similarity {getSortIcon("similarity_score")}
                  </Button>
                </TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("overall_score")}
                    className="h-auto p-0 font-semibold hover:bg-transparent whitespace-nowrap"
                    aria-label={`Sort by overall score ${sortConfig.field === "overall_score" ? (sortConfig.direction === "asc" ? "descending" : "ascending") : "ascending"}`}
                  >
                    Overall {getSortIcon("overall_score")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{item.product_id}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyId(item.product_id)}
                        aria-label={`Copy product ID ${item.product_id}`}
                      >
                        {copiedId === item.product_id ? (
                          <Check className="h-3 w-3 text-green-600" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3 w-3" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{item.category}</Badge>
                  </TableCell>
                  <TableCell>₹{item.price.toLocaleString()}</TableCell>
                  <TableCell>{item.rating.toFixed(1)}</TableCell>
                  <TableCell>{renderFeatures(item.features)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.similarity_score.toFixed(2)}</TableCell>
                  <TableCell>{item.overall_score.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
