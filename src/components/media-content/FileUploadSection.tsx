/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import i18next from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { DragAndDropFileInput } from '../molecules/DragAndDropFileInput/DragAndDropFileInput';

export function FileUploadSection({
  isLoading,
  file,
  setFile,
  setThumbnail,
  thumbnail,
  required,
}: {
  isLoading: boolean;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  thumbnail: File | null;
  setThumbnail: Dispatch<SetStateAction<File | null>>;
  required?: boolean;
}) {
  return (
    <div className="w-full">
      <DragAndDropFileInput
        id="file"
        files={file}
        label={i18next.t('upload_file')}
        onChange={setFile}
        required={required}
        isLoading={isLoading}
        fileTypes={['pdf', 'video', 'image']}
      />

      <DragAndDropFileInput
        id="thumbnail"
        files={thumbnail}
        label={i18next.t('upload_thumbnail')}
        required={false}
        isLoading={isLoading}
        onChange={setThumbnail}
        fileTypes={['image']}
      />
    </div>
  );
}
