import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => (
  <div className="flex flex-col h-full bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <Skeleton className="aspect-square w-full bg-[#f3f4f6]" />
    <div className="flex flex-col flex-1 p-2.5 md:p-3 space-y-2 md:space-y-3">
      <Skeleton className="h-4 md:h-5 w-full" />
      <Skeleton className="h-3 md:h-4 w-2/3" />
      <div className="space-y-1.5 md:space-y-2 pt-1 md:pt-2">
        <Skeleton className="h-5 md:h-6 w-1/2" />
        <Skeleton className="h-3 md:h-4 w-3/4" />
      </div>
    </div>
  </div>
);
