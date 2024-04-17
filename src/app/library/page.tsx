'use client';

import React, { useEffect, useState } from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import { T_RawMediaContentFields } from 'types/media-content';
import { API_LINKS } from 'app/links';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import LibraryLoader from '@components/library/LibraryLoader';
import { determineFileType } from 'utils/helpers';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage';
import useSearchFilters, { Filters } from '@hooks/useLibrary/useSearchFilters';
import useTopic from '@hooks/use-topic';
import LibraryBadge from '@components/library/LibraryBadge';

const fetchRandomMediaContent = async (filters: Filters) => {
  const params = new URLSearchParams({
    limit: '20',
    ...filters,
  }).toString();

  const url = API_LINKS.FETCH_RANDOM_MEDIA_CONTENT + '?' + params;

  const requestOptions: RequestInit = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const resp = await fetch(url, requestOptions);

    if (!resp.ok) {
      return false;
    }

    const responseData = await resp.json();

    if (responseData.isError) {
      return false;
    }

    return responseData.mediaContent as T_RawMediaContentFields[];
  } catch (err: any) {
    return false;
  }
};

const LibraryPage = () => {
  let [mediaContent, setMediaContent] = useState<T_RawMediaContentFields[] | null | false>(null);

  let filters = useSearchFilters();

  let { fetchTopics, topics } = useTopic();

  useEffect(() => {
    setMediaContent(null);
    fetchRandomMediaContent(filters).then(setMediaContent);
    fetchTopics({});
  }, [filters]);

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
      <div className="overflow-x-scroll custom-scrollbar flex flex-row gap-2 sticky top-0 bg-white dark:bg-gray-800 p-2">
        <LibraryBadge
          key={'Any topic'}
          href={filters.unit_id ? '/library?unit_id=' + filters.unit_id : '/library'}
          color={filters.topic_id ? 'gray' : undefined}
        >
          Any topic
        </LibraryBadge>
        {(filters.unit_id ? topics.filter((topic) => topic.unitId === filters.unit_id) : topics)
          .sort((a, b) => (a._id === filters.topic_id ? -1 : b._id === filters.topic_id ? 1 : 0))
          .map((topic) => (
            <LibraryBadge
              key={topic._id}
              href={
                '/library?' +
                new URLSearchParams(
                  filters.unit_id ? { unit_id: filters.unit_id, topic_id: topic._id } : { topic_id: topic._id },
                ).toString()
              }
              color={filters.topic_id && filters.topic_id === topic._id ? undefined : 'gray'}
            >
              {topic.name}
            </LibraryBadge>
          ))}
      </div>
      {mediaContent === null ? (
        <LibraryLoader />
      ) : mediaContent === false || !(mediaContent instanceof Array) ? (
        <LibraryErrorMessage>An error occured while fetching data</LibraryErrorMessage>
      ) : mediaContent.length === 0 ? (
        <EmptyContentIndicator>There is nothing here yet</EmptyContentIndicator>
      ) : (
        <div className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {mediaContent.map((item) => (
            <div style={{ padding: '8px 0' }} key={item._id} className="gutter-row px-2 h-full">
              <ContentCardView
                url={`/library/media/${item._id}`}
                image={
                  item.thumbnailUrl ||
                  (item.file_url && determineFileType(item.file_url) === 'image'
                    ? item.file_url
                    : '/assets/images/no picture yet.svg')
                }
                title={item.name}
                description={item.description}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default LibraryPage;
