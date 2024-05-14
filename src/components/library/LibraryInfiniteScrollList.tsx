'use client';
import React from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'flowbite-react';

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
          <Spinner size="md" />
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
      </article>
    </InfiniteScroll>
  );
}
