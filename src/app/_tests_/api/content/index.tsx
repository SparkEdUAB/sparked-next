import { API_LINKS } from 'app/links';
import i18next from 'i18next';

export const test_fetchRandomMediaContent = async () => {
  const url = API_LINKS.FETCH_RANDOM_MEDIA_CONTENT;
  const formData = {
    params: JSON.stringify({
      limit: 1000,
    }),
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const resp = await fetch(url, formData);

    if (!resp.ok) {
      return false;
    }

    const responseData = await resp.json();

    if (responseData.isError) {
      return false;
    }

    return responseData.mediaContent;
  } catch (err: any) {
    return false;
  }
};
