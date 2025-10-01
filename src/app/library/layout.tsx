'use client';

import { ReactNode, useEffect } from 'react';
import LibraryLayout from '@components/library/libraryLayout/LibraryLayout';
import { useSearchParams } from 'next/navigation';
import useUnit from '@hooks/useUnit';
import useSubject from '@hooks/useSubject';
import useGrade from '@hooks/useGrade';
import useTopic from '@hooks/use-topic';
import {withAuthorization} from "@hocs/withAuthorization"

function LibraryLayoutWrapper({ children }: { children: ReactNode }) {
  const { fetchUnitsBySubjectId, units, setUnits, isLoading: isUnitsLoading } = useUnit();
  const { subjects, setSubjects, fetchSubjectsByGradeId, isLoading: isSubjectsLoading } = useSubject();
  const { grades, fetchGrades, isLoading: isGradesLoading } = useGrade();
  const { topics, setTopics, fetchTopicsByUnitId, isLoading: isTopicsLoading } = useTopic();

  const searchParams = useSearchParams();
  const filteredGradeId = searchParams.get('grade_id');
  const filteredSubjectId = searchParams.get('subject_id');
  const filteredUnitId = searchParams.get('unit_id');

  // Data fetching
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
      isSubjectsLoading={isSubjectsLoading}
      isUnitsLoading={isUnitsLoading}
      isTopicsLoading={isTopicsLoading}
      isGradesLoading={isGradesLoading}
    >
      {children}
    </LibraryLayout>
  );
}

export default withAuthorization(LibraryLayoutWrapper);
