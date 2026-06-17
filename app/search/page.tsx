import { Suspense } from "react";
import { SearchContent } from "@/components/search/SearchContent";
import { AcceleratorCardSkeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Find Accelerators — Global Accelerators For Startup Business",
  description: "Search 164+ verified global accelerator programs. Filter by region, stage, focus area, and more.",
};

function SearchFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <AcceleratorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
