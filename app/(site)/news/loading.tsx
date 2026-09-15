import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="mt-6 h-14 max-w-2xl" />
      <Skeleton className="mt-4 h-6 max-w-xl" />
      <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
    </div>
  );
}