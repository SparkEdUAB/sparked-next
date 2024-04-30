import { T_RawMediaContentFields } from 'types/media-content';
import { API_LINKS } from 'app/links';
import { T_Filters } from '@hooks/useLibrary/useSearchFilters';

export const fetchRandomMediaContent = async (filters: T_Filters) => {
  const params = new URLSearchParams({
    limit: '20',
    ...filters,
  }).toString();

  const url = API_LINKS.FETCH_RANDOM_MEDIA_CONTENT + '?' + params;

  const requestOptions: RequestInit = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const resp = await fetch(url, requestOptions);

    if (!resp.ok) {
      return false;
    }

    const responseData = await resp.json();

    if (responseData.isError) {
      return false;
    }

    return responseData.mediaContent as T_RawMediaContentFields[];
  } catch (err: any) {
    return false;
  }
};
