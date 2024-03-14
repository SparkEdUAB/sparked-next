/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import useCourse from '@hooks/useCourse';
import useProgram from '@hooks/useProgram';
import useSchool from '@hooks/useSchool';
import useUnit from '@hooks/useUnit';
import { Button, FileInput, Label, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import useTopic from '@hooks/use-topic';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_MediaContentFields } from 'types/media-content';
import useFileUpload from '@hooks/use-file-upload';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';

const EditMediaContentView = ({
  resourceId,
  onSuccessfullyDone,
}: {
  resourceId?: string;
  onSuccessfullyDone?: () => void;
}) => {
  // const [form] = Form.useForm();

  // const { fileUrl } = FileUploadStore;
  // const { selectedMediaContent } = MediaContentStore;

  const { editMediaContent, fetchMediaContentById, targetMediaContent, isLoading: loadingResource } = useMediaContent();
  const { uploadFile } = useFileUpload();

  const [uploadingFile, setUploadingFile] = useState(false);

  const { fetchTopics, topics, isLoading: loadingTopics } = useTopic();
  const { fetchUnits, units, isLoading: loadingUnits } = useUnit();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchMediaContentById({
      mediaContentId: resourceId || (searchParams.get('mediaContentId') as string),
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
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

    let fileUrl: string | false | undefined = undefined;

    if (files?.[0]) {
      try {
        setUploadingFile(true);
        fileUrl = await uploadFile(files[0]);
      } finally {
        setUploadingFile(false);
      }
    }

    editMediaContent(result, fileUrl || undefined, onSuccessfullyDone);
  };

  const isLoading = uploadingFile || loadingResource;

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_media_content')} />

      {!targetMediaContent ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
          <AdminFormInput
            disabled={isLoading}
            name={MEDIA_CONTENT_FORM_FIELDS.name.key}
            defaultValue={targetMediaContent.name}
            label={MEDIA_CONTENT_FORM_FIELDS.name.label}
            required
          />

          <AdminFormInput
            disabled={isLoading}
            name={MEDIA_CONTENT_FORM_FIELDS.description.key}
            defaultValue={targetMediaContent.description}
            label={MEDIA_CONTENT_FORM_FIELDS.description.label}
            required
          />

          <AdminFormSelector
            loadingItems={loadingSchools}
            disabled={isLoading || loadingSchools}
            options={schools}
            label={MEDIA_CONTENT_FORM_FIELDS.school.label}
            name={MEDIA_CONTENT_FORM_FIELDS.school.key}
            defaultValue={targetMediaContent.schoolId}
          />

          <AdminFormSelector
            loadingItems={loadingPrograms}
            disabled={isLoading || loadingPrograms}
            options={programs}
            label={MEDIA_CONTENT_FORM_FIELDS.program.label}
            name={MEDIA_CONTENT_FORM_FIELDS.program.key}
            defaultValue={targetMediaContent.programId}
          />

          <AdminFormSelector
            loadingItems={loadingCourses}
            disabled={isLoading || loadingCourses}
            options={courses}
            label={MEDIA_CONTENT_FORM_FIELDS.course.label}
            name={MEDIA_CONTENT_FORM_FIELDS.course.key}
            defaultValue={targetMediaContent.courseId}
          />

          <AdminFormSelector
            loadingItems={loadingUnits}
            disabled={isLoading || loadingUnits}
            options={units}
            label={MEDIA_CONTENT_FORM_FIELDS.unit.label}
            name={MEDIA_CONTENT_FORM_FIELDS.unit.key}
            defaultValue={targetMediaContent.unitId}
          />

          <AdminFormSelector
            loadingItems={loadingTopics}
            disabled={isLoading || loadingTopics}
            options={topics}
            label={MEDIA_CONTENT_FORM_FIELDS.topic.label}
            name={MEDIA_CONTENT_FORM_FIELDS.topic.key}
            defaultValue={targetMediaContent.topicId}
          />

          <div id="fileUpload" className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="file" value={i18next.t('upload_file')} />
            </div>
            <FileInput id="file" name="file" disabled={isLoading} />
          </div>

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('submit')}
          </Button>
        </form>
      )}

      {/* <Row className="form-container">
        <Col span={12}>
          <Card className="form-card" title={<p className="form-label">{targetMediaContent?.name}</p>} bordered={false}>
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={targetMediaContent || {}}
              onFinish={editMediaContent}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.name.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: MEDIA_CONTENT_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.description.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: MEDIA_CONTENT_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.school.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.school.errorMsg,
                  },
                ]}
              >
                <Select
                  options={schools.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.program.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.program.errorMsg,
                  },
                ]}
              >
                <Select
                  options={programs.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.course.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.course.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.course.errorMsg,
                  },
                ]}
              >
                <Select
                  options={courses.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.unit.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.unit.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.unit.errorMsg,
                  },
                ]}
              >
                <Select
                  options={units.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={<p className="form-label">{MEDIA_CONTENT_FORM_FIELDS.topic.label}</p>}
                name={MEDIA_CONTENT_FORM_FIELDS.topic.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.topic.errorMsg,
                  },
                ]}
              >
                <Select
                  options={topics?.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button className={'form-submit-btn'} type="submit">
                  {i18next.t('submit')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t('upload_media')}</p>}
            bordered={false}
          >
            <UploadView />
          </Card>
          <Card
            style={{ minHeight: 265 }}
            className="form-card"
            title={<p className="form-label">{i18next.t('preview')}</p>}
            bordered={false}
          ></Card>
        </Col>
      </Row> */}
    </>
  );
};

export default EditMediaContentView;
