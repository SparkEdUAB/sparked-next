'use client';
import i18next from 'i18next';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicWithoutMetadata } from '@hooks/use-topic/types';
import { API_LINKS } from 'app/links';
import { Button } from 'flowbite-react';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';

export function DependencySelector({
  handleTopicSelect,
  handleUnitSelect,
  handleSubjectSelect,
  submit,
  topic,
  subject,
  unit,
}: {
  handleTopicSelect: (topic: T_TopicWithoutMetadata) => void;
  handleUnitSelect: (topic: T_UnitWithoutMetadata) => void;
  handleSubjectSelect: (topic: T_SubjectWithoutMetadata) => void;
  submit: () => string | undefined;
  topic: T_TopicWithoutMetadata | null;
  unit: T_UnitWithoutMetadata | null;
  subject: T_SubjectWithoutMetadata | null;
}) {
  return (
    <>
      <AdminPageTitle title={i18next.t('step_1_select_topic')} />

      <div className="flex flex-col gap-4">
        <Autocomplete<T_SubjectWithoutMetadata>
          url={API_LINKS.FIND_SUBJECT_BY_NAME}
          handleSelect={handleSubjectSelect}
          moduleName="subjects"
        />

        <Autocomplete<T_UnitWithoutMetadata>
          url={API_LINKS.FIND_UNITS_BY_NAME}
          handleSelect={handleUnitSelect}
          moduleName="units"
        />

        <Autocomplete<T_TopicWithoutMetadata>
          url={API_LINKS.FIND_TOPIC_BY_NAME}
          handleSelect={handleTopicSelect}
          moduleName="topics"
        />

        <Button className="mt-2" onClick={submit} disabled={!topic && !subject && !unit}>
          {i18next.t('next')}
        </Button>
      </div>
    </>
  );
}
