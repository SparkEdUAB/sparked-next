import i18next from 'i18next';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicFields } from '@hooks/use-topic/types';
import { Button } from 'flowbite-react';
import { Dispatch, SetStateAction } from 'react';
import { DragAndDropFileInput } from '../DragAndDropFileInput';

export function FileSelector({
  files,
  setFiles,
  chosenFiles,
  topic,
}: {
  files: File[] | null;
  setFiles: Dispatch<SetStateAction<File[] | null>>;
  chosenFiles: () => string | undefined;
  topic: T_TopicFields;
}) {
  return (
    <>
      <AdminPageTitle title={i18next.t('step_2_select_files')} />

      <h3 className="text-gray-600 dark:text-gray-400 mb-3">Topic: {topic.name}</h3>

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
