export interface Recommendation {
  product_id: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
  features: string
  similarity_score: number
  overall_score: number
}

export interface ApiResponse {
  recommendations: Recommendation[]
  explanation?: string
}

export interface ApiError {
  error?: string
  message?: string
}

export interface FileWithMeta {
  file: File
  id: string
  name: string
  size: number
}

export interface UploadProgress {
  overall: number
  perFile: Record<string, number>
}

export interface SortConfig {
  field: "price" | "rating" | "similarity_score" | "overall_score" | null
  direction: "asc" | "desc"
}
