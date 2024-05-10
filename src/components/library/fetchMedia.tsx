import { T_RawMediaContentFields } from 'types/media-content';
import { fetcher } from '@hooks/use-swr/fetcher';
import { BASE_URL } from 'app/shared/constants';
import { API_LINKS } from 'app/links';
import NETWORK_UTILS from 'utils/network';
import { MEDIA_CONTENT_LIMIT } from './constants';
import { T_Filters } from '@hooks/useLibrary/useSearchFilters';

export const fetchMedia = async (skip: number, filters: T_Filters) => {
  console.log(skip, filters);
  console.log(BASE_URL);
  console.log(API_LINKS.FETCH_MEDIA_CONTENT);

  return await fetcher<{ mediaContent: T_RawMediaContentFields[] }>(
    (BASE_URL || '') +
      API_LINKS.FETCH_MEDIA_CONTENT +
      NETWORK_UTILS.formatGetParams({
        ...filters,
        skip: skip.toString(),
        limit: MEDIA_CONTENT_LIMIT.toString(),
      }),
    { next: { revalidate: 3600 } },
  );
};
