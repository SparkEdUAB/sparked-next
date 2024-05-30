import LibraryLayout from '@components/library/libraryLayout/LibraryLayout';
import { T_RawSubjectFields } from '@hooks/useSubject/types';
import { fetcher } from '@hooks/use-swr/fetcher';
import { T_RawGradeFields } from '@hooks/useGrade/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { API_LINKS } from 'app/links';
import { BASE_URL } from 'app/shared/constants';
import { ReactNode } from 'react';
import NETWORK_UTILS from 'utils/network';
import { T_RawMediaTypeFieldes } from '@hooks/use-media-content/types';
import { T_RawTopicFields } from '@hooks/use-topic/types';
import { MEDIA_CONTENT_LIMIT } from '@components/library/constants';

export default async function Layout({ children }: { children: ReactNode | ReactNode[] }) {
  const subjectsResult = await fetcher<{ subjects: T_RawSubjectFields[] }>(
    BASE_URL + API_LINKS.FETCH_SUBJECTS + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0' }),
    { next: { revalidate: 3600 } },
  );

  const topicsResult = await fetcher<{ topics: T_RawTopicFields[] }>(
    BASE_URL +
      API_LINKS.FETCH_TOPICS +
      NETWORK_UTILS.formatGetParams({ limit: MEDIA_CONTENT_LIMIT.toString(), skip: '0' }),
    { next: { revalidate: 3600 } },
  );

  const gradesResult = await fetcher<{ grades: T_RawGradeFields[] }>(
    BASE_URL + API_LINKS.FETCH_GRADES + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0' }),
  );

  const unitsResult = await fetcher<{ units: T_RawUnitFields[] }>(
    BASE_URL + API_LINKS.FETCH_UNITS + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0' }),
    { next: { revalidate: 3600 } },
  );
  const mediaTypesResult = await fetcher<{ mediaTypes: T_RawMediaTypeFieldes[] }>(
    BASE_URL + API_LINKS.FETCH_MEDIA_TYPES + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0' }),
    { next: { revalidate: 3600 } },
  );

  return (
    <LibraryLayout
      subjects={subjectsResult instanceof Error ? [] : subjectsResult.subjects}
      topics={topicsResult instanceof Error ? [] : topicsResult.topics}
      units={unitsResult instanceof Error ? [] : unitsResult.units}
      grades={gradesResult instanceof Error ? [] : gradesResult.grades}
      mediaTypes={mediaTypesResult instanceof Error ? [] : mediaTypesResult.mediaTypes}
    >
      {children}
    </LibraryLayout>
  );
}
