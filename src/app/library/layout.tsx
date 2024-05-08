import LibraryLayout from '@components/library/libraryLayout/LibraryLayout';
import { fetcher } from '@hooks/use-swr/fetcher';
import { T_RawCourseFields } from '@hooks/useCourse/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { API_LINKS } from 'app/links';
import { BASE_URL } from 'app/shared/constants';
import { ReactNode } from 'react';
import NETWORK_UTILS from 'utils/network';

export default async function Layout({ children }: { children: ReactNode | ReactNode[] }) {
  const coursesResult = await fetcher<{ courses: T_RawCourseFields[] }>(
    BASE_URL + API_LINKS.FETCH_COURSES + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0' }),
    { next: { revalidate: 3600 } },
  );

  const unitsResult = await fetcher<{ units: T_RawUnitFields[] }>(
    BASE_URL + API_LINKS.FETCH_UNITS + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0' }),
    { next: { revalidate: 3600 } },
  );

  return (
    <LibraryLayout
      courses={coursesResult instanceof Error ? [] : coursesResult.courses}
      units={unitsResult instanceof Error ? [] : unitsResult.units}
    >
      {children}
    </LibraryLayout>
  );
}
