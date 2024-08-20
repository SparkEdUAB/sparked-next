import { T_RawMediaContentFields } from 'types/media-content';
import { fetcher } from '@hooks/use-swr/fetcher';
import { BASE_URL } from 'app/shared/constants';
import { API_LINKS } from 'app/links';
import NETWORK_UTILS from 'utils/network';
import { MEDIA_CONTENT_LIMIT } from '@components/library/constants';

type SORT_BY = string;

export async function searchMedia(skip: number, searchText: string, sort_by: SORT_BY = '') {
  return await fetcher<{ mediaContent: T_RawMediaContentFields[] }>(
    (BASE_URL || '') +
      API_LINKS.FIND_MEDIA_CONTENT_BY_NAME +
      NETWORK_UTILS.formatGetParams({
        name: searchText,
        skip: skip.toString(),
        limit: MEDIA_CONTENT_LIMIT.toString(),
        withMetaData: 'false',
        sort_by: sort_by,
      }),
    { next: { revalidate: 60 } },
  );
}
