import { T_Filters } from '@hooks/useLibrary/useSearchFilters';

export type T_LibraryPageProps = {
  params: {};
  searchParams: T_Filters;
};

export type T_LibrarySearchPageProps = {
  params: {};
  searchParams: {
    q: string;
  };
};
