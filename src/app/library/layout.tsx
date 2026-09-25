'use client';

import { ReactNode, useEffect, useRef } from 'react';
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
  const hasFetchedGrades = useRef(false);
  const fetchedSubjectsForGrade = useRef<string | null | undefined>(undefined);
  const fetchedUnitsForSubject = useRef<string | null | undefined>(undefined);
  const fetchedTopicsForUnit = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (hasFetchedGrades.current) {
      return;
    }

    hasFetchedGrades.current = true;
    fetchGrades({ limit: 20, skip: 0 });
  }, [fetchGrades]);

  useEffect(() => {
    if (fetchedSubjectsForGrade.current === filteredGradeId) {
      return;
    }

    fetchedSubjectsForGrade.current = filteredGradeId;
    if (!filteredGradeId) {
      setSubjects([]);
      return;
    }

    fetchSubjectsByGradeId({ gradeId: filteredGradeId, withMetaData: true });
  }, [fetchSubjectsByGradeId, filteredGradeId, setSubjects]);

  useEffect(() => {
    if (fetchedUnitsForSubject.current === filteredSubjectId) {
      return;
    }

    fetchedUnitsForSubject.current = filteredSubjectId;
    if (!filteredSubjectId) {
      setUnits([]);
      return;
    }

    fetchUnitsBySubjectId({ subjectId: filteredSubjectId, withMetaData: true });
  }, [fetchUnitsBySubjectId, filteredSubjectId, setUnits]);

  useEffect(() => {
    if (fetchedTopicsForUnit.current === filteredUnitId) {
      return;
    }

    fetchedTopicsForUnit.current = filteredUnitId;
    if (!filteredUnitId) {
      setTopics([]);
      return;
    }

    fetchTopicsByUnitId({ unitId: filteredUnitId, withMetaData: true });
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
