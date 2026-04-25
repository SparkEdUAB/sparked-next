import { Button } from '@/components/ui/button';

export function DataTableLoadMore({
  loadMore,
  error,
}: {
  loadMore: () => void;
  error: any;
}) {
  if (error) {
    return (
      <p className="my-4 text-center text-sm text-destructive">
        Failed to load more items ({String(error)})
      </p>
    );
  }
  return (
    <div className="mt-4 flex justify-center">
      <Button variant="outline" size="sm" onClick={loadMore}>
        Load more
      </Button>
    </div>
  );
}
