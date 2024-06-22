'use client';
import LibraryLayout from '@components/library/libraryLayout/LibraryLayout';
import { ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useUnit from '@hooks/useUnit';
import useSubject from '@hooks/useSubject';
import useGrade from '@hooks/useGrade';
import useTopic from '@hooks/use-topic';
import useMediaContent from '@hooks/use-media-content';

export default function Layout({ children, params }: { children: ReactNode | ReactNode[]; params: any }) {
  const { fetchUnitBySubjectsId, units, isLoading: isUnitsLoading } = useUnit();
  const { subjects, fetchSubjects, fetchSubjectsByGradeId, isLoading: isSubjectsLoading } = useSubject();
  const { grades, fetchGrades } = useGrade();
  const { topics, fetchTopics } = useTopic();
  const { mediaContentTypes, fetchMediaContentTypes } = useMediaContent();

  const filteredGradeId = useSearchParams().get('grade_id');
  const filteredSubjectId = useSearchParams().get('subject_id');

  useEffect(() => {
    if (filteredSubjectId) {
      fetchUnitBySubjectsId({ subjectId: filteredSubjectId as string });
    }

    if (filteredGradeId) {
      fetchSubjectsByGradeId({ gradeId: filteredGradeId as string });
    } else {
      fetchSubjects({ limit: 20, skip: 0 });
    }

    fetchGrades({ limit: 20, skip: 0 });

    fetchTopics({ limit: 20, skip: 0 });
    fetchMediaContentTypes({ limit: 20, skip: 0 });
  }, [filteredSubjectId, filteredGradeId]);

  return (
    <LibraryLayout
      subjects={subjects instanceof Error ? [] : subjects}
      topics={topics instanceof Error ? [] : topics}
      units={units instanceof Error ? [] : units}
      grades={grades instanceof Error ? [] : grades}
      mediaTypes={mediaContentTypes instanceof Error ? [] : mediaContentTypes}
      isSubjectsLoading={isSubjectsLoading}
      isUnitsLoading={isUnitsLoading}
    >
      {children}
    </LibraryLayout>
  );
}
