'use client';

import i18next from 'i18next';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicSearchedByName } from '@hooks/use-topic/types';
import { T_UnitSearchedByName } from '@hooks/useUnit/types';
import { T_SubjectSearchedByName } from '@hooks/useSubject/types';
import { Button } from 'flowbite-react';
import { Dispatch, SetStateAction } from 'react';
import { DragAndDropFileInput } from '../../molecules/DragAndDropFileInput/DragAndDropFileInput';

export function FileSelector({
  files,
  setFiles,
  chosenFiles,
  topic,
  subject,
  unit,
}: {
  files: File[] | null;
  setFiles: Dispatch<SetStateAction<File[] | null>>;
  chosenFiles: () => string | undefined;
  topic: T_TopicSearchedByName | null;
  unit: T_UnitSearchedByName | null;
  subject: T_SubjectSearchedByName | null;
}) {
  return (
    <>
      <AdminPageTitle title={i18next.t('step_2_select_files')} />

      <h3 className="text-gray-600 dark:text-gray-400 mb-3">
        {topic ? (
          <>Topic: {topic.name}</>
        ) : unit ? (
          <>Unit: {unit.name}</>
        ) : subject ? (
          <>Subject: {subject.name}</>
        ) : null}
      </h3>

      <div className="flex flex-col gap-2">
        <DragAndDropFileInput
          id="files"
          files={files}
          onChange={setFiles}
          required={true}
          isLoading={false}
          fileTypes={['image', 'pdf', 'video']}
          multiple
          classNames={{ main: 'py-8' }}
        />

        <Button className="" onClick={chosenFiles} disabled={!files || files.length < 1}>
          {i18next.t('next')}
        </Button>
      </div>
    </>
  );
}
