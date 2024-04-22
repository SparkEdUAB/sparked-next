'use client';

import ContentCardView from '@components/layouts/library/content-card';
import { libraryTags } from '@components/layouts/library/tags';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import LibraryLoader from '@components/library/LibraryLoader';
import { API_LINKS } from 'app/links';
import { Badge } from 'flowbite-react';
import { ReactNode, useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers';
import NETWORK_UTILS from 'utils/network';

const fetchRandomMediaContent = async () => {
  const url = API_LINKS.FETCH_RANDOM_MEDIA_CONTENT;
  const params = {
    limit: '20',
  };

  try {
    const resp = await fetch(url + NETWORK_UTILS.formatGetParams({ params }));

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
        <LibraryLoader />
      ) : mediaContent === false || !(mediaContent instanceof Array) ? (
        <LibraryErrorMessage>An error occured while fetching data</LibraryErrorMessage>
      ) : mediaContent.length === 0 ? (
        <EmptyContentIndicator>There is nothing here yet</EmptyContentIndicator>
      ) : (
        <div className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {mediaContent.map((item) => (
            <div style={{ padding: '8px 0' }} key={item._id} className="gutter-row px-2 h-full">
              <ContentCardView
                url={`/library/media/${item._id}`}
                image={
                  item.thumbnailUrl ||
                  (item.file_url && determineFileType(item.file_url) === 'image'
                    ? item.file_url
                    : '/assets/images/no picture yet.svg')
                }
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

function LibraryErrorMessage({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="h-full min-h-[500px] w-full flex flex-col items-center justify-center text-red-500">
      <IoIosCloseCircleOutline className="text-6xl mb-3" />
      <p className="text-lg">{children}</p>
    </div>
  );
}
