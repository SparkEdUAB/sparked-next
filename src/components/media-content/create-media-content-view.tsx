/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import UploadView from '@components/molecue/upload-view';
import useMediaContent from '@hooks/use-media-content';
import useTopic from '@hooks/use-topic';
import useCourse from '@hooks/useCourse';
import useProgram from '@hooks/useProgram';
import useSchool from '@hooks/useSchool';
import useUnit from '@hooks/useUnit';
import FileUploadStore from '@state/mobx/fileUploadStore';
import MediaContentStore from '@state/mobx/mediaContentStore';
import { Button, FileInput, Label, Spinner } from 'flowbite-react';
import i18next, { loadResources } from 'i18next';
import { observer } from 'mobx-react-lite';
import { FormEventHandler, useEffect, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_MediaContentFields } from 'types/media-content';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import useFileUpload from '@hooks/use-file-upload';
import { message } from 'antd';

const CreateMediaContentView: React.FC = () => {
  const { createResource, isLoading: loadingResource } = useMediaContent();
  const { uploadFile } = useFileUpload();

  const [uploadingFile, setUploadingFile] = useState(false);

  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();
  const { fetchUnits, units, isLoading: loadingUnits } = useUnit();
  const { fetchTopics, topics, isLoading: loadingTopics } = useTopic();

  // const { selectedMediaContent } = MediaContentStore;
  // const { fileUrl } = FileUploadStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
    fetchCourses({});
    fetchUnits({});
    fetchTopics({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [
      MEDIA_CONTENT_FORM_FIELDS.name.key,
      MEDIA_CONTENT_FORM_FIELDS.description.key,
      MEDIA_CONTENT_FORM_FIELDS.school.key,
      MEDIA_CONTENT_FORM_FIELDS.program.key,
      MEDIA_CONTENT_FORM_FIELDS.course.key,
      MEDIA_CONTENT_FORM_FIELDS.unit.key,
      MEDIA_CONTENT_FORM_FIELDS.topic.key,
    ];

    let result = extractValuesFromFormEvent<T_MediaContentFields>(e, keys);

    const form = e.target as HTMLFormElement;
    const files = (form.elements.namedItem('file') as HTMLInputElement).files;

    if (!files) {
      return message.error(i18next.t('no_file'));
    }

    try {
      setUploadingFile(true);
      let fileUrl = await uploadFile(files[0]);

      if (!fileUrl) {
        setUploadingFile(false);
        return message.error(i18next.t('failed_to_upload'));
      }

      createResource(result, fileUrl);
    } finally {
      setUploadingFile(false);
    }
  };

  const isLoading = uploadingFile || loadingResource;

  return (
    <>
      <AdminPageTitle title={i18next.t('create_resource')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={MEDIA_CONTENT_FORM_FIELDS.name.key}
          label={MEDIA_CONTENT_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={MEDIA_CONTENT_FORM_FIELDS.description.key}
          label={MEDIA_CONTENT_FORM_FIELDS.description.label}
          required
        />

        <AdminFormSelector
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
        />

        <AdminFormSelector
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
        />

        <AdminFormSelector
          loadingItems={loadingTopics}
          disabled={isLoading || loadingTopics}
          options={topics}
          label={MEDIA_CONTENT_FORM_FIELDS.topic.label}
          name={MEDIA_CONTENT_FORM_FIELDS.topic.key}
        />

        <div id="fileUpload" className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="file" value={i18next.t('upload_file')} />
          </div>
          <FileInput id="file" required name="file" disabled={isLoading} />
        </div>

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default observer(CreateMediaContentView);
