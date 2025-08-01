import { T_Filters } from '@hooks/useLibrary/useSearchFilters';

export type T_LibraryPageProps = {
  params: Promise<{}>;
  searchParams: Promise<T_Filters>;
};

export type T_LibrarySearchPageProps = {
  params: Promise<{}>;
  searchParams: Promise<{ q: string }>;
};
