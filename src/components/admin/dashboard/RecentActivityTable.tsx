'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { T_StatFields } from '@hooks/useAdmin/types';

export function RecentActivityTable({ stats }: { stats: T_StatFields[] }) {
  const entityStats = stats.filter((s) => !s.isPercentage);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Entity Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Entity</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entityStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              entityStats.map((stat) => (
                <TableRow key={stat.name}>
                  <TableCell className="font-medium capitalize">
                    {stat.name.replaceAll('_', ' ')}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{stat.value}</TableCell>
                  <TableCell>
                    {(stat.value as number) > 0 ? (
                      <Badge className="border-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Empty</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
