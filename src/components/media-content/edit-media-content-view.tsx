/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent, { transformRawMediaContent } from '@hooks/use-media-content';
import { transformRawCourse } from '@hooks/useCourse';
import { transformRawUnit } from '@hooks/useUnit';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect, useState } from 'react';
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
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';

const EditMediaContentView = ({
  resourceId,
  onSuccessfullyDone,
}: {
  resourceId?: string;
  onSuccessfullyDone?: () => void;
}) => {
  const { editMediaContent } = useMediaContent();
  const { uploadFile } = useFileUpload();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const searchParams = useSearchParams();

  const { item: mediaContent, isLoading: loadingResource } = useAdminItemById(
    API_LINKS.FETCH_MEDIA_CONTENT_BY_ID,
    resourceId || (searchParams.get('mediaContentId') as string),
    'mediaContent',
    transformRawMediaContent,
  );

  const { items: topics, isLoading: loadingTopics } = useAdminListViewData(
    API_LINKS.FETCH_TOPICS,
    'topics',
    transformRawTopic,
  );

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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [
      MEDIA_CONTENT_FORM_FIELDS.name.key,
      MEDIA_CONTENT_FORM_FIELDS.description.key,
      MEDIA_CONTENT_FORM_FIELDS.course.key,
      MEDIA_CONTENT_FORM_FIELDS.unit.key,
      MEDIA_CONTENT_FORM_FIELDS.topic.key,
    ];

    let result = extractValuesFromFormEvent<T_MediaContentFields>(e, keys);

    setUploadingFile(true);

    let fileUrl = file ? await uploadFile(file) : undefined;
    let thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

    editMediaContent(result, fileUrl || undefined, thumbnailUrl || undefined, onSuccessfullyDone);
  };

  const isLoading = uploadingFile || loadingResource;

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
            isLoading={isLoading}
            file={file}
            setFile={setFile}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />

          <AdminFormInput
            disabled={isLoading}
            name={MEDIA_CONTENT_FORM_FIELDS.name.key}
            defaultValue={mediaContent.name}
            label={MEDIA_CONTENT_FORM_FIELDS.name.label}
            required
          />

          <AdminFormTextarea
            disabled={isLoading}
            name={MEDIA_CONTENT_FORM_FIELDS.description.key}
            defaultValue={mediaContent.description}
            label={MEDIA_CONTENT_FORM_FIELDS.description.label}
            required
            rows={4}
          />

          {/* <AdminFormSelector
            loadingItems={loadingSchools}
            disabled={isLoading || loadingSchools}
            options={schools}
            label={MEDIA_CONTENT_FORM_FIELDS.school.label}
            name={MEDIA_CONTENT_FORM_FIELDS.school.key}
            defaultValue={mediaContent.schoolId}
          />

          <AdminFormSelector
            loadingItems={loadingPrograms}
            disabled={isLoading || loadingPrograms}
            options={programs}
            label={MEDIA_CONTENT_FORM_FIELDS.program.label}
            name={MEDIA_CONTENT_FORM_FIELDS.program.key}
            defaultValue={mediaContent.programId}
          /> */}

          <AdminFormSelector
            loadingItems={loadingCourses}
            disabled={isLoading || loadingCourses}
            options={courses}
            label={MEDIA_CONTENT_FORM_FIELDS.course.label}
            name={MEDIA_CONTENT_FORM_FIELDS.course.key}
            defaultValue={mediaContent.courseId}
          />

          <AdminFormSelector
            loadingItems={loadingUnits}
            disabled={isLoading || loadingUnits}
            options={units}
            label={MEDIA_CONTENT_FORM_FIELDS.unit.label}
            name={MEDIA_CONTENT_FORM_FIELDS.unit.key}
            defaultValue={mediaContent.unitId}
          />

          <AdminFormSelector
            loadingItems={loadingTopics}
            disabled={isLoading || loadingTopics}
            options={topics}
            label={MEDIA_CONTENT_FORM_FIELDS.topic.label}
            name={MEDIA_CONTENT_FORM_FIELDS.topic.key}
            defaultValue={mediaContent.topicId}
          />

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('submit')}
          </Button>
        </form>
      )}
    </>
  );
};

export default EditMediaContentView;
