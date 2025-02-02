import { fetcher } from '@hooks/use-swr/fetcher';
import { API_LINKS } from 'app/links';
import { BASE_URL } from 'app/shared/constants';
import { T_RawMediaContentFields } from 'types/media-content';
import NETWORK_UTILS from 'utils/network';

export async function fetchRelatedMedia(mediaContent: T_RawMediaContentFields) {
  const { _id, grade } = mediaContent;

  const optionalParams = {
    ...(grade?._id && { grade_id: grade?._id }),
  };

  const params = {
    ...optionalParams,
    media_content_id: _id,
    limit: '10',
    skip: '0',
    withMetaData: 'false',
  };

  return fetcher<{ mediaContent: T_RawMediaContentFields[] }>(
    BASE_URL + API_LINKS.FETCH_RELATED_MEDIA_CONTENT + NETWORK_UTILS.formatGetParams(params),
    { next: { revalidate: 60 } },
  );
}
