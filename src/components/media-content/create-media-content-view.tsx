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
import { Label, TextInput } from 'flowbite-react';

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
  const [isExternalResource, setIsExternalResource] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [MEDIA_CONTENT_FORM_FIELDS.name.key, MEDIA_CONTENT_FORM_FIELDS.description.key];
    const result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);

    if (!isExternalResource && !file) {
      return message.error(i18next.t('no_file'));
    }

    if (isExternalResource && !externalUrl) {
      return message.error(i18next.t('no_external_url'));
    }

    if (!topic && !subject && !unit) {
      return message.error(i18next.t('select_topic_unit_subject'));
    }

    try {
      setUploadingFile(true);

      // @ts-expect-error
      const fileUrl = isExternalResource ? null : await uploadFile(file);
      const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

      createResource(
        {
          ...(subject ? { gradeId: subject.grade_id, subjectId: subject._id } : {}),
          ...(unit ? { unitId: unit._id, gradeId: unit.grade_id, subjectId: unit.subject_id } : {}),
          ...(topic ? { unitId: topic.unit_id, topicId: topic._id, gradeId: topic.grade_id, subjectId: topic.subject_id } : {}),
          ...result,
          externalUrl: isExternalResource ? externalUrl : null,
        },
        // @ts-expect-error
        fileUrl,
        thumbnailUrl,
        onSuccessfullyDone
      );
    } catch {
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
        <div className="flex items-center gap-2 mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isExternalResource}
              onChange={() => setIsExternalResource(!isExternalResource)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">External Resource</span>
          </label>
        </div>

        {isExternalResource ? (
          <div>
            <div className="mb-1.5 block">
              <Label htmlFor="externalUrl" value="External URL" className="text-gray-700 dark:text-gray-300" />
            </div>
            <TextInput
              disabled={isLoading}
              id="externalUrl"
              name="externalUrl"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://youtube.com/resource"
              required
              className="rounded-lg"
            />
            {externalUrl && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  External resource link will be saved. Preview may not be available for all URLs.
                </p>
              </div>
            )}
          </div>
        ) : (
          <FileUploadSection
            isLoading={isLoading}
            file={file}
            setFile={setFile}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />
        )}

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
