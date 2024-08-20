'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';

import { FormEventHandler, useState } from 'react';
import { MEDIA_CONTENT_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_MediaContentFields } from 'types/media-content';
import useFileUpload from '@hooks/use-file-upload';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { FileUploadSection } from './FileUploadSection';
import { AdminFormTextarea } from '@components/admin/AdminForm/AdminFormTextarea';
import { API_LINKS } from 'app/links';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { T_TopicWithoutMetadata } from '@hooks/use-topic/types';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_NameAndDescription } from 'types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';

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
  const [topic, setTopic] = useState<T_TopicWithoutMetadata | null>(null);
  const [unit, setUnit] = useState<T_UnitWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);

  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const keys = [MEDIA_CONTENT_FORM_FIELDS.name.key, MEDIA_CONTENT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);

    setUploading(true);

    try {
      let fileUrl = file ? await uploadFile(file) : undefined;
      let thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

      await editMediaContent(
        {
          ...mediaContent,
          ...result,
          topicId: topic?._id || mediaContent.topicId,
          unitId: topic?.unit_id || unit?._id || mediaContent.unitId,
          subjectId: topic?.subject_id || unit?.subject_id || subject?._id || mediaContent.subjectId,
          gradeId: topic?.grade_id || unit?.grade_id || subject?.grade_id || mediaContent.gradeId,
        },
        fileUrl || undefined,
        thumbnailUrl || undefined,
        onSuccessfullyDone,
      );
    } finally {
      setUploading(false);
    }
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

          <Autocomplete<T_SubjectWithoutMetadata>
            url={API_LINKS.FIND_SUBJECT_BY_NAME}
            handleSelect={setSubject}
            moduleName="subjects"
            disabled={uploading}
          />

          <Autocomplete<T_UnitWithoutMetadata>
            url={API_LINKS.FIND_UNITS_BY_NAME}
            handleSelect={setUnit}
            moduleName="units"
            disabled={uploading}
          />

          <Autocomplete<T_TopicWithoutMetadata>
            url={API_LINKS.FIND_TOPIC_BY_NAME}
            handleSelect={setTopic}
            moduleName="topics"
            defaultValue={mediaContent.topicName}
            disabled={uploading}
          />

          <UpdateButtons uploading={uploading} toggleDeletionWarning={toggleDeletionWarning} />
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
