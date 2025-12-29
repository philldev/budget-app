import { Skeleton } from "@/components/ui/skeleton";
import { ItemGroup, Item, ItemMedia, ItemContent } from "@/components/ui/item";

export function BudgetsListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <Skeleton className="h-9 w-full sm:w-[300px]" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="h-9 w-full sm:w-24" />
          <Skeleton className="h-9 w-full sm:w-32" />
        </div>
      </div>

      {/* List Skeleton */}
      <ItemGroup>
        {Array.from({ length: 5 }).map((_, i) => (
          <Item key={i} variant="outline" size="xs" className="justify-between">
            <ItemMedia>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </ItemMedia>
            <ItemContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </ItemContent>
            <div className="flex items-center gap-2 mr-4">
               <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
