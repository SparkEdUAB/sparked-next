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

export function MediaContentPlayer({ initialMediaContent, initialRelatedMedia }: Props) {
  const [activeMedia, setActiveMedia] = useState<T_RawMediaContentFields>(initialMediaContent);
  const [relatedMedia, setRelatedMedia] = useState<T_RawMediaContentFields[] | null>(initialRelatedMedia);
  const selectionId = useRef(0);

  const handleSelect = useCallback(
    async (item: T_RawMediaContentFields) => {
      if (item._id === activeMedia._id) {
        return;
      }

      const currentSelection = ++selectionId.current;
      setActiveMedia(item);
      window.history.replaceState(null, '', `/library/media/${item._id}`);
      document.title = item.name;

      const fullResult = await fetcher<{ mediaContent: T_RawMediaContentFields }>(
        API_LINKS.FETCH_MEDIA_CONTENT_BY_ID + NETWORK_UTILS.formatGetParams({ mediaContentId: item._id, withMetaData: 'true' }),
      );
      if (currentSelection !== selectionId.current) {
        return;
      }

      if (!(fullResult instanceof Error)) {
        setActiveMedia(fullResult.mediaContent);
        const related = await fetchRelatedMediaClient(fullResult.mediaContent);
        if (currentSelection === selectionId.current) {
          setRelatedMedia(related);
        }
      }
    },
    [activeMedia._id],
  );

  return (
    <div className="xl:grid xl:grid-cols-[calc(100%_-_300px)_300px] 2xl:grid-cols-[calc(100%_-_400px)_400px] px-4 md:px-8 w-full">
      <section>
        <MediaViewer mediaContent={activeMedia} />
        <MediaDetails key={activeMedia._id} mediaContent={activeMedia} />
      </section>
      <RelatedMediaContentList
        relatedMediaContent={relatedMedia}
        activeMediaId={activeMedia._id}
        onSelect={handleSelect}
      />
    </div>
  );
}
