'use client';

import { useCallback, useState } from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { fetcher } from '@hooks/use-swr/fetcher';
import { API_LINKS } from 'app/links';
import NETWORK_UTILS from 'utils/network';
import { fetchRelatedMediaClient } from 'fetchers/library/fetchRelatedMedia';
import { MediaViewer } from './MediaViewer';
import { MediaDetails } from './MediaDetails';
import { RelatedMediaContentList } from './RelatedMediaContentList';

type Props = {
  initialMediaContent: T_RawMediaContentFields;
  initialRelatedMedia: T_RawMediaContentFields[] | null;
};

export function MediaContentPlayer({ initialMediaContent, initialRelatedMedia }: Props) {
  const [activeMedia, setActiveMedia] = useState<T_RawMediaContentFields>(initialMediaContent);
  const [relatedMedia, setRelatedMedia] = useState<T_RawMediaContentFields[] | null>(initialRelatedMedia);
  const [pendingMediaId, setPendingMediaId] = useState<string | null>(null);

  const handleSelect = useCallback(
    async (item: T_RawMediaContentFields) => {
      if (item._id === activeMedia._id) return;

      // Highlight selection immediately, keep current content displayed
      setPendingMediaId(item._id);
      window.history.replaceState(null, '', `/library/media/${item._id}`);

      // Fetch full metadata before swapping viewer
      const fullResult = await fetcher<{ mediaContent: T_RawMediaContentFields }>(
        API_LINKS.FETCH_MEDIA_CONTENT_BY_ID + NETWORK_UTILS.formatGetParams({ mediaContentId: item._id, withMetaData: 'true' }),
      );
      if (!(fullResult instanceof Error)) {
        setActiveMedia(fullResult.mediaContent);
        const related = await fetchRelatedMediaClient(fullResult.mediaContent);
        setRelatedMedia(related);
      }
      setPendingMediaId(null);
    },
    [activeMedia._id],
  );

  return (
    <div className="xl:grid xl:grid-cols-[calc(100%_-_300px)_300px] 2xl:grid-cols-[calc(100%_-_400px)_400px] px-4 md:px-8 w-full">
      <section className="relative">
        {pendingMediaId && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-900/50 flex items-start justify-center pt-8 pointer-events-none">
            <div className="h-1 w-full absolute top-0 left-0 overflow-hidden rounded">
              <div className="h-full w-3/5 bg-blue-500 animate-loading-bar" />
            </div>
          </div>
        )}
        <MediaViewer mediaContent={activeMedia} />
        <MediaDetails mediaContent={activeMedia} />
      </section>
      <RelatedMediaContentList
        relatedMediaContent={relatedMedia}
        activeMediaId={pendingMediaId ?? activeMedia._id}
        onSelect={handleSelect}
      />
    </div>
  );
}
