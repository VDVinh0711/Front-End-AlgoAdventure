import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-rose-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-4 md:mt-0">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        {/* Form skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              <div>
                <Skeleton className="h-6 w-36 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />

                <div className="mb-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* JSON Preview skeleton */}
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
