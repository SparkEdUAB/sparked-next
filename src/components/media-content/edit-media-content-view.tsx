/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import { transformRawCourse } from '@hooks/useCourse';
import { transformRawUnit } from '@hooks/useUnit';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';

import { FormEventHandler, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import { transformRawTopic } from '@hooks/use-topic';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_MediaContentFields } from 'types/media-content';
import useFileUpload from '@hooks/use-file-upload';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { FileUploadSection } from './FileUploadSection';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { T_TopicFields } from '@hooks/use-topic/types';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';

const EditMediaContentView = ({
  mediaContent,
  onSuccessfullyDone,
}: {
  mediaContent: T_MediaContentFields;
  onSuccessfullyDone: () => void;
}) => {
  const { editMediaContent, deleteMediaContent } = useMediaContent();
  const { uploadFile } = useFileUpload();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);

  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  // const { item: mediaContent, isLoading: loadingResource } = useAdminItemById(
  //   API_LINKS.FETCH_MEDIA_CONTENT_BY_ID,
  //   resourceId || (searchParams.get('mediaContentId') as string),
  //   'mediaContent',
  //   transformRawMediaContent,
  // );

  const { items: courses, isLoading: loadingCourses } = useAdminListViewData(
    API_LINKS.FETCH_COURSES,
    'courses',
    transformRawCourse,
  );

  const { items: units, isLoading: loadingUnits } = useAdminListViewData(
    API_LINKS.FETCH_UNITS,
    'units',
    transformRawUnit,
  );

  const { item: topic, isLoading: loadingTopics } = useAdminItemById(
    API_LINKS.FETCH_TOPIC_BY_ID,
    mediaContent.topicId as string,
    'topic',
    transformRawTopic,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [
      MEDIA_CONTENT_FORM_FIELDS.name.key,
      MEDIA_CONTENT_FORM_FIELDS.description.key,
      MEDIA_CONTENT_FORM_FIELDS.course.key,
      MEDIA_CONTENT_FORM_FIELDS.unit.key,
    ];

    let result = extractValuesFromFormEvent<T_MediaContentFields>(e, keys);

    setUploading(true);

    try {
      let fileUrl = file ? await uploadFile(file) : undefined;
      let thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

      await editMediaContent(
        { ...mediaContent, ...result, topicId: topicId as string },
        fileUrl || undefined,
        thumbnailUrl || undefined,
        onSuccessfullyDone,
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClick = (topic: T_TopicFields) => {
    setTopicId(topic?._id);
  };
  return (
    <>
      <AdminPageTitle title={i18next.t('edit_media_content')} />

      {!mediaContent ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : mediaContent instanceof Error ? (
        <LibraryErrorMessage>{mediaContent.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
          <FileUploadSection
            isLoading={uploading}
            file={file}
            setFile={setFile}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />

          <AdminFormInput
            disabled={uploading}
            name={MEDIA_CONTENT_FORM_FIELDS.name.key}
            defaultValue={mediaContent.name}
            label={MEDIA_CONTENT_FORM_FIELDS.name.label}
            required
          />

          <AdminFormTextarea
            disabled={uploading}
            name={MEDIA_CONTENT_FORM_FIELDS.description.key}
            defaultValue={mediaContent.description}
            label={MEDIA_CONTENT_FORM_FIELDS.description.label}
            required
            rows={4}
          />

          <AdminFormSelector
            loadingItems={loadingCourses}
            disabled={uploading || loadingCourses}
            options={courses}
            label={MEDIA_CONTENT_FORM_FIELDS.course.label}
            name={MEDIA_CONTENT_FORM_FIELDS.course.key}
            defaultValue={mediaContent.courseId}
          />

          <AdminFormSelector
            loadingItems={loadingUnits}
            disabled={uploading || loadingUnits}
            options={units}
            label={MEDIA_CONTENT_FORM_FIELDS.unit.label}
            name={MEDIA_CONTENT_FORM_FIELDS.unit.key}
            defaultValue={mediaContent.unitId}
          />

          <Autocomplete
            url={API_LINKS.FIND_TOPIC_BY_NAME}
            handleSelect={handleClick}
            moduleName="topics"
            defaultValue={topic?.name}
          />

          <Button type="submit" className="mt-2" disabled={uploading}>
            {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('update')}
          </Button>

          <Button color="red" onClick={toggleDeletionWarning} disabled={uploading}>
            {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('delete')}
          </Button>
        </form>
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={async () => {
          try {
            setUploading(true);
            const successful = await deleteMediaContent([mediaContent]);
            if (successful) {
              onSuccessfullyDone();
            }
          } finally {
            setUploading(false);
          }
        }}
        numberOfElements={1}
      />
    </>
  );
};

export default EditMediaContentView;
