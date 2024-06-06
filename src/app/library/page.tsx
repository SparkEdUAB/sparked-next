import React from 'react';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import { getMetadataGenerator } from 'utils/helpers';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import LibraryBadge from '@components/library/LibraryBadge';
import { Metadata, ResolvingMetadata } from 'next';
import { fetcher } from '@hooks/use-swr/fetcher';
import { BASE_URL } from 'app/shared/constants';
import { API_LINKS } from 'app/links';
import NETWORK_UTILS from 'utils/network';
import { T_LibraryPageProps } from '@components/library/types';
import { T_RawTopicFields } from '@hooks/use-topic/types';
import LibraryMediaContentList from './LibraryMediaContentList';
import { fetchMedia } from 'fetchers/library/fetchMedia';
import { MEDIA_CONTENT_LIMIT } from '@components/library/constants';

export async function generateMetadata(props: {}, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  return getMetadata('Library Content', 'View the list of media content on the site');
}

const LibraryPage = async ({ params, searchParams }: T_LibraryPageProps) => {
  const mediaResult = await fetchMedia(0, searchParams);

  const categoriesResult = await fetcher<{ categories: T_RawTopicFields[] }>(
    BASE_URL +
      API_LINKS.FETCH_CATEGORIES +
      NETWORK_UTILS.formatGetParams({ limit: MEDIA_CONTENT_LIMIT.toString(), skip: '0' }),
    { next: { revalidate: 3600 } },
  );

  return (
    <main id="scrollableDiv" className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)] min-w-full">
      <div className="overflow-x-scroll custom-scrollbar flex flex-row gap-2 sticky top-0 bg-white dark:bg-gray-800 p-2">
        {categoriesResult instanceof Error ||
        (categoriesResult.categories.length === 0 && !searchParams.category_id) ? null : (
          <>
            <LibraryBadge
              key={'Any topic'}
              href={searchParams.unit_id ? '/library?unit_id=' + searchParams.unit_id : '/library'}
              color={searchParams.category_id ? 'gray' : undefined}
            >
              Any topic
            </LibraryBadge>
            {(searchParams.unit_id
              ? categoriesResult.categories.filter((topic) => topic.unit_id === searchParams.unit_id)
              : categoriesResult.categories
            )
              .sort((a, b) => (a._id === searchParams.topic_id ? -1 : b._id === searchParams.topic_id ? 1 : 0))
              .map((category) => (
                <LibraryBadge
                  key={category._id}
                  href={
                    '/library?' +
                    new URLSearchParams(
                      searchParams.unit_id
                        ? { unit_id: searchParams.unit_id, category_id: category._id }
                        : { category_id: category._id },
                    ).toString()
                  }
                  color={searchParams.category_id && searchParams.category_id === category._id ? undefined : 'gray'}
                >
                  {category.name}
                </LibraryBadge>
              ))}
          </>
        )}
      </div>
      {mediaResult instanceof Error ? (
        <LibraryErrorMessage>{mediaResult.message}</LibraryErrorMessage>
      ) : !(mediaResult.mediaContent instanceof Array) ? (
        <LibraryErrorMessage>
          An error occured while fetching data (Unexpected data received):{' '}
          <code>{JSON.stringify(mediaResult, null, 4)}</code>
        </LibraryErrorMessage>
      ) : mediaResult.mediaContent.length === 0 ? (
        <EmptyContentIndicator>There is nothing here yet</EmptyContentIndicator>
      ) : (
        <LibraryMediaContentList initialMediaContent={mediaResult.mediaContent} />
      )}
    </main>
  );
};

export default LibraryPage;
