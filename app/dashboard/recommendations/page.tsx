"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UploadDialog } from "@/components/upload-dialog"
import { Sparkles, TrendingUp, Star, Package } from "lucide-react"
import { mockRecommendations } from "@/lib/mock-data"
import type { Recommendation } from "@/lib/types"

export default function RecommendationsPage() {
  const [recommendations] = useState<Recommendation[]>(mockRecommendations.recommendations)
  const [explanation] = useState<string>(
    mockRecommendations.explanation ||
      "These products are recommended based on user browsing patterns, purchase history, and product similarity analysis."
  )

  const handleUpload = async (catalogFile: File | null, behaviourFile: File | null) => {
    // TODO: Implement actual upload and recommendation generation
    console.log("Files to upload:", { catalogFile, behaviourFile })
    // For now, keep using mock data
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
            <p className="text-sm text-muted-foreground">AI-powered product recommendations</p>
          </div>
          <UploadDialog onUpload={handleUpload} />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
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
              <div className="text-2xl font-bold">
                {(recommendations.reduce((acc, r) => acc + r.rating, 0) / recommendations.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  (recommendations.reduce((acc, r) => acc + r.overall_score, 0) / recommendations.length) *
                  100
                ).toFixed(0)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Match score</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recommended Products</h2>
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
                    <span className="text-2xl font-bold text-primary">₹{item.price.toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </div>

                  {/* Features */}
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

                  {/* Scores */}
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Similarity Score</span>
                      <span className="font-medium">{(item.similarity_score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Overall Score</span>
                      <span className="font-medium text-primary">{(item.overall_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="pt-2">
                    <Badge variant="secondary">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
