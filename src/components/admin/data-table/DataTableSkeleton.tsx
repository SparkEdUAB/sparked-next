import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function DataTableSkeleton({
  columnCount = 4,
  rowCount = 5,
}: {
  columnCount?: number;
  rowCount?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {Array.from({ length: columnCount }).map((_, colIdx) => (
              <TableCell key={colIdx}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
