'use client';
import i18next from 'i18next';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicWithoutMetadata } from '@hooks/use-topic/types';
import { API_LINKS } from 'app/links';
import { Button } from 'flowbite-react';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import SelectList from '@components/atom/SelectList/SelectList';
import { useEffect, useState } from 'react';
import { T_GradeWithoutMetadata } from '@hooks/useGrade/types';

export function DependencySelector({
  handleTopicSelect,
  handleUnitSelect,
  handleSubjectSelect,
  submit,
  topic,
  subject,
  unit,
}: {
  handleTopicSelect: (topic: T_TopicWithoutMetadata | null) => void;
  handleUnitSelect: (unit: T_UnitWithoutMetadata | null) => void;
  handleSubjectSelect: (subject: T_SubjectWithoutMetadata | null) => void;
  submit: () => string | undefined;
  topic: T_TopicWithoutMetadata | null;
  unit: T_UnitWithoutMetadata | null;
  subject: T_SubjectWithoutMetadata | null;
}) {
  const [grade, setGrade] = useState<T_GradeWithoutMetadata | null>(null);

  // Reset dependent selections when parent selection changes
  useEffect(() => {
    if (!grade) {
      handleSubjectSelect(null);
    }
  }, [grade, handleSubjectSelect]);

  useEffect(() => {
    if (!subject) {
      handleUnitSelect(null);
    }
  }, [subject, handleUnitSelect]);

  useEffect(() => {
    if (!unit) {
      handleTopicSelect(null);
    }
  }, [unit, handleTopicSelect]);

  const handleGradeSelect = (selectedGrade: T_GradeWithoutMetadata | null) => {
    setGrade(selectedGrade);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('step_1_select_topic')} />

      <div className="flex flex-col gap-4">
        <SelectList<T_GradeWithoutMetadata>
          url={API_LINKS.FETCH_GRADES}
          handleSelect={handleGradeSelect}
          moduleName="grades"
          label="Grade"
          selectedItem={grade}
          placeholder="Select a grade"
          required
        />

        <SelectList<T_SubjectWithoutMetadata>
          url={API_LINKS.FETCH_SUBJECTS_BY_GRADE_ID}
          handleSelect={handleSubjectSelect}
          moduleName="subjects"
          label="Subject"
          disabled={!grade}
          selectedItem={subject}
          placeholder={grade ? 'Select a subject' : 'Select a grade first'}
          queryParams={{ gradeId: grade?._id || '' }}
          required
        />

        <SelectList<T_UnitWithoutMetadata>
          url={API_LINKS.FETCH_UNITS_BY_SUBJECT_ID}
          handleSelect={handleUnitSelect}
          moduleName="units"
          label="Unit"
          disabled={!subject}
          selectedItem={unit}
          placeholder={subject ? 'Select a unit' : 'Select a subject first'}
          queryParams={{ subjectId: subject?._id || '' }}
        />

        <SelectList<T_TopicWithoutMetadata>
          url={API_LINKS.FETCH_TOPICS_BY_UNIT_ID}
          handleSelect={handleTopicSelect}
          moduleName="topics"
          label="Topic"
          disabled={!unit}
          selectedItem={topic}
          placeholder={unit ? 'Select a topic' : 'Select a unit first'}
          queryParams={{ unitId: unit?._id || '' }}
        />

        <Button className="mt-2" onClick={submit} disabled={!topic && !subject && !unit}>
          {i18next.t('next')}
        </Button>
      </div>
    </>
  );
}
