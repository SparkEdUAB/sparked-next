import { ChartNoAxesCombined } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GrowthLineChart() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
            <ChartNoAxesCombined className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="font-medium text-card-foreground">Growth data is not available yet</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Trends will appear when historical statistics are available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
