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
