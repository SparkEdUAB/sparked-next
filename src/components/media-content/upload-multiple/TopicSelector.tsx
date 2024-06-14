'use client';
import i18next from 'i18next';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicFields } from '@hooks/use-topic/types';
import { API_LINKS } from 'app/links';
import { Button } from 'flowbite-react';

export function TopicSelector({
  handleTopicSelect,
  chosenTopic,
  topic,
}: {
  handleTopicSelect: (topic: T_TopicFields) => void;
  chosenTopic: () => string | undefined;
  topic: T_TopicFields | null;
}) {
  return (
    <>
      <AdminPageTitle title={i18next.t('step_1_select_topic')} />

      <div className="flex flex-col gap-4">
        <Autocomplete<T_TopicFields>
          url={API_LINKS.FIND_TOPIC_BY_NAME}
          handleSelect={handleTopicSelect}
          moduleName="topics"
          required
        />

        <Button className="mt-2" onClick={chosenTopic} disabled={!topic}>
          {i18next.t('next')}
        </Button>
      </div>
    </>
  );
}
