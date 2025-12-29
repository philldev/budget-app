import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function BudgetDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* Balance Card Skeleton */}
      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
          <div className="px-4 flex flex-1 flex-col justify-between gap-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Skeleton */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>

      {/* Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <Skeleton className="h-9 w-full sm:w-[300px]" />
        <Skeleton className="h-9 w-full sm:w-24" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 mr-4" />
          </div>
        ))}
      </div>
    </div>
  );
}