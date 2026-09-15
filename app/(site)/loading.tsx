import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}