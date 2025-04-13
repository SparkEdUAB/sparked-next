'use client';

import React from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { T_RawMediaContentFields } from 'types/media-content';
import { getImageSrc } from 'utils/helpers/getImageSrc';
import { memo, useCallback } from 'react';
import { MEDIA_CONTENT_LIMIT } from './constants';
import BouncingLoader from '@components/atom/BouncingLoader/BouncingLoader';

const ContentCard = memo(({ item }: { item: T_RawMediaContentFields }) => {
  if (!item.file_url && !item.external_url) {
    return null;
  }
  return (
    <div className="h-full">
      <ContentCardView
        url={`/library/media/${item._id}`}
        image={getImageSrc(item)}
        title={item.name}
        description={item.description}
        fileUrl={item.file_url as string}
        externalUrl={item.external_url as string}
      />
    </div>
  );
});
ContentCard.displayName = 'ContentCard';

export function LibraryInfiniteScrollList({
  mediaContent,
  loadMore,
  hasMore,
  error,
}: {
  mediaContent: T_RawMediaContentFields[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  error: boolean;
}) {
  const initialItemsToRender = Math.min(mediaContent.length, MEDIA_CONTENT_LIMIT);

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !error) {
      await loadMore();
    }
  }, [loadMore, hasMore, error]);

  return (
    <InfiniteScroll
      dataLength={mediaContent.length}
      next={handleLoadMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center my-4">
          <BouncingLoader />
        </div>
      }
      endMessage={
        error && <p className="text-center my-4 text-red-500 font-semibold">Failed to load additional elements</p>
      }
      scrollableTarget="scrollableDiv"
      initialScrollY={0}
      scrollThreshold={0.8}
    >
      <div className="px-4 sm:px-6 md:px-8 mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 media-content-list">
          {mediaContent.slice(0, initialItemsToRender).map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
          {mediaContent.length > initialItemsToRender &&
            mediaContent.slice(initialItemsToRender).map((item) => <ContentCard key={item._id} item={item} />)}
        </div>
      </div>
    </InfiniteScroll>
  );
}
