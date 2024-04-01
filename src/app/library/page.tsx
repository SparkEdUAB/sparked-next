'use client';

import React, { useEffect, useState } from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import { Badge, Spinner } from 'flowbite-react';
import { libraryTags } from '@components/layouts/library/tags';
import { T_RawMediaContentFields } from 'types/media-content';
import i18next from 'i18next';
import { API_LINKS } from 'app/links';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { CiFileOff } from 'react-icons/ci';

const fetchRandomMediaContent = async () => {
  const url = API_LINKS.FETCH_RANDOM_MEDIA_CONTENT;
  const requestOptions = {
    params: JSON.stringify({
      limit: 1000,
    }),
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const resp = await fetch(url, requestOptions);

    console.log(resp);
    console.log('resp.ok:', resp.ok);

    if (!resp.ok) {
      console.error(i18next.t('unknown_error'));
      return false;
    }

    const responseData = await resp.json();
    console.log('responseData.isError:', responseData.isError);
    console.log(responseData);

    if (responseData.isError) {
      console.error(responseData.code);
      return false;
    }
    console.log('fetchRandomMediaContent =>', responseData.mediaContent);

    return responseData.mediaContent as T_RawMediaContentFields[];
  } catch (err: any) {
    console.error(err, `${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
    return false;
  }
};

const LibraryPage = () => {
  let [mediaContent, setMediaContent] = useState<T_RawMediaContentFields[] | null | false>(null);

  useEffect(() => {
    fetchRandomMediaContent().then(setMediaContent);
  }, []);

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
      <div className="overflow-x-scroll custom-scrollbar flex flex-row gap-2 sticky top-0 bg-white dark:bg-gray-800 p-2">
        <Badge key={'All'} className="h-full" href="#">
          All
        </Badge>
        {libraryTags.map((tag) => (
          <Badge key={tag} className="h-full" href="#" color="gray">
            {tag}
          </Badge>
        ))}
      </div>
      {mediaContent === null ? (
        <div className="flex items-center justify-center h-[500px] w-full">
          <Spinner size="xl" />
        </div>
      ) : mediaContent === false || !(mediaContent instanceof Array) ? (
        <div className="h-full flex flex-col items-center justify-center text-red-500">
          <IoIosCloseCircleOutline className="text-6xl mb-3" />
          <p className="text-lg">An error occured while fetching data</p>
        </div>
      ) : mediaContent.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <CiFileOff className="text-6xl mb-3" />
          <p className="text-lg">There is nothing here yet</p>
        </div>
      ) : (
        <div className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {mediaContent.map((item) => (
            <div style={{ padding: '8px 0' }} key={item._id} className="gutter-row px-2 h-full">
              <ContentCardView
                url="#"
                image={item.file_url || '/assets/images/no picture yet.svg'}
                title={item.name}
                description={item.description}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default LibraryPage;
