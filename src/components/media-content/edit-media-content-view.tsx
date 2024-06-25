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
import { T_TopicFields } from '@hooks/use-topic/types';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_UnitFields } from '@hooks/useUnit/types';
import { T_NameAndDescription } from 'types';

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
  const [unitId, setUnitId] = useState<string | null>(null);

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
        { ...mediaContent, ...result, topicId: topicId || mediaContent.topicId, unitId: unitId || mediaContent.unitId },
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

  const handleSelectUnit = (unit: T_UnitFields) => {
    setUnitId(unit?._id);
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

          <Autocomplete
            url={API_LINKS.FIND_UNITS_BY_NAME}
            handleSelect={handleSelectUnit}
            moduleName="units"
            defaultValue={mediaContent.unitName}
          />
          <Autocomplete
            url={API_LINKS.FIND_TOPIC_BY_NAME}
            handleSelect={handleClick}
            moduleName="topics"
            defaultValue={mediaContent.topicName}
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
