'use client';

import React, { useEffect } from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import { determineFileType } from 'utils/helpers';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage';
import { useSearchParams } from 'next/navigation';
import useMediaContent from '@hooks/use-media-content';
import { LibraryGridSkeletonLoader } from '@components/library/LibraryGridSkeletonLoader';

const LibrarySearchPage = () => {
  let searchParams = useSearchParams();

  let { findMediaContentByName, mediaContent, isLoading } = useMediaContent();

  useEffect(() => {
    findMediaContentByName({ searchText: searchParams.get('q') || '' });
  }, [searchParams]);

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
      {isLoading ? (
        <LibraryGridSkeletonLoader />
      ) : !(mediaContent instanceof Array) ? (
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
                  (item.fileUrl && determineFileType(item.fileUrl) === 'image'
                    ? item.fileUrl
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

export default LibrarySearchPage;
