/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { RedAsterisk } from '@components/atom';
import { FileInput, Label } from 'flowbite-react';
import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { VscCloudUpload } from 'react-icons/vsc';
import { AcceptableFileType, determineFileType } from 'utils/helpers/determineFileType';
import { convertListToText } from 'utils/helpers/convertListToText';
import { getFileFromInput } from 'utils/helpers/getFileFromInput';
import { Accept, DropEvent, FileRejection, useDropzone } from 'react-dropzone';

export function DragAndDropFileInput({
  id,
  file,
  label,
  onChange,
  required,
  isLoading,
  fileTypes,
}: {
  id: string;
  file: File | null;
  label: string;
  onChange: Dispatch<SetStateAction<File | null>>;
  required: boolean | undefined;
  isLoading: boolean;
  fileTypes: AcceptableFileType[];
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: Array<File>, fileRejections: FileRejection[], event: DropEvent) => {
      onChange(acceptedFiles[0] || null);
    }, []),
    accept: getDropzoneAcceptValue(fileTypes),
  });

  return (
    <>
      <div className="w-full mb-4">
        <div className="mb-2 block">
          <Label className="cursor-pointer" htmlFor={id} value={label} /> {required ? <RedAsterisk /> : null}
        </div>

        <Label
          htmlFor={id}
          className={
            'flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed relative bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 ' +
            (isDragActive
              ? 'border-cyan-300 dark:border-cyan-600 dark:hover:border-cyan-500'
              : 'border-gray-300 dark:border-gray-600 dark:hover:border-gray-500')
          }
          {...getRootProps()}
        >
          <div className="flex flex-col-reverse sm:flex-row w-full items-center justify-evenly">
            <FilePreview file={file} />

            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 text-center justify-center pb-4 pt-4">
              <VscCloudUpload size={42} className="mb-1" />
              <p className="mb-1 text-sm font-semibold">Click to upload file or drag and drop</p>
              <p className="text-xs">{convertListToText(fileTypes)}</p>
            </div>
          </div>

          <FileInput
            {...getInputProps({
              id: id,
              onChange: (e) => onChange(getFileFromInput(e)),
              multiple: false,
              disabled: isLoading,
              name: id,
              required,
            })}
            className="opacity-0"
          />
        </Label>
      </div>
    </>
  );
}

function FilePreview({ file }: { file: File | null }) {
  const fileType = determineFileType(file?.name || '');

  return file ? (
    fileType === 'image' ? (
      <img
        src={URL.createObjectURL(file)}
        alt="Media content file"
        className="m-4 h-48 max-h-48 max-w-48 object-contain object-center"
      />
    ) : fileType === 'video' ? (
      <video src={URL.createObjectURL(file)} className="m-4 h-48 max-h-48 max-w-48" controls></video>
    ) : fileType === 'pdf' ? (
      <div className="m-4 flex flex-col items-center text-center">
        <FaFilePdf className="mb-2" color="#bb4338" size={40} />
        <p className="overflow-ellipsis max-w-32 overflow-hidden whitespace-nowrap">{file.name}</p>
      </div>
    ) : null
  ) : null;
}

/**
 * Creates an object for specifying the file types that
 * should be accepted by a dropzone file input field
 *
 * @param fileTypes The acceptable file types
 */
function getDropzoneAcceptValue(fileTypes: AcceptableFileType[]): Accept {
  let accept: Accept = {};

  if (fileTypes.includes('image')) {
    accept['image/*'] = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  }
  if (fileTypes.includes('video')) {
    accept['video/*'] = ['.mp4', '.webm', '.ogg'];
  }
  if (fileTypes.includes('pdf')) {
    accept['application/pdf'] = ['.pdf'];
  }

  return accept;
}
