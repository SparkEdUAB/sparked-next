'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import { transformRawTopic } from '@hooks/use-topic';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_MediaContentFields } from 'types/media-content';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import useFileUpload from '@hooks/use-file-upload';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import { FileUploadSection } from './FileUploadSection';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { useToastMessage } from 'providers/ToastMessageContext';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_TopicFields } from '@hooks/use-topic/types';

const CreateMediaContentView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createResource, isLoading: loadingResource } = useMediaContent();
  const { uploadFile } = useFileUpload();
  const message = useToastMessage();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);

  const { items: topics, isLoading: loadingTopics } = useAdminListViewData(
    API_LINKS.FETCH_TOPICS,
    'topics',
    transformRawTopic,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [MEDIA_CONTENT_FORM_FIELDS.name.key, MEDIA_CONTENT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<
      Omit<T_MediaContentFields, 'schoolId' | 'programId' | 'courseId' | 'unitId'>
    >(e, keys);

    let topic = topics.find((topic) => topic._id === result.topicId);

    if (!file) {
      return message.error(i18next.t('no_file'));
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
          ...result,
          topicId: topicId as string,
          schoolId: topic?.schoolId,
          programId: topic?.programId,
          courseId: topic?.courseId,
          unitId: topic?.unitId,
        },
        fileUrl,
        thumbnailUrl || undefined,
        onSuccessfullyDone,
      );
    } finally {
      setUploadingFile(false);
    }
  };

  const isLoading = uploadingFile || loadingResource;

  const handleClick = (topic: T_TopicFields) => {
    setTopicId(topic?._id);
  };
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
          required
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

        <Autocomplete url={API_LINKS.FIND_TOPIC_BY_NAME} handleSelect={handleClick} moduleName="topics" />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateMediaContentView;
