import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  AiOutlineBlock,
  AiOutlineBook,
  AiOutlineBulb,
  AiOutlineContainer,
  AiOutlineDashboard,
  AiOutlineHdd,
  AiOutlineUser,
} from 'react-icons/ai';
import { cn } from '@/lib/utils';
import i18next from 'i18next';

type IconComponent = React.ComponentType<{ className?: string }>;

const ENTITY_CONFIG: Record<string, { icon: IconComponent; bg: string }> = {
  users: { icon: AiOutlineUser, bg: 'bg-blue-600' },
  institutions: { icon: AiOutlineHdd, bg: 'bg-violet-500' },
  grades: { icon: AiOutlineBook, bg: 'bg-orange-500' },
  subjects: { icon: AiOutlineHdd, bg: 'bg-sky-500' },
  units: { icon: AiOutlineBlock, bg: 'bg-indigo-500' },
  topics: { icon: AiOutlineBulb, bg: 'bg-amber-500' },
  media_content: { icon: AiOutlineContainer, bg: 'bg-emerald-600' },
};

const DEFAULT_CONFIG: { icon: IconComponent; bg: string } = {
  icon: AiOutlineDashboard,
  bg: 'bg-blue-600',
};

export function StatsCard({
  name,
  value,
  isPercentage,
  percentageTrend,
}: {
  name: string;
  value: number | string;
  isPercentage?: boolean;
  percentageTrend?: 'up' | 'down';
}) {
  const config = ENTITY_CONFIG[name] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn('shrink-0 rounded-xl p-3', config.bg)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {i18next.t(name)}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {value}
              {isPercentage && <span>%</span>}
            </p>
            {percentageTrend && (
              <Badge
                className={cn(
                  'mt-1.5 gap-1 text-xs border-0',
                  percentageTrend === 'up'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                )}
              >
                {percentageTrend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {percentageTrend}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
