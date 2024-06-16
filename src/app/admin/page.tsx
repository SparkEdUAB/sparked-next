'use client';

import 'utils/intl';
import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import React from 'react';
import { DashbordUsageCard } from '@components/atom/StatsCard';
import { BASE_URL } from 'app/shared/constants';
import { API_LINKS } from 'app/links';
import NETWORK_UTILS from 'utils/network';
import { fetcher } from '@hooks/use-swr/fetcher';
import { T_RawMediaContentFields } from 'types/media-content';
import { transformRawStats, useAdminStatsData } from '@hooks/useAdmin/useAdminStatsData';

// TODO: Add links to in detailed statas
// TODO: GET STATS FOR
// Users
// Grades
// Subjects
// Units
// Topics
// Media contents uploaded
// Page views
//

const Home: React.FC = () => {
  const {
    items: stats,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminStatsData(API_LINKS.FETCH_ALL_STATS, 'stats', transformRawStats);

  return (
    <div>
      {stats.length > 0 ? (
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
