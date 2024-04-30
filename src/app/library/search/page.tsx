import React from 'react';
import ContentCardView from '@components/layouts/library/content-card';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import { determineFileType, getMetadataGenerator } from 'utils/helpers';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { fetcher } from '@hooks/use-swr';
import { T_RawMediaContentFields } from 'types/media-content';
import NETWORK_UTILS from 'utils/network';
import { API_LINKS } from 'app/links';
import { BASE_URL } from 'app/shared/constants';
import { T_LibrarySearchPageProps } from '@components/library/types';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(props: T_LibrarySearchPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  const title = `Searching for “${props.searchParams.q}”`;
  const description = `See the library content related to “${props.searchParams.q}”`;

  return getMetadata(title, description);
}

const LibrarySearchPage = async ({ params, searchParams }: T_LibrarySearchPageProps) => {
  const result = await fetcher<{ mediaContent: T_RawMediaContentFields[] }>(
    BASE_URL +
      API_LINKS.FIND_MEDIA_CONTENT_BY_NAME +
      NETWORK_UTILS.formatGetParams({
        name: searchParams.q,
        limit: '20',
        skip: '0',
        withMetaData: 'false',
      }),
    { next: { revalidate: 3600 } },
  );

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
      {result instanceof Error ? (
        <LibraryErrorMessage>{result.message}</LibraryErrorMessage>
      ) : !(result.mediaContent instanceof Array) ? (
        <LibraryErrorMessage>
          An error occured while fetching data (Unexpected data received):{' '}
          <code>{JSON.stringify(result, null, 4)}</code>
        </LibraryErrorMessage>
      ) : result.mediaContent.length === 0 ? (
        <EmptyContentIndicator>There is nothing here yet</EmptyContentIndicator>
      ) : (
        <div className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {result.mediaContent.map((item) => (
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

export default LibrarySearchPage;
