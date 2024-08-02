'use client';

import { AdminPageTitle } from '@components/layouts';
import useTopic from '@hooks/use-topic';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateTopicFields } from '@hooks/use-topic/types';
import { API_LINKS } from 'app/links';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_UnitFields } from '@hooks/useUnit/types';

const CreateTopicView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createTopic, isLoading } = useTopic();
  const [unit, setUnit] = useState<T_UnitFields | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const keys = [TOPIC_FORM_FIELDS.name.key, TOPIC_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateTopicFields, 'schoolId' | 'programId' | 'courseId'>>(e, keys);

    createTopic(
      {
        ...result,
        unitId: unit?._id,
        subjectId: unit?.subjectId,
        gradeId: unit?.gradeId,
      },
      onSuccessfullyDone,
    );
  };

  // const handleClick = (unit: T_UnitFields) => {
  //   setUnitId(unit?._id);
  // };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_topic')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={TOPIC_FORM_FIELDS.name.key}
          label={TOPIC_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={TOPIC_FORM_FIELDS.description.key}
          label={TOPIC_FORM_FIELDS.description.label}
          required
        />
        <Autocomplete<T_UnitFields>
          url={API_LINKS.FIND_UNITS_BY_NAME}
          handleSelect={setUnit}
          moduleName="units"
          disabled={isLoading}
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateTopicView;
