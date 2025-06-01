import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-rose-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Page header skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Legend skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search skeleton */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
