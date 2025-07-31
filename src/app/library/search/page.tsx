import type { Metadata, ResolvingMetadata } from 'next';
import { getMetadataGenerator } from 'utils/helpers/getMetadataGenerator';
import { SearchMediaContentList } from './SearchMediaContentList';

export async function generateMetadata(
  props: { params: Promise<{}>; searchParams: Promise<{ q: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const getMetadata = await getMetadataGenerator(parent);
  const { q } = await props.searchParams;

  const title = `Searching for “${q}”`;
  const description = `See the library content related to “${q}”`;

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
