'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent from '@hooks/use-media-content';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';

import { FormEventHandler, useEffect, useState } from 'react';
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
import { T_NameAndDescription } from 'types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_GradeWithoutMetadata } from '@hooks/useGrade/types';
import SelectList from '@components/atom/SelectList/SelectList';

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
  const [grade, setGrade] = useState<T_GradeWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);
  const [unit, setUnit] = useState<T_UnitWithoutMetadata | null>(null);
  const [topic, setTopic] = useState<T_TopicWithoutMetadata | null>(null);

  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  useEffect(() => {
    if (mediaContent && mediaContent.gradeId) {
      setGrade({ _id: mediaContent.gradeId, name: mediaContent.gradeName || '' } as T_GradeWithoutMetadata);
    }
  }, [mediaContent]);

  useEffect(() => {
    if (grade && mediaContent && grade._id === mediaContent.gradeId && mediaContent.subjectId) {
      setSubject({
        _id: mediaContent.subjectId,
        name: mediaContent.subjectName || '',
        grade_id: mediaContent.gradeId,
      } as T_SubjectWithoutMetadata);
    } else {
      setSubject(null);
      setUnit(null);
      setTopic(null);
    }
  }, [grade, mediaContent]);

  useEffect(() => {
    if (subject && mediaContent && subject._id === mediaContent.subjectId && mediaContent.unitId) {
      setUnit({
        _id: mediaContent.unitId,
        name: mediaContent.unitName || '',
        subject_id: mediaContent.subjectId,
        grade_id: mediaContent.gradeId,
      } as T_UnitWithoutMetadata);
    } else {
      setUnit(null);
      // When unit is null but subject exists, try to set topic if mediaContent has topicId
      if (subject && mediaContent && mediaContent.topicId) {
        setTopic({
          _id: mediaContent.topicId,
          name: mediaContent.topicName || '',
          unit_id: null,
          subject_id: mediaContent.subjectId,
          grade_id: mediaContent.gradeId,
        } as unknown as T_TopicWithoutMetadata);
      } else {
        setTopic(null);
      }
    }
  }, [subject, mediaContent]);

  useEffect(() => {
    if (unit && mediaContent && unit._id === mediaContent.unitId && mediaContent.topicId) {
      setTopic({
        _id: mediaContent.topicId,
        name: mediaContent.topicName || '',
        unit_id: mediaContent.unitId,
        subject_id: mediaContent.subjectId,
        grade_id: mediaContent.gradeId,
      } as T_TopicWithoutMetadata);
    } else {
      setTopic(null);
    }
  }, [unit, mediaContent]);

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
          // @ts-expect-error
          unitId: topic?.unit_id || unit?._id || mediaContent.unitId || null, // Make unitId explicitly null if not selected
          subjectId: topic?.subject_id || unit?.subject_id || subject?._id || mediaContent.subjectId,
          gradeId: topic?.grade_id || unit?.grade_id || subject?.grade_id || grade?._id || mediaContent.gradeId,
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

          <SelectList<T_GradeWithoutMetadata>
            url={API_LINKS.FETCH_GRADES}
            handleSelect={setGrade}
            moduleName="grades"
            label="Grade"
            disabled={uploading}
            selectedItem={grade}
            placeholder="Select a grade"
            required
          />

          <SelectList<T_SubjectWithoutMetadata>
            url={API_LINKS.FETCH_SUBJECTS_BY_GRADE_ID}
            handleSelect={setSubject}
            moduleName="subjects"
            label="Subject"
            disabled={uploading || !grade}
            selectedItem={subject}
            placeholder={grade ? 'Select a subject' : 'Select a grade first'}
            queryParams={{ gradeId: grade?._id || '' }}
            required
          />

          <SelectList<T_UnitWithoutMetadata>
            url={API_LINKS.FETCH_UNITS_BY_SUBJECT_ID}
            handleSelect={setUnit}
            moduleName="units"
            label="Unit (Optional)"
            disabled={uploading || !subject}
            selectedItem={unit}
            placeholder={subject ? 'Select a unit (optional)' : 'Select a subject first'}
            queryParams={{ subjectId: subject?._id || '' }}
          />

          <SelectList<T_TopicWithoutMetadata>
            url={unit ? API_LINKS.FETCH_TOPICS_BY_UNIT_ID : API_LINKS.FETCH_TOPICS_BY_SUBJECT_ID}
            handleSelect={setTopic}
            moduleName="topics"
            label="Topic"
            disabled={uploading || !subject}
            selectedItem={topic}
            placeholder={subject ? 'Select a topic' : 'Select a subject first'}
            queryParams={unit ? { unitId: unit?._id || '' } : { subjectId: subject?._id || '' }}
            required
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
