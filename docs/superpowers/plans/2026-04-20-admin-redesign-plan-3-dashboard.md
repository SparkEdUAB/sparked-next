# Admin Redesign — Plan 3: Dashboard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the admin dashboard home page (`/admin`) with stat cards (icons + trend badges), a bar chart of entity counts, a stubbed line chart, and an entity summary table.

**Architecture:** Four new components in `src/components/admin/dashboard/`. The `src/app/admin/page.tsx` is rewritten to compose them. All components receive data from the existing `useAdminStatsData` hook — no new API endpoints needed.

**Tech Stack:** shadcn/ui (Card, Badge, Skeleton, Table), Recharts (BarChart, LineChart), react-icons

**Prerequisite:** Plan 1 complete. Plan 2 complete (shell renders admin pages).

---

### Task 1: StatsCard component

**Files:**
- Create: `src/components/admin/dashboard/StatsCard.tsx`
- Create: `src/components/admin/dashboard/StatsCard.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/dashboard/StatsCard.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCard } from './StatsCard';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
}));

describe('StatsCard', () => {
  it('renders entity name and value', () => {
    render(<StatsCard name="users" value={42} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders percentage value with % sign', () => {
    render(<StatsCard name="completion_rate" value={85} isPercentage />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders trend badge when percentageTrend is provided', () => {
    render(<StatsCard name="users" value={42} percentageTrend="up" />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toHaveTextContent('up');
  });

  it('renders no badge when percentageTrend is absent', () => {
    render(<StatsCard name="users" value={42} />);
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- StatsCard.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './StatsCard'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/dashboard/StatsCard.tsx`:

```tsx
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
  users: { icon: AiOutlineUser, bg: 'bg-teal-500' },
  institutions: { icon: AiOutlineHdd, bg: 'bg-cyan-500' },
  grades: { icon: AiOutlineBook, bg: 'bg-teal-600' },
  subjects: { icon: AiOutlineHdd, bg: 'bg-cyan-600' },
  units: { icon: AiOutlineBlock, bg: 'bg-teal-400' },
  topics: { icon: AiOutlineBulb, bg: 'bg-cyan-400' },
  media_content: { icon: AiOutlineContainer, bg: 'bg-teal-700' },
};

const DEFAULT_CONFIG: { icon: IconComponent; bg: string } = {
  icon: AiOutlineDashboard,
  bg: 'bg-teal-500',
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- StatsCard.test 2>&1 | tail -10
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/dashboard/StatsCard.tsx src/components/admin/dashboard/StatsCard.test.tsx
git commit -m "feat: add StatsCard dashboard component with icons and trend badges"
```

---

### Task 2: EntityBarChart component

**Files:**
- Create: `src/components/admin/dashboard/EntityBarChart.tsx`
- Create: `src/components/admin/dashboard/EntityBarChart.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/dashboard/EntityBarChart.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EntityBarChart } from './EntityBarChart';

// Recharts uses ResizeObserver and canvas - mock the chart
vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

const STATS = [
  { index: 1, name: 'users', value: 10, isPercentage: false },
  { index: 2, name: 'grades', value: 5, isPercentage: false },
  { index: 3, name: 'completion', value: 80, isPercentage: true },
];

describe('EntityBarChart', () => {
  it('renders the chart title', () => {
    render(<EntityBarChart stats={STATS} />);
    expect(screen.getByText('Content Overview')).toBeInTheDocument();
  });

  it('renders the bar chart', () => {
    render(<EntityBarChart stats={STATS} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('returns null when all values are zero or percentage', () => {
    const emptyStats = [{ index: 1, name: 'users', value: 0, isPercentage: false }];
    const { container } = render(<EntityBarChart stats={emptyStats} />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- EntityBarChart.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './EntityBarChart'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/dashboard/EntityBarChart.tsx`:

```tsx
'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T_StatFields } from '@hooks/useAdmin/types';

export function EntityBarChart({ stats }: { stats: T_StatFields[] }) {
  const data = stats
    .filter((s) => !s.isPercentage && typeof s.value === 'number' && (s.value as number) > 0)
    .map((s) => ({ name: s.name, count: s.value as number }));

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Content Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" fill="hsl(174, 72%, 40%)" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- EntityBarChart.test 2>&1 | tail -10
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/dashboard/EntityBarChart.tsx src/components/admin/dashboard/EntityBarChart.test.tsx
git commit -m "feat: add EntityBarChart dashboard component"
```

