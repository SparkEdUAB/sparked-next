'use client';
import i18next from 'i18next';
import { AdminPageTitle } from '@components/layouts';
import { T_TopicWithoutMetadata } from '@hooks/use-topic/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import PreviewButton from './PreviewButton';
import { ResourceData, UploadProgress } from './types';
import { RedAsterisk } from '@components/atom';
import { HiExclamation } from 'react-icons/hi';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';

export function EditResourceData({
  resourceData,
  setResourceData,
  uploadData,
  topic,
  subject,
  unit,
  isUploading,
  uploadProgress,
  failedToUpload,
}: {
  resourceData: ResourceData[];
  setResourceData: Dispatch<SetStateAction<ResourceData[] | null>>;
  uploadData: () => void;
  topic: T_TopicWithoutMetadata | null;
  unit: T_UnitWithoutMetadata | null;
  subject: T_SubjectWithoutMetadata | null;
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
  failedToUpload: boolean;
}) {
  const buttonEnabled = useMemo(
    () => resourceData.every((value) => !!value.description && !!value.name),
    [resourceData],
  );

  return (
    <>
      <AdminPageTitle title={i18next.t('step_3_edit_resources')} />

      <h3 className="text-gray-600 dark:text-gray-400 mb-3">
        {topic ? (
          <>Topic: {topic.name}</>
        ) : unit ? (
          <>Unit: {unit.name}</>
        ) : subject ? (
          <>Subject: {subject.name}</>
        ) : null}
      </h3>

      <div className="flex flex-col gap-2">
        <div className="border-2 divide-y-2 divide-gray-200 border-gray-200 dark:divide-[#5a6372] dark:border-[#5a6372] rounded-lg">
          {resourceData.map((resource) => (
            <details key={resource.file.name} className="group">
              <summary className="flex w-full items-center justify-between p-5 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 dark:focus:ring-[#5a6372] first:rounded-t-lg last:rounded-b-lg">
                <div className="flex flex-row gap-2 items-center">
                  {resource.file.name}
                  {!isUploading && failedToUpload ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <HiExclamation color="#dd4338" size={22} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>This resource failed to upload</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                </div>
              </summary>
              <div className="p-5 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-700">
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
                        data.map((item) => (item.file === resource.file ? { ...item, name: e.target.value } : item)),
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
                          item.file === resource.file ? { ...item, description: e.target.value } : item,
                        ),
                    )
                  }
                />
              </div>
            </details>
          ))}
        </div>

        <p className="my-2">
          <RedAsterisk /> Make sure to provide a name and description for each resource
        </p>

        <Button className="mt-2" onClick={uploadData} disabled={!buttonEnabled || isUploading}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : undefined}
          {uploadProgress ? `Uploading (${uploadProgress.successful} / ${uploadProgress.outOf})` : i18next.t('upload')}
        </Button>
      </div>
    </>
  );
}
