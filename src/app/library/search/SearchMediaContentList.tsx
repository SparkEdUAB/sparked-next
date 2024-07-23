'use client';

import React from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { useLibraryInfiniteScroll } from '@hooks/useLibrary/useLibraryInfiniteScroll';
import { searchMedia } from 'fetchers/library/searchMedia';
import { usePathname, useSearchParams } from 'next/navigation';
import { LibraryInfiniteScrollList } from '@components/library/LibraryInfiniteScrollList';
import { Dropdown } from 'flowbite-react';
import { useSearchQuery } from '@hooks/useSearchQuery';
import i18next from "i18next";

export function SearchMediaContentList({ initialMediaContent }: { initialMediaContent: T_RawMediaContentFields[] }) {
  let params = useSearchParams();
  const { createQueryString, pathname } = useSearchQuery();
  const baseSearchPath = `${pathname}?`;
  const searchTerm = params.get('q') || '';
  const sortBy = params.get('sort_by') || '';

  let { error, hasMore, loadMore, mediaContent } = useLibraryInfiniteScroll(initialMediaContent, async (offset) =>
    searchMedia(offset, searchTerm, sortBy),
  );

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mx-3 flex-wrap gap-3">
        <p>
          Showing results for <b>{searchTerm}</b>
        </p>

        <div className="mr-3">
          <Dropdown label={sortBy ?  i18next.t(sortBy) : i18next.t("sort_by")} dismissOnClick={true}>
            <Dropdown.Item href={`${baseSearchPath}${createQueryString('sort_by', i18next.t('most_viewed'))}`}>
              {i18next.t('most_viewed')}
            </Dropdown.Item>
            <Dropdown.Item href={`${baseSearchPath}${createQueryString('sort_by',  i18next.t('newest'))}`}>
              { i18next.t('newest')}
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <LibraryInfiniteScrollList mediaContent={mediaContent} loadMore={loadMore} hasMore={hasMore} error={error} />
    </div>
  );
}
