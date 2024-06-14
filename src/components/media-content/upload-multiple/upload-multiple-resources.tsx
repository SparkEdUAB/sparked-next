'use client';
import i18next from 'i18next';
import { T_TopicFields } from '@hooks/use-topic/types';
import { useState } from 'react';
import { useToastMessage } from 'providers/ToastMessageContext';
import { removeFileExtension } from '../../../utils/helpers/removeFileExtension';
import useMediaContent from '@hooks/use-media-content';
import useFileUpload from '@hooks/use-file-upload';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { FileSelector } from './FileSelector';
import { TopicSelector } from './TopicSelector';
import { EditResourceData } from './EditResourceData';
import { truncateText } from 'utils/helpers/truncateText';

enum UploadProcessSteps {
  SelectTopic,
  SelectFiles,
  EditResources,
}

export type ResourceData = {
  file: File;
  name: string;
  description: string;
};

export type UploadProgress = {
  successful: number;
  outOf: number;
};

export default function UploadMultipleResources({ onSuccessfullyDone }: { onSuccessfullyDone: () => void }) {
  const { createResource } = useMediaContent();
  const { uploadFile } = useFileUpload();
  const toast = useToastMessage();

  const [step, setStep] = useState(UploadProcessSteps.SelectTopic);
  const [topic, setTopic] = useState<T_TopicFields | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const [resourceData, setResourceData] = useState<ResourceData[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [failedToUpload, setFailedToUpload] = useState(false);

  const handleTopicSelect = (topic: T_TopicFields) => {
    setTopic(topic);
  };

  const chosenTopic = () => {
    if (!topic) {
      return toast.warning('Please select a topic');
    }
    setStep(UploadProcessSteps.SelectFiles);
  };

  const chosenFiles = () => {
    if (!files || files.length < 1) {
      return toast.warning('Please select some files');
    }
    setResourceData(files.map((file) => ({ file, name: removeFileExtension(file.name), description: '' })));
    setStep(UploadProcessSteps.EditResources);
  };

  const uploadData = async () => {
    if (!resourceData || resourceData.length < 1) {
      toast.error('No valid resource data provided');
      return;
    }

    if (!topic) {
      toast.error('No valid topic selected');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress({ successful: 0, outOf: resourceData.length });

      for (let resource of resourceData) {
        let fileUrl = await uploadFile(resource.file);

        if (!fileUrl) {
          setFailedToUpload(true);
          toast.error(`${i18next.t('failed_to_upload')}: ${truncateText(resource.file.name, 40)}`);
          continue;
        }

        let successful = await createResource(
          {
            name: resource.name,
            description: resource.description,
            topicId: topic._id,
            unitId: topic.unitId,
          },
          fileUrl,
        );

        if (successful) {
          setResourceData((data) => data?.filter((item) => item.file !== resource.file) || null);
          setUploadProgress((value) => value && { ...value, successful: value.successful + 1 });
        } else {
          toast.error(`${i18next.t('failed_to_upload')}: ${truncateText(resource.file.name, 40)}`);
          setFailedToUpload(true);
        }
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }

    setResourceData((data) => {
      if (data?.length === 0) {
        onSuccessfullyDone();
      }
      return data;
    });
    setUploadProgress((value) => {
      if (value) {
        toast.info(`Successfully uploaded ${value.successful} out of ${value.outOf} resources`);
      }
      return value;
    });
  };

  return step === UploadProcessSteps.EditResources && topic && resourceData && resourceData.length > 0 ? (
    <EditResourceData
      resourceData={resourceData}
      setResourceData={setResourceData}
      uploadData={uploadData}
      topic={topic}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      failedToUpload={failedToUpload}
    />
  ) : step === UploadProcessSteps.SelectFiles && topic ? (
    <FileSelector files={files} setFiles={setFiles} chosenFiles={chosenFiles} topic={topic} />
  ) : step === UploadProcessSteps.SelectTopic ? (
    <TopicSelector handleTopicSelect={handleTopicSelect} chosenTopic={chosenTopic} topic={topic} />
  ) : (
    <LibraryErrorMessage>
      An error occured (Step: {step}, Topic: {topic?.name})
    </LibraryErrorMessage>
  );
}
