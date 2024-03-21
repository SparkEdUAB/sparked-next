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
      console.error(i18next.t('unknown_error'));
      return false;
    }

    const responseData = await resp.json();

    if (responseData.isError) {
      console.error(responseData.code);
      return false;
    }
    console.log('test_fetchRandomMediaContent =>', responseData.mediaContent);

    return responseData.mediaContent;
  } catch (err: any) {
    console.error(err, `${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
    return false;
  }
};
