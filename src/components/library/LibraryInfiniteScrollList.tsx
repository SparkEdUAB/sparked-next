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
      loader={<div className="flex justify-center my-4"><BouncingLoader /></div>}
      endMessage={
        error && <p className="text-center my-4 text-red-500 font-semibold">Failed to load additional elements</p>
      }
      scrollableTarget="scrollableDiv"
    >
      <div className="px-4 sm:px-6 md:px-8"> {/* Added padding for left and right sides */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 sm:gap-2 md:gap-3 lg:gap-4">
          {mediaContent.map((item) => (
            <div key={item._id} className="h-full">
              <ContentCardView
                url={`/library/media/${item._id}`}
                image={getImageSrc(item)}
                title={item.name}
                description={item.description}
                fileUrl={item.file_url as string}
              />
            </div>
          ))}
        </div>
      </div>
    </InfiniteScroll>
  );
}
