'use client';
import i18next from 'i18next';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicSearchedByName } from '@hooks/use-topic/types';
import { API_LINKS } from 'app/links';
import { Button } from 'flowbite-react';
import { T_UnitSearchedByName } from '@hooks/useUnit/types';
import { T_SubjectSearchedByName } from '@hooks/useSubject/types';

export function DependencySelector({
  handleTopicSelect,
  handleUnitSelect,
  handleSubjectSelect,
  submit,
  topic,
  subject,
  unit,
}: {
  handleTopicSelect: (topic: T_TopicSearchedByName) => void;
  handleUnitSelect: (topic: T_UnitSearchedByName) => void;
  handleSubjectSelect: (topic: T_SubjectSearchedByName) => void;
  submit: () => string | undefined;
  topic: T_TopicSearchedByName | null;
  unit: T_UnitSearchedByName | null;
  subject: T_SubjectSearchedByName | null;
}) {
  return (
    <>
      <AdminPageTitle title={i18next.t('step_1_select_topic')} />

      <div className="flex flex-col gap-4">
        <Autocomplete<T_SubjectSearchedByName>
          url={API_LINKS.FIND_SUBJECT_BY_NAME}
          handleSelect={handleSubjectSelect}
          moduleName="subjects"
        />

        <Autocomplete<T_UnitSearchedByName>
          url={API_LINKS.FIND_UNITS_BY_NAME}
          handleSelect={handleUnitSelect}
          moduleName="units"
        />

        <Autocomplete<T_TopicSearchedByName>
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
