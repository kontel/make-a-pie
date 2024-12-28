import { Card, CardContent, CardHeader } from "./card"
import { Skeleton } from "@/components/ui/skeleton"

export function PieSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[250px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </CardContent>
    </Card>
  )
}

export function PieGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PieSkeleton key={i} />
      ))}
    </div>
  )
}
