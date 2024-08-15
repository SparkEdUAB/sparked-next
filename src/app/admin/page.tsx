'use client';

import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { LoadingSpinner } from '@components/atom/AdminloadinSpiner';
import { DashbordUsageCard } from '@components/atom/StatsCard';
import { API_LINKS } from 'app/links';
import { transformRawStats, useAdminStatsData } from '@hooks/useAdmin/useAdminStatsData';

const Home: React.FC = () => {
  useDocumentTitle('Admin Dashboard');
  const { items: stats, isLoading, error } = useAdminStatsData(API_LINKS.FETCH_ALL_STATS, 'stats', transformRawStats);

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : stats.length > 0 ? (
        <div className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div key={index}>
              <DashbordUsageCard {...stat} />
            </div>
          ))}
        </div>
      ) : (
        <ContentPlaceholder message="Get started" />
      )}
    </div>
  );
};

export default Home;
