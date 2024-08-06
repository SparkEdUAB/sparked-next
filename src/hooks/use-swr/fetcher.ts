import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON | Error> {
  try {
    const res = await fetch(input, init);

    const data = await res.json();

    if (!res.ok || data.isError) {
      return new Error('An error occured: ' + (getProcessCodeMeaning(data.code) || data.code));
    }

    return data as JSON;
  } catch (error: any) {
    return new Error('An error occured while fetching data: ' + error.toString());
  }
}
