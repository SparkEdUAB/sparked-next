'use client';

import { useCallback, useRef, useState } from 'react';
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

async function fetchFullMedia(id: string) {
  return fetcher<{ mediaContent: T_RawMediaContentFields }>(
    API_LINKS.FETCH_MEDIA_CONTENT_BY_ID + NETWORK_UTILS.formatGetParams({ mediaContentId: id, withMetaData: 'true' }),
  );
}

export function MediaContentPlayer({ initialMediaContent, initialRelatedMedia }: Props) {
  const [activeMedia, setActiveMedia] = useState<T_RawMediaContentFields>(initialMediaContent);
  const [relatedMedia, setRelatedMedia] = useState<T_RawMediaContentFields[] | null>(initialRelatedMedia);

  // Cache fetched media by ID — re-selecting a visited item is instant
  const mediaCache = useRef<Map<string, T_RawMediaContentFields>>(
    new Map([[initialMediaContent._id, initialMediaContent]]),
  );

  const handleSelect = useCallback(async (item: T_RawMediaContentFields) => {
    setActiveMedia(item);
    window.history.replaceState(null, '', `/library/media/${item._id}`);

    const cached = mediaCache.current.get(item._id);
    if (cached) {
      setActiveMedia(cached);
      const related = await fetchRelatedMediaClient(cached);
      setRelatedMedia(related);
      return;
    }

    const fullResult = await fetchFullMedia(item._id);
    if (!(fullResult instanceof Error)) {
      mediaCache.current.set(fullResult.mediaContent._id, fullResult.mediaContent);
      setActiveMedia(fullResult.mediaContent);
      const related = await fetchRelatedMediaClient(fullResult.mediaContent);
      setRelatedMedia(related);
    }
  }, []);

  // Prefetch full metadata on hover so click feels instant
  const handlePrefetch = useCallback(async (item: T_RawMediaContentFields) => {
    if (mediaCache.current.has(item._id)) return;
    const result = await fetchFullMedia(item._id);
    if (!(result instanceof Error)) {
      mediaCache.current.set(result.mediaContent._id, result.mediaContent);
    }
  }, []);

  return (
    <div className="xl:grid xl:grid-cols-[calc(100%_-_300px)_300px] 2xl:grid-cols-[calc(100%_-_400px)_400px] px-4 md:px-8 w-full">
      <section>
        <MediaViewer mediaContent={activeMedia} />
        <MediaDetails mediaContent={activeMedia} />
      </section>
      <RelatedMediaContentList
        relatedMediaContent={relatedMedia}
        activeMediaId={activeMedia._id}
        onSelect={handleSelect}
        onPrefetch={handlePrefetch}
      />
    </div>
  );
}
