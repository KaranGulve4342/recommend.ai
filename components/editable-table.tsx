"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check, X, Trash2, Plus, Search } from "lucide-react"

type DataRow = Record<string, string | number>

interface EditableTableProps {
  data: DataRow[]
  columns: {
    key: string
    label: string
    editable?: boolean
    type?: "text" | "number" | "badge"
  }[]
  onUpdate?: (rowIndex: number, data: DataRow) => void
  onDelete?: (rowIndex: number) => void
  onAdd?: (data: DataRow) => void
}

export function EditableTable({ data, columns, onUpdate, onDelete, onAdd }: EditableTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<DataRow>({})
  const [searchQuery, setSearchQuery] = useState("")

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase()
    return data.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(query))
    )
  }, [data, searchQuery])

  const startEditing = (rowIndex: number, row: DataRow) => {
    setEditingRow(rowIndex)
    setEditedData({ ...row })
  }

  const cancelEditing = () => {
    setEditingRow(null)
    setEditedData({})
  }

  const saveEditing = () => {
    if (editingRow !== null && onUpdate) {
      onUpdate(editingRow, editedData)
    }
    setEditingRow(null)
    setEditedData({})
  }

  const handleCellChange = (key: string, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [key]: value }))
  }

  const handleDelete = (rowIndex: number) => {
    if (onDelete && confirm("Are you sure you want to delete this row?")) {
      onDelete(rowIndex)
    }
  }

  const handleAdd = () => {
    if (onAdd) {
      const newRow: DataRow = {}
      columns.forEach((col) => {
        newRow[col.key] = col.type === "number" ? 0 : ""
      })
      onAdd(newRow)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Add Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {onAdd && (
          <Button onClick={handleAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Row
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} rows
        </p>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => {
                const isEditing = editingRow === rowIndex
                const displayData = isEditing ? editedData : row

                return (
                  <TableRow key={rowIndex}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {isEditing && col.editable !== false ? (
                          <Input
                            type={col.type === "number" ? "number" : "text"}
                            value={displayData[col.key] ?? ""}
                            onChange={(e) =>
                              handleCellChange(
                                col.key,
                                col.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                              )
                            }
                            className="h-8"
                          />
                        ) : col.type === "badge" ? (
                          <Badge variant="secondary" className="font-normal">
                            {String(displayData[col.key] ?? "")}
                          </Badge>
                        ) : (
                          <span className="text-sm">{String(displayData[col.key] ?? "")}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={saveEditing} className="h-8 w-8 text-green-600">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={cancelEditing} className="h-8 w-8">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(rowIndex, row)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(rowIndex)}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
