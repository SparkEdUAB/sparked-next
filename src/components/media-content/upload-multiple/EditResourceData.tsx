'use client';
import i18next from 'i18next';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicFields } from '@hooks/use-topic/types';
import { Accordion, Button, Spinner } from 'flowbite-react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import { PreviewButton } from './PreviewButton';
import { ResourceData, UploadProgress } from './upload-multiple-resources';

export function EditResourceData({
  resourceData,
  setResourceData,
  uploadData,
  topic,
  isUploading,
  uploadProgress,
}: {
  resourceData: ResourceData[];
  setResourceData: Dispatch<SetStateAction<ResourceData[] | null>>;
  uploadData: () => void;
  topic: T_TopicFields;
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
}) {
  const buttonEnabled = useMemo(
    () => resourceData.every((value) => !!value.description && !!value.name),
    [resourceData],
  );

  return (
    <>
      <AdminPageTitle title={i18next.t('step_3_edit_resources')} />

      <h3 className="text-gray-600 dark:text-gray-400 mb-3">Topic: {topic.name}</h3>

      <div className="flex flex-col gap-2">
        <Accordion className="border-2">
          {resourceData.map((resource) => (
            <Accordion.Panel key={resource.file.name}>
              <Accordion.Title>{resource.file.name}</Accordion.Title>
              <Accordion.Content>
                <PreviewButton file={resource.file} />
                <AdminFormInput
                  disabled={false}
                  name="name"
                  label="Name"
                  defaultValue={resource.name}
                  required
                  onBlur={(e) =>
                    setResourceData(
                      (data) =>
                        data &&
                        data.map((item) => (item.file == resource.file ? { ...item, name: e.target.value } : item)),
                    )
                  }
                />
                <br />
                <AdminFormTextarea
                  disabled={false}
                  name="description"
                  label="Description"
                  defaultValue={resource.description}
                  required
                  rows={3}
                  onBlur={(e) =>
                    setResourceData(
                      (data) =>
                        data &&
                        data.map((item) =>
                          item.file == resource.file ? { ...item, description: e.target.value } : item,
                        ),
                    )
                  }
                />
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>

        <Button className="mt-2" onClick={uploadData} disabled={!buttonEnabled || isUploading}>
          {isUploading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {uploadProgress ? `Uploading (${uploadProgress.successful} / ${uploadProgress.outOf})` : i18next.t('next')}
        </Button>
      </div>
    </>
  );
}
