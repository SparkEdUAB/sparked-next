/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { RedAsterisk } from '@components/atom';
import { FileInput, Label } from 'flowbite-react';
import i18next from 'i18next';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { determineFileType } from 'utils/helpers';

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
  const fileType = determineFileType(file?.name || '');

  return (
    <div className="w-full">
      <div id="fileUpload" className="w-full mb-4">
        <div className="mb-2 block">
          <Label htmlFor="file" value={i18next.t('upload_file')} /> {required ? <RedAsterisk /> : null}
        </div>
        <FileInput
          id="file"
          required={required}
          name="file"
          disabled={isLoading}
          multiple={false}
          onChange={(e) => setFile(getFileFromInput(e))}
          accept="image/*, application/pdf, video/*"
        />
      </div>

      {file ? (
        fileType === 'image' ? (
          <img src={URL.createObjectURL(file)} alt="Media content file" className="mb-4 h-48" />
        ) : fileType === 'video' ? (
          <video src={URL.createObjectURL(file)} className="mb-4 h-48" controls></video>
        ) : null
      ) : null}

      <div id="thumbnailUpload" className="w-full mb-2">
        <div className="mb-2 block">
          <Label htmlFor="thumbnail" value={i18next.t('upload_thumbnail')} />
        </div>
        <FileInput
          id="thumbnail"
          name="thumbnail"
          disabled={isLoading}
          multiple={false}
          onChange={(e) => setThumbnail(getFileFromInput(e))}
          accept="image/*"
        />
      </div>

      {thumbnail ? (
        <img src={URL.createObjectURL(thumbnail)} alt="Media content thumbnail" className="mb-4 h-48" />
      ) : null}
    </div>
  );
}

function getFileFromInput(e: ChangeEvent<HTMLInputElement>) {
  const files = (e.target as HTMLInputElement).files;

  if (files && files.length > 0) {
    return files[0];
  } else {
    return null;
  }
}
