"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadDialog } from "@/components/upload-dialog"
import { Sparkles, TrendingUp, Star, Package, Loader2, Wand2 } from "lucide-react"
import { mockRecommendations } from "@/lib/mock-data"
import type { Recommendation } from "@/lib/types"
import { toast } from "sonner"
import {
  generateRecommendations,
  getAllStoredRecommendations,
  uploadProducts,
  uploadUserBehavior
} from "@/lib/api"

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations.recommendations)
  const [explanation, setExplanation] = useState<string>(
    mockRecommendations.explanation ||
      "These products are recommended based on user browsing patterns, purchase history, and product similarity analysis."
  )
  const [userId, setUserId] = useState<string>("U001")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all stored recommendations on page load
  useEffect(() => {
    const fetchStoredRecommendations = async () => {
      try {
        setIsLoading(true)
        const data = await getAllStoredRecommendations()
        
        // Handle different response formats
        if (data?.recommendations && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations)
          if (data.explanation) {
            setExplanation(data.explanation)
          }
        } else if (Array.isArray(data)) {
          setRecommendations(data)
        }
        
        console.log("Stored recommendations loaded successfully")
      } catch (error) {
        console.error("Failed to fetch stored recommendations:", error)
        // Silently fail and keep using mock data
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoredRecommendations()
  }, [])

  // Generate new recommendations for a user
  const handleGenerateRecommendations = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a User ID")
      return
    }
    
    try {
      setIsGenerating(true)
      toast.info("Generating recommendations...", {
        description: "This may take a moment as we analyze user behavior and product data."
      })
      
      const data = await generateRecommendations(userId)
      
      // Handle different response formats
      if (data?.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations)
        if (data.explanation) {
          setExplanation(data.explanation)
        }
        toast.success(`Generated ${data.recommendations.length} recommendations!`)
      } else if (Array.isArray(data)) {
        setRecommendations(data)
        toast.success(`Generated ${data.length} recommendations!`)
      } else {
        toast.success("Recommendations generated successfully")
      }
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
      toast.error("Failed to generate recommendations", {
        description: error instanceof Error ? error.message : "Please try again"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpload = async (catalogFile: File | null, behaviourFile: File | null) => {
    
    try {
      if (catalogFile) {
        await uploadProducts(catalogFile)
        toast.success("Products uploaded successfully")
      }
      
      if (behaviourFile) {
        await uploadUserBehavior(behaviourFile)
        toast.success("User behavior uploaded successfully")
      }
      
      toast.info("Files uploaded! Click 'Generate' to create new recommendations.")
      
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again"
      })
    }
  }

  // Calculate stats safely
  const avgRating = recommendations.length > 0 
    ? (recommendations.reduce((acc, r) => acc + (r.rating || 0), 0) / recommendations.length).toFixed(1)
    : "0.0"
  
  const avgConfidence = recommendations.length > 0
    ? ((recommendations.reduce((acc, r) => acc + (r.overall_score || 0), 0) / recommendations.length) * 100).toFixed(0)
    : "0"

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
            <p className="text-sm text-muted-foreground">AI-powered product recommendations</p>
          </div>
          <div className="flex items-center gap-2">
            <UploadDialog onUpload={handleUpload} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* User ID and Generate Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Generate Recommendations
            </CardTitle>
            <CardDescription>
              Enter a user ID to generate or view personalized product recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="user-id" className="text-sm font-medium">
                  User ID
                </Label>
                <Input
                  id="user-id"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID (e.g., U001)"
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating || !userId.trim()}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Explanation Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommendation Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{explanation}</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
              <p className="text-xs text-muted-foreground">Personalized products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConfidence}%</div>
              <p className="text-xs text-muted-foreground">Match score</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recommended Products</h2>
          {isLoading ? (
            <Card className="p-8 text-center">
              <CardContent>
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold mb-2">Loading Recommendations...</h3>
                <p className="text-muted-foreground">
                  Fetching stored recommendations from the database
                </p>
              </CardContent>
            </Card>
          ) : recommendations.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload product catalog and user behavior data, then click &quot;Generate&quot; to create personalized recommendations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((item) => (
                <Card key={item.product_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                        <CardDescription className="mt-1">{item.brand}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Price and Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{item.price?.toLocaleString() || 0}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{item.rating || 0}</span>
                      </div>
                    </div>

                    {/* Features */}
                    {item.features && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.features
                            .split(";")
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Scores */}
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Similarity Score</span>
                        <span className="font-medium">{((item.similarity_score || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Overall Score</span>
                        <span className="font-medium text-primary">{((item.overall_score || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
