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
  const { fetchUnitBySubjectsId, fetchUnitsByTopicId, units, isLoading: isUnitsLoading } = useUnit();
  const { subjects, fetchSubjects, fetchSubjectsByGradeId, isLoading: isSubjectsLoading } = useSubject();
  const { grades, fetchGrades, isLoading: isGradesLoading } = useGrade();
  const { topics, fetchTopics, fetchTopicsByGradeId, fetchTopicsBySubjectId, isLoading: isTopicsLoading } = useTopic();
  const { mediaContentTypes, fetchMediaContentTypes, isLoading: isMediaTypesLoading } = useMediaContent();

  const filteredGradeId = useSearchParams().get('grade_id');
  const filteredSubjectId = useSearchParams().get('subject_id');
  const filteredTopicId = useSearchParams().get('topic_id');

  useEffect(() => {
    fetchGrades({ limit: 20, skip: 0 });
  }, []);

  useEffect(() => {
    if (!filteredGradeId) {
      fetchSubjects({ limit: 20, skip: 0 });
    }
    if (!filteredSubjectId) {
      fetchTopics({ limit: 20, skip: 0 });
    }

    if (filteredGradeId) {
      fetchSubjectsByGradeId({ gradeId: filteredGradeId as string });
      fetchTopicsByGradeId({ gradeId: filteredGradeId as string });
    }

    if (filteredSubjectId) {
      fetchTopicsBySubjectId({ subjectId: filteredSubjectId as string });
      fetchUnitBySubjectsId({ subjectId: filteredSubjectId as string });
    }

    if (filteredTopicId) {
      fetchUnitsByTopicId({ topicId: filteredTopicId as string });
    }

    fetchMediaContentTypes({ limit: 20, skip: 0 });
  }, [filteredSubjectId, filteredGradeId, filteredTopicId]);

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
