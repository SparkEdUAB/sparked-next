/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import useTopic from '@hooks/use-topic';
import useCourse from '@hooks/useCourse';
import useProgram from '@hooks/useProgram';
import useSchool from '@hooks/useSchool';
import useUnit from '@hooks/useUnit';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import { FormEventHandler, useEffect, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_MediaContentFields } from 'types/media-content';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import useFileUpload from '@hooks/use-file-upload';
import { message } from 'antd';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import { FileUploadSection } from './FileUploadSection';

const CreateMediaContentView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createResource, isLoading: loadingResource } = useMediaContent();
  const { uploadFile } = useFileUpload();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  // const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();
  const { fetchUnits, units, isLoading: loadingUnits } = useUnit();
  const { fetchTopics, topics, isLoading: loadingTopics } = useTopic();

  useEffect(() => {
    // fetchSchools({});
    // fetchPrograms({});
    fetchCourses({});
    fetchUnits({});
    fetchTopics({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [
      MEDIA_CONTENT_FORM_FIELDS.name.key,
      MEDIA_CONTENT_FORM_FIELDS.description.key,
      // MEDIA_CONTENT_FORM_FIELDS.school.key,
      // MEDIA_CONTENT_FORM_FIELDS.program.key,
      // MEDIA_CONTENT_FORM_FIELDS.course.key,
      // MEDIA_CONTENT_FORM_FIELDS.unit.key,
      MEDIA_CONTENT_FORM_FIELDS.topic.key,
    ];

    let result = extractValuesFromFormEvent<
      Omit<T_MediaContentFields, 'schoolId' | 'programId' | 'courseId' | 'unitId'>
    >(e, keys);

    let topic = topics.find((topic) => topic._id === result.topicId);

    if (!file || !thumbnail) {
      return message.error(i18next.t('no_file'));
    }

    try {
      setUploadingFile(true);

      let fileUrl = await uploadFile(file);
      if (!fileUrl) {
        setUploadingFile(false);
        return message.error(i18next.t('failed_to_upload'));
      }

      let thumbnailUrl = await uploadFile(thumbnail);
      if (!thumbnailUrl) {
        setUploadingFile(false);
        return message.error(i18next.t('failed_to_upload'));
      }

      createResource(
        {
          ...result,
          schoolId: topic?.schoolId,
          programId: topic?.programId,
          courseId: topic?.courseId,
          unitId: topic?.unitId,
        },
        fileUrl,
        thumbnailUrl,
        onSuccessfullyDone,
      );
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

        {/* <AdminFormSelector
          loadingItems={loadingSchools}
          disabled={isLoading || loadingSchools}
          options={schools}
          label={MEDIA_CONTENT_FORM_FIELDS.school.label}
          name={MEDIA_CONTENT_FORM_FIELDS.school.key}
        />

        <AdminFormSelector
          loadingItems={loadingPrograms}
          disabled={isLoading || loadingPrograms}
          options={programs}
          label={MEDIA_CONTENT_FORM_FIELDS.program.label}
          name={MEDIA_CONTENT_FORM_FIELDS.program.key}
        /> */}

        {/* <AdminFormSelector
          loadingItems={loadingCourses}
          disabled={isLoading || loadingCourses}
          options={courses}
          label={MEDIA_CONTENT_FORM_FIELDS.course.label}
          name={MEDIA_CONTENT_FORM_FIELDS.course.key}
        />

        <AdminFormSelector
          loadingItems={loadingUnits}
          disabled={isLoading || loadingUnits}
          options={units}
          label={MEDIA_CONTENT_FORM_FIELDS.unit.label}
          name={MEDIA_CONTENT_FORM_FIELDS.unit.key}
        /> */}

        <AdminFormSelector
          loadingItems={loadingTopics}
          disabled={isLoading || loadingTopics}
          options={topics}
          label={MEDIA_CONTENT_FORM_FIELDS.topic.label}
          name={MEDIA_CONTENT_FORM_FIELDS.topic.key}
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default observer(CreateMediaContentView);
