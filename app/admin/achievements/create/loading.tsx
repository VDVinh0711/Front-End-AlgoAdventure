import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-rose-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Page header skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Form skeleton */}
        <Card>
          <CardHeader className="bg-gray-100">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
