import { T_LibrarySearchPageProps } from '@components/library/types';
import { Metadata, ResolvingMetadata } from 'next';
import { getMetadataGenerator } from 'utils/helpers/getMetadataGenerator';
import { SearchMediaContentList } from './SearchMediaContentList';

export async function generateMetadata(props: T_LibrarySearchPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);

  const title = `Searching for “${props.searchParams.q}”`;
  const description = `See the library content related to “${props.searchParams.q}”`;

  return getMetadata(title, description);
}

const LibrarySearchPage = async () => {
  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
      <SearchMediaContentList />
    </main>
  );
};

export default LibrarySearchPage;
