'use client';

import React from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import { T_RawMediaContentFields } from 'types/media-content';
import InfiniteScroll from 'react-infinite-scroll-component';
import BouncingLoader from '@components/atom/BouncingLoader/BouncingLoader';
import { getImageSrc } from 'utils/helpers/getImageSrc';

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
  return (
    <InfiniteScroll
      dataLength={mediaContent.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <div className="flex flex-row justify-center items-center my-4">
          <BouncingLoader />
        </div>
      }
      endMessage={
        error && (
          <p className="text-center my-4">
            <b className="text-red-500">Failed to load additional elements</b>
          </p>
        )
      }
      scrollableTarget="scrollableDiv"
    >
      <article className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {mediaContent.map((item) => (
          <div key={item._id} className="gutter-row px-0 py-2 h-full">
            <ContentCardView
              url={`/library/media/${item._id}`}
              image={getImageSrc(item)}
              title={item.name}
              description={item.description}
              fileUrl={item.file_url as string}
            />
          </div>
        ))}
      </article>
    </InfiniteScroll>
  );
}
