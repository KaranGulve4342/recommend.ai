import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, BarChart3, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Smart Product Recommendations
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
              Upload your product data and get AI-powered recommendations to boost sales and improve customer
              experience.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard/recommendations">
                  <Upload className="mr-2 h-5 w-5" aria-hidden="true" />
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground">
                Simple, fast, and accurate product recommendations in three easy steps.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
              <Card className="bg-card">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-4">Upload Data</CardTitle>
                  <CardDescription>
                    Upload your CSV files containing product information and customer data.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-4">AI Analysis</CardTitle>
                  <CardDescription>
                    Our system analyzes your data using advanced algorithms to find patterns.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-4">Get Results</CardTitle>
                  <CardDescription>
                    Receive ranked product recommendations with similarity scores and insights.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Ready to optimize your recommendations?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start analyzing your product data today and discover new opportunities.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/dashboard/recommendations">Start Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">RecommendAI</span>
            </div>
            <p className="text-sm text-muted-foreground">E-commerce product recommendation system</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
