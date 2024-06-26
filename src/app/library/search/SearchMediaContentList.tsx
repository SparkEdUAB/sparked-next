'use client';

import React from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { useLibraryInfiniteScroll } from '@hooks/useLibrary/useLibraryInfiniteScroll';
import { searchMedia } from 'fetchers/library/searchMedia';
import { useSearchParams } from 'next/navigation';
import { LibraryInfiniteScrollList } from '@components/library/LibraryInfiniteScrollList';
import { Dropdown } from 'flowbite-react';

export function SearchMediaContentList({ initialMediaContent }: { initialMediaContent: T_RawMediaContentFields[] }) {
  let params = useSearchParams();
  const searchTerm = params.get('q') || '';

  let { error, hasMore, loadMore, mediaContent } = useLibraryInfiniteScroll(initialMediaContent, async (offset) =>
    searchMedia(offset, searchTerm),
  );

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mx-3">
        <p className="">
          Showing results for <b>{searchTerm}</b>
        </p>

        <div className="mr-3">
          <Dropdown label="Sort by" dismissOnClick={false}>
            <Dropdown.Item>Desending Order</Dropdown.Item>
            <Dropdown.Item>Acceding Order</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />
    </div>
  );
}
