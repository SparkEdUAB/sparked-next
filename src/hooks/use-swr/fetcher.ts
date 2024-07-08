import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON | Error> {
  const res = await fetch(input, init);

  if (!res.ok) {
    return new Error('An error occured while fetching data: ' + res.status);
  }

  const data = await res.json();

  if (data.isError) {
    return new Error('Server returned an error status code: ' + getProcessCodeMeaning(data.code));
  }

  return data as JSON;
}
