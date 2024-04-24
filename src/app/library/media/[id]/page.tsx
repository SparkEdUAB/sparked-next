import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { fetcher } from '@hooks/use-swr';
import { API_LINKS } from 'app/links';
import { BASE_URL } from 'app/shared/constants';
import { Metadata, ResolvingMetadata } from 'next';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType, getMetadataGenerator } from 'utils/helpers';
import NETWORK_UTILS from 'utils/network';
import { MediaContentView } from '../../../../components/library/MediaContentView';

type T_MediaContentPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata(props: T_MediaContentPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  const result = await fetcher<{ mediaContent: T_RawMediaContentFields }>(
    BASE_URL +
      API_LINKS.FETCH_MEDIA_CONTENT_BY_ID +
      NETWORK_UTILS.formatGetParams({ mediaContentId: props.params.id, withMetaData: 'false' }),
  );

  if (result instanceof Error) {
    return getMetadata('Media Content View', 'Shows details about the selected media content file');
  } else {
    const mediaContent = result.mediaContent;
    const thumbnail =
      mediaContent.thumbnailUrl ||
      (mediaContent.file_url && determineFileType(mediaContent.file_url) === 'image'
        ? mediaContent.file_url
        : undefined);

    return getMetadata(mediaContent.name, mediaContent.description, thumbnail);
  }
}

export default async function MediaContentPage({ params }: T_MediaContentPageProps) {
  const result = await fetcher<{ mediaContent: T_RawMediaContentFields }>(
    BASE_URL +
      API_LINKS.FETCH_MEDIA_CONTENT_BY_ID +
      NETWORK_UTILS.formatGetParams({ mediaContentId: params.id, withMetaData: 'false' }),
  );

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)] py-6 px-4">
      {result instanceof Error ? (
        <LibraryErrorMessage>{result.message}</LibraryErrorMessage>
      ) : (
        <MediaContentView mediaContent={result.mediaContent} />
      )}
    </main>
  );
}