---

### Task 3: GrowthLineChart stub

**Files:**
- Create: `src/components/admin/dashboard/GrowthLineChart.tsx`
- Create: `src/components/admin/dashboard/GrowthLineChart.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/dashboard/GrowthLineChart.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrowthLineChart } from './GrowthLineChart';

vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

describe('GrowthLineChart', () => {
  it('renders the chart title', () => {
    render(<GrowthLineChart />);
    expect(screen.getByText('Growth Over Time')).toBeInTheDocument();
  });

  it('renders the stub overlay message', () => {
    render(<GrowthLineChart />);
    expect(screen.getByText(/time-series data not available/i)).toBeInTheDocument();
  });

  it('renders the line chart element', () => {
    render(<GrowthLineChart />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- GrowthLineChart.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './GrowthLineChart'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/dashboard/GrowthLineChart.tsx`:

```tsx
'use client';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STUB_DATA = [
  { month: 'Jan', count: 0 },
  { month: 'Feb', count: 0 },
  { month: 'Mar', count: 0 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 0 },
  { month: 'Jun', count: 0 },
];

export function GrowthLineChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={STUB_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(174, 72%, 40%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
            <p className="max-w-xs px-4 text-center text-sm text-muted-foreground">
              Time-series data not available — requires a dedicated API endpoint
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- GrowthLineChart.test 2>&1 | tail -10
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/dashboard/GrowthLineChart.tsx src/components/admin/dashboard/GrowthLineChart.test.tsx
git commit -m "feat: add GrowthLineChart stub dashboard component"
```

---

### Task 4: RecentActivityTable component

**Files:**
- Create: `src/components/admin/dashboard/RecentActivityTable.tsx`
- Create: `src/components/admin/dashboard/RecentActivityTable.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/dashboard/RecentActivityTable.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentActivityTable } from './RecentActivityTable';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

const STATS = [
  { index: 1, name: 'users', value: 10, isPercentage: false },
  { index: 2, name: 'grades', value: 0, isPercentage: false },
  { index: 3, name: 'completion', value: 80, isPercentage: true },
];

describe('RecentActivityTable', () => {
  it('renders the section title', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('Entity Summary')).toBeInTheDocument();
  });

  it('renders non-percentage stats as rows', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('grades')).toBeInTheDocument();
  });

  it('does not render percentage stats as rows', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.queryByText('completion')).not.toBeInTheDocument();
  });

  it('shows Active badge for non-zero values', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows Empty badge for zero values', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('shows no data message when stats is empty', () => {
    render(<RecentActivityTable stats={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- RecentActivityTable.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './RecentActivityTable'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/dashboard/RecentActivityTable.tsx`:

```tsx
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
                    {stat.name.replace('_', ' ')}
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- RecentActivityTable.test 2>&1 | tail -10
```

Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/dashboard/RecentActivityTable.tsx src/components/admin/dashboard/RecentActivityTable.test.tsx
git commit -m "feat: add RecentActivityTable dashboard component"
```

---

### Task 5: Update admin/page.tsx

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Replace the dashboard page**

Replace the entire contents of `src/app/admin/page.tsx` with:

```tsx
'use client';

import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@components/admin/dashboard/StatsCard';
import { EntityBarChart } from '@components/admin/dashboard/EntityBarChart';
import { GrowthLineChart } from '@components/admin/dashboard/GrowthLineChart';
import { RecentActivityTable } from '@components/admin/dashboard/RecentActivityTable';
import { API_LINKS } from 'app/links';
import { transformRawStats, useAdminStatsData } from '@hooks/useAdmin/useAdminStatsData';

export default function AdminHomePage() {
  useDocumentTitle('Admin Dashboard');
  const { items: stats, isLoading } = useAdminStatsData(
    API_LINKS.FETCH_ALL_STATS,
    'stats',
    transformRawStats,
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-[332px] rounded-xl" />
          <Skeleton className="h-[332px] rounded-xl" />
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EntityBarChart stats={stats} />
        <GrowthLineChart />
      </div>

      {/* Entity summary */}
      <RecentActivityTable stats={stats} />
    </div>
  );
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm run test 2>&1 | tail -15
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: redesign admin dashboard home with stat cards, bar chart, and summary table"
```

---

### Plan 3 Complete

Dashboard is live. Proceed to **Plan 4: Shared Components**.
