'use client';
import LibraryLayout from '@components/library/libraryLayout/LibraryLayout';
import { ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useUnit from '@hooks/useUnit';
import useSubject from '@hooks/useSubject';
import useGrade from '@hooks/useGrade';
import useTopic from '@hooks/use-topic';
import useMediaContent from '@hooks/use-media-content';

export default function Layout({ children }: { children: ReactNode | ReactNode[]; params: any }) {
  const searchParams = useSearchParams();
  const { fetchUnitBySubjectsId, fetchUnitsByTopicId, units, isLoading: isUnitsLoading } = useUnit();
  const { subjects, fetchSubjects, fetchSubjectsByGradeId, isLoading: isSubjectsLoading } = useSubject();
  const { grades, fetchGrades, isLoading: isGradesLoading } = useGrade();
  const { topics, fetchTopics, fetchTopicsByGradeId, fetchTopicsByUnitId, isLoading: isTopicsLoading } = useTopic();
  const { mediaContentTypes, fetchMediaContentTypes, isLoading: isMediaTypesLoading } = useMediaContent();

  const filteredIds = {
    gradeId: searchParams.get('grade_id'),
    subjectId: searchParams.get('subject_id'),
    unitId: searchParams.get('unit_id'),
    topicId: searchParams.get('topic_id'),
  };

  /*
  * Grade
  * subject
  * units
  * topics & media
  * */

  // Fetch all grades
  useEffect(() => {
    fetchGrades({ limit: 20, skip: 0 });
  }, []);

  useEffect(() => {
    if (filteredIds.gradeId) {
      fetchSubjectsByGradeId({ gradeId: filteredIds.gradeId });
    }

    if (filteredIds.subjectId) {
      fetchUnitBySubjectsId({ subjectId: filteredIds.subjectId });
    }

    if (filteredIds.unitId) {
      fetchTopicsByUnitId({ unitId: filteredIds.unitId });
      fetchMediaContentTypes({ limit: 20, skip: 0 });
    }
  }, [filteredIds.gradeId, filteredIds.subjectId, filteredIds.unitId, ]);

  const safeData = (data: any[] | Error):any[] => data instanceof Error ? [] :data;

  return (
    <LibraryLayout
      subjects={safeData( subjects)}
      topics={safeData( topics)}
      units={safeData( units)}
      grades={safeData( grades)}
      mediaTypes={safeData( mediaContentTypes)}
      isSubjectsLoading={isSubjectsLoading}
      isUnitsLoading={isUnitsLoading}
      isTopicsLoading={isTopicsLoading}
      isGradesLoading={isGradesLoading}
      isMediaTypesLoading={isMediaTypesLoading}
    >
      {children}
    </LibraryLayout>
  );
}
