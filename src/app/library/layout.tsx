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
  const { fetchUnitsBySubjectId, units, setUnits, isLoading: isUnitsLoading } = useUnit();
  const { subjects, setSubjects, fetchSubjectsByGradeId, isLoading: isSubjectsLoading } = useSubject();
  const { grades, fetchGrades, isLoading: isGradesLoading } = useGrade();
  const { topics, setTopics, fetchTopicsByUnitId, isLoading: isTopicsLoading } = useTopic();
  const { mediaContentTypes, isLoading: isMediaTypesLoading } = useMediaContent();

  const filteredGradeId = useSearchParams().get('grade_id');
  const filteredSubjectId = useSearchParams().get('subject_id');
  const filteredUnitId = useSearchParams().get('unit_id');

  useEffect(() => {
    fetchGrades({ limit: 20, skip: 0 });
  }, [fetchGrades]);

  useEffect(() => {
    if (filteredGradeId) {
      fetchSubjectsByGradeId({ gradeId: filteredGradeId, withMetaData: true });
    }
    return () => setSubjects([]);
  }, [fetchSubjectsByGradeId, filteredGradeId, setSubjects]);

  useEffect(() => {
    if (filteredSubjectId) {
      fetchUnitsBySubjectId({ subjectId: filteredSubjectId, withMetaData: true });
    }
    return () => setUnits([]);
  }, [fetchUnitsBySubjectId, filteredSubjectId, setUnits]);

  useEffect(() => {
    if (filteredUnitId) {
      fetchTopicsByUnitId({ unitId: filteredUnitId, withMetaData: true });
    }
    return () => setTopics([]);
  }, [fetchTopicsByUnitId, filteredUnitId, setTopics]);

  return (
    <LibraryLayout
      subjects={subjects instanceof Error ? [] : subjects}
      topics={topics instanceof Error ? [] : topics}
      units={units instanceof Error ? [] : units}
      grades={grades instanceof Error ? [] : grades}
      mediaTypes={mediaContentTypes instanceof Error ? [] : mediaContentTypes}
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
