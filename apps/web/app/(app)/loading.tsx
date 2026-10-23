import { Card, Skeleton } from "@ledgerly/ui";

/** Shown while an app page streams in. Matches the page header and a grid of cards. */
export default function AppLoading() {
  return (
    <div role="status" aria-label="Loading" className="grid gap-8">
      <div className="grid gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="gap-3 px-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-28" />
          </Card>
        ))}
      </div>
      <Card className="px-6">
        <Skeleton className="h-64" />
      </Card>
    </div>
  );
}
