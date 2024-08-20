'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import useFileUpload from '@hooks/use-file-upload';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import { FileUploadSection } from './FileUploadSection';
import { API_LINKS } from 'app/links';
import { useToastMessage } from 'providers/ToastMessageContext';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_TopicWithoutMetadata } from '@hooks/use-topic/types';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { T_NameAndDescription } from 'types';

const CreateMediaContentView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createResource, isLoading: loadingResource } = useMediaContent();
  const { uploadFile } = useFileUpload();
  const message = useToastMessage();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);
  const [unit, setUnit] = useState<T_UnitWithoutMetadata | null>(null);
  const [topic, setTopic] = useState<T_TopicWithoutMetadata | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [MEDIA_CONTENT_FORM_FIELDS.name.key, MEDIA_CONTENT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);

    if (!file) {
      return message.error(i18next.t('no_file'));
    }

    if (!topic && !subject && !unit) {
      return message.error(i18next.t('select_topic_unit_subject'));
    }

    try {
      setUploadingFile(true);

      let fileUrl = await uploadFile(file);

      if (!fileUrl) {
        setUploadingFile(false);
        return message.error(i18next.t('failed_to_upload'));
      }

      let thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

      createResource(
        {
          ...(subject
            ? {
                gradeId: subject.grade_id,
                subjectId: subject._id,
              }
            : {}),
          ...(unit
            ? {
                unitId: unit._id,
                gradeId: unit.grade_id,
                subjectId: unit.subject_id,
              }
            : {}),
          ...(topic
            ? {
                unitId: topic.unit_id,
                topicId: topic._id,
                gradeId: topic.grade_id,
                subjectId: topic.subject_id,
              }
            : {}),
          ...result,
        },
        fileUrl,
        thumbnailUrl || undefined,
        onSuccessfullyDone,
      );
    } catch (error) {
      message.error(i18next.t('failed_to_upload'));
    } finally {
      setUploadingFile(false);
    }
  };

  const isLoading = uploadingFile || loadingResource;

  return (
    <>
      <AdminPageTitle title={i18next.t('create_resource')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <FileUploadSection
          isLoading={isLoading}
          file={file}
          setFile={setFile}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
        />

        <AdminFormInput
          disabled={isLoading}
          name={MEDIA_CONTENT_FORM_FIELDS.name.key}
          label={MEDIA_CONTENT_FORM_FIELDS.name.label}
          required
        />

        <AdminFormTextarea
          disabled={isLoading}
          name={MEDIA_CONTENT_FORM_FIELDS.description.key}
          label={MEDIA_CONTENT_FORM_FIELDS.description.label}
          required
          rows={4}
        />

        <Autocomplete<T_SubjectWithoutMetadata>
          url={API_LINKS.FIND_SUBJECT_BY_NAME}
          handleSelect={setSubject}
          moduleName="subjects"
          disabled={isLoading}
        />

        <Autocomplete<T_UnitWithoutMetadata>
          url={API_LINKS.FIND_UNITS_BY_NAME}
          handleSelect={setUnit}
          moduleName="units"
          disabled={isLoading}
        />

        <Autocomplete<T_TopicWithoutMetadata>
          url={API_LINKS.FIND_TOPIC_BY_NAME}
          handleSelect={setTopic}
          moduleName="topics"
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

export default CreateMediaContentView;
