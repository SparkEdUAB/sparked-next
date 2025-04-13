'use client';
import i18next from 'i18next';
import { T_TopicWithoutMetadata } from '@hooks/use-topic/types';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { useState } from 'react';
import { useToastMessage } from 'providers/ToastMessageContext';
import { removeFileExtension } from '../../../utils/helpers/removeFileExtension';
import useMediaContent from '@hooks/use-media-content';
import useFileUpload from '@hooks/use-file-upload';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { FileSelector } from './FileSelector';
import { DependencySelector } from './DependencySelector';
import { EditResourceData } from './EditResourceData';
import { truncateText } from 'utils/helpers/truncateText';
import { UploadProcessSteps, ResourceData, UploadProgress } from './types';

export default function UploadMultipleResources({ onSuccessfullyDone }: { onSuccessfullyDone: () => void }) {
  const { createResource } = useMediaContent();
  const { uploadFile } = useFileUpload();
  const toast = useToastMessage();

  const [step, setStep] = useState(UploadProcessSteps.SelectDependencies);
  const [files, setFiles] = useState<File[] | null>(null);
  const [resourceData, setResourceData] = useState<ResourceData[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [failedToUpload, setFailedToUpload] = useState(false);

  const [topic, setTopic] = useState<T_TopicWithoutMetadata | null>(null);
  const [unit, setUnit] = useState<T_UnitWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);

  const handleTopicSelect = (topic: T_TopicWithoutMetadata | null) => setTopic(topic);
  const handleUnitSelect = (unit: T_UnitWithoutMetadata | null) => setUnit(unit);
  const handleSubjectSelect = (subject: T_SubjectWithoutMetadata | null) => setSubject(subject);

  const chosenDependencies = () => {
    if (!topic && !unit && !subject) {
      return toast.warning('Please select a topic or subject or unit');
    }
    setStep(UploadProcessSteps.SelectFiles);
  };

  const chosenFiles = () => {
    if (!files || files.length < 1) {
      return toast.warning('Please select some files');
    }
    setResourceData(
      files.map((file) => ({ file, name: removeFileExtension(file.name).replaceAll('_', ' '), description: '' })),
    );
    setStep(UploadProcessSteps.EditResources);
  };

  const uploadData = async () => {
    if (!resourceData || resourceData.length < 1) {
      toast.error('No valid resource data provided');
      return;
    }

    if (!topic && !unit && !subject) {
      toast.error('No topic or unit or subject selected');
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
            ...(subject
              ? {
                  gradeId: subject.grade_id,
                  subjectId: subject._id,
                }
              : {}),
            ...(unit
              ? {
                  unitId: unit._id,
                  gradeId: unit.grade_id,
                  subjectId: unit.subject_id,
                }
              : {}),
            ...(topic
              ? {
                  unitId: topic.unit_id,
                  topicId: topic._id,
                  gradeId: topic.grade_id,
                  subjectId: topic.subject_id,
                }
              : {}),
            name: resource.name,
            description: resource.description,
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

  return step === UploadProcessSteps.EditResources &&
    (topic || subject || unit) &&
    resourceData &&
    resourceData.length > 0 ? (
    <EditResourceData
      resourceData={resourceData}
      setResourceData={setResourceData}
      uploadData={uploadData}
      topic={topic}
      subject={subject}
      unit={unit}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      failedToUpload={failedToUpload}
    />
  ) : step === UploadProcessSteps.SelectFiles && (topic || subject || unit) ? (
    <FileSelector
      files={files}
      setFiles={setFiles}
      chosenFiles={chosenFiles}
      topic={topic}
      subject={subject}
      unit={unit}
    />
  ) : step === UploadProcessSteps.SelectDependencies ? (
    <DependencySelector
      handleTopicSelect={handleTopicSelect}
      handleSubjectSelect={handleSubjectSelect}
      handleUnitSelect={handleUnitSelect}
      topic={topic}
      subject={subject}
      unit={unit}
      submit={chosenDependencies}
    />
  ) : (
    <LibraryErrorMessage>
      An error occured (Step: {step}, Topic: {topic?.name}, Unit: {unit?.name}, Subject: {subject?.name})
    </LibraryErrorMessage>
  );
}
