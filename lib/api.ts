/**
 * API Client for RecommendAI Backend
 * Based on OpenAPI 3.1.0 specification
 * Base URL configured via environment variable NEXT_PUBLIC_API_URL
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://0f1c67d9501e.ngrok-free.app'

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail?.[0]?.msg || errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

/**
 * Upload file with FormData
 */
async function uploadFile<T>(
  endpoint: string,
  file: File,
  fieldName: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const formData = new FormData()
  formData.append(fieldName, file)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.detail?.[0]?.msg || errorData.detail || errorData.message || `Upload Error: ${response.status} ${response.statusText}`
    )
  }

  return await response.json()
}

// ============================================================================
// RECOMMENDATIONS APIs (Tag: Recommendations)
// ============================================================================

/**
 * POST /api/upload/products
 * Upload and overwrite product catalog data
 * @param file - CSV file with products data
 * Field name: "products" (required)
 */
export async function uploadProducts(file: File) {
  return uploadFile('/api/upload/products', file, 'products')
}

/**
 * POST /api/upload/user-behavior
 * Upload and overwrite user behavior data
 * @param file - CSV file with user behavior data
 * Field name: "user_behavior" (required)
 */
export async function uploadUserBehavior(file: File) {
  return uploadFile('/api/upload/user-behavior', file, 'user_behavior')
}

/**
 * GET /api/recommendations/{user_id}
 * Generate and store product recommendations for a user with optional LLM explanation
 * @param userId - User ID to generate recommendations for
 */
export async function generateRecommendations(userId: string): Promise<any> {
  return apiFetch(`/api/recommendations/${encodeURIComponent(userId)}`, { method: 'GET' })
}

/**
 * GET /api/recommendations/stored/{user_id}
 * Retrieve stored recommendations for a user from database
 * @param userId - User ID to retrieve recommendations for
 */
export async function getStoredRecommendations(userId: string): Promise<any> {
  return apiFetch(`/api/recommendations/stored/${encodeURIComponent(userId)}`, { method: 'GET' })
}

/**
 * GET /api/recommendations/stored
 * Get all stored user recommendations from database
 */
export async function getAllStoredRecommendations(): Promise<any> {
  return apiFetch('/api/recommendations/stored', { method: 'GET' })
}

// ============================================================================
// PRODUCTS APIs (Tag: Products)
// ============================================================================

/**
 * Product schema from OpenAPI spec
 */
export interface Product {
  product_id: string
  name: string
  category: string
  price: number
  rating: number
  brand: string
  features: string
}

/**
 * POST /products/add_product
 * Add a new product
 * @param product - Product data (all fields required)
 */
export async function addProduct(product: Product): Promise<any> {
  return apiFetch('/products/add_product', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

/**
 * GET /products/get_products
 * Get all products with optional filters and pagination
 */
export async function getProducts(): Promise<any> {
  return apiFetch('/products/get_products', { method: 'GET' })
}

/**
 * GET /products/get_product_id/{product_id}
 * Get a single product by ID
 * @param productId - Product ID
 */
export async function getProductById(productId: string): Promise<any> {
  return apiFetch(`/products/get_product_id/${encodeURIComponent(productId)}`, { method: 'GET' })
}

/**
 * PUT /products/update_product/{product_id}
 * Update a product by ID
 * @param productId - Product ID to update
 * @param product - Updated product data (all fields required)
 */
export async function updateProduct(productId: string, product: Product): Promise<any> {
  return apiFetch(`/products/update_product/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

/**
 * DELETE /products/delete_product/{product_id}
 * Delete a product by ID
 * @param productId - Product ID to delete
 */
export async function deleteProduct(productId: string): Promise<any> {
  return apiFetch(`/products/delete_product/${encodeURIComponent(productId)}`, { method: 'DELETE' })
}

// ============================================================================
// USER BEHAVIOR APIs (Tag: User Behavior)
// ============================================================================

/**
 * UserBehavior schema from OpenAPI spec
 */
export interface UserBehavior {
  user_id: string
  product_id: string
  action: string
  timestamp: string
}

/**
 * POST /behavior/add_behavior
 * Add a new user behavior record
 * @param behavior - User behavior data (all fields required)
 */
export async function addBehavior(behavior: UserBehavior): Promise<any> {
  return apiFetch('/behavior/add_behavior', {
    method: 'POST',
    body: JSON.stringify(behavior),
  })
}

/**
 * GET /behavior/get_behaviors
 * Get all user behavior records
 */
export async function getBehaviors(): Promise<any> {
  return apiFetch('/behavior/get_behaviors', { method: 'GET' })
}

/**
 * GET /behavior/get_behavior/{behavior_id}
 * Get behavior records for a specific user
 * @param behaviorId - Behavior ID
 */
export async function getBehaviorById(behaviorId: string): Promise<any> {
  return apiFetch(`/behavior/get_behavior/${encodeURIComponent(behaviorId)}`, { method: 'GET' })
}

/**
 * PUT /behavior/update_behavior/{behavior_id}
 * Update an existing user behavior record
 * @param behaviorId - Behavior ID to update
 * @param behavior - Updated behavior data (all fields required)
 */
export async function updateBehavior(behaviorId: string, behavior: UserBehavior): Promise<any> {
  return apiFetch(`/behavior/update_behavior/${encodeURIComponent(behaviorId)}`, {
    method: 'PUT',
    body: JSON.stringify(behavior),
  })
}

/**
 * DELETE /behavior/delete_behavior/{behavior_id}
 * Delete all behavior records for a specific user
 * @param behaviorId - Behavior ID to delete
 */
export async function deleteBehavior(behaviorId: string): Promise<any> {
  return apiFetch(`/behavior/delete_behavior/${encodeURIComponent(behaviorId)}`, { method: 'DELETE' })
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Upload both products and user behavior files
 */
export async function uploadBothFiles(productsFile: File | null, behaviorFile: File | null) {
  const results: { products?: any; behavior?: any } = {}
  
  if (productsFile) {
    results.products = await uploadProducts(productsFile)
  }
  
  if (behaviorFile) {
    results.behavior = await uploadUserBehavior(behaviorFile)
  }
  
  return results
}

// ============================================================================
// LEGACY ALIASES (for backward compatibility)
// ============================================================================

export const uploadCatalog = uploadProducts
export const getCatalog = getProducts
export const uploadBehaviour = uploadUserBehavior
export const getBehaviour = getBehaviors
export const addBehaviour = addBehavior
export const updateBehaviour = updateBehavior
export const deleteBehaviour = deleteBehavior
export const getRecommendations = getStoredRecommendations

// Export API base URL for reference
export { API_BASE_URL }
