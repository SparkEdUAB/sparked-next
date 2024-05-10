'use client';

import React, { useState } from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MEDIA_CONTENT_LIMIT } from '../../components/library/constants';
import { fetchMedia } from '../../components/library/fetchMedia';
import useSearchFilters from '@hooks/useLibrary/useSearchFilters';
import { Spinner } from 'flowbite-react';

export default function LibraryMediaContentList({
  initialMediaContent,
}: {
  initialMediaContent: T_RawMediaContentFields[];
}) {
  const [mediaContent, setMediaContent] = useState(initialMediaContent);
  const [offset, setOffset] = useState(MEDIA_CONTENT_LIMIT);
  let [hasMore, setHasMore] = useState(true);
  let [error, setError] = useState(false);

  let filters = useSearchFilters();

  const loadMore = async () => {
    try {
      let result = await fetchMedia(offset, filters);

      if (result instanceof Error || !result.mediaContent || !(result.mediaContent instanceof Array)) {
        setError(true);
        setHasMore(false);
      } else if (result.mediaContent.length === 0) {
        setHasMore(false);
      } else if (!(result instanceof Error)) {
        setMediaContent((existing) => [...existing, ...result.mediaContent]);
      }
    } catch {
      setError(true);
      setHasMore(false);
    }

    setOffset((offset) => offset + MEDIA_CONTENT_LIMIT);
  };

  return (
    <>
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
      </InfiniteScroll>
    </>
  );
}
