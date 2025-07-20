export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Article header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </div>

        {/* Article content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
        </div>

        {/* Additional content blocks */}
        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 