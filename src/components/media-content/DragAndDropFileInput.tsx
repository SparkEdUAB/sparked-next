/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { RedAsterisk } from '@components/atom';
import { FileInput, Label } from 'flowbite-react';
import { useCallback, useMemo } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { VscCloudUpload } from 'react-icons/vsc';
import { AcceptableFileTypes, determineFileType } from 'utils/helpers/determineFileType';
import { convertListToText } from 'utils/helpers/convertListToText';
import { getFileFromInput, getMultipleFilesFromInput } from 'utils/helpers/getFileFromInput';
import { Accept, DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { truncateText } from 'utils/helpers/truncateText';
import { IoClose } from 'react-icons/io5';

type Props = {
  id: string;
  label?: string;
  required: boolean | undefined;
  isLoading: boolean;
  fileTypes: AcceptableFileTypes[];
  classNames?: { wrapper?: string; label?: string; main?: string };
} & (
  | { multiple: true; files: File[] | null; onChange: (files: File[] | null) => void }
  | { multiple?: false; files: File | null; onChange: (file: File | null) => void }
);

export function DragAndDropFileInput({
  id,
  files,
  label,
  onChange,
  required,
  isLoading,
  fileTypes,
  multiple,
  classNames,
}: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: Array<File>, fileRejections: FileRejection[], event: DropEvent) => {
        if (multiple) {
          onChange([...(files || []), ...acceptedFiles]);
        } else {
          onChange(acceptedFiles[0] || null);
        }
      },
      [files],
    ),
    multiple,
    accept: getDropzoneAcceptValue(fileTypes),
  });

  return (
    <>
      <div className={'w-full mb-4 ' + (classNames?.wrapper || '')}>
        {label && (
          <div className="mb-2 block">
            <Label className={'cursor-pointer ' + (classNames?.label || '')} htmlFor={id} value={label} />{' '}
            {required ? <RedAsterisk /> : null}
          </div>
        )}

        <Label
          htmlFor={id}
          className={
            'flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed relative bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 ' +
            (isDragActive
              ? 'border-cyan-300 dark:border-cyan-600 dark:hover:border-cyan-500 '
              : 'border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 ') +
            (classNames?.main || '')
          }
          {...getRootProps()}
        >
          <div
            className={
              'flex flex-col-reverse w-full items-center justify-evenly ' +
              (multiple && (files?.length || 0) > 1 ? '' : 'sm:flex-row')
            }
          >
            {files instanceof Array && files.length > 0 ? (
              <div>
                {files.map((file) => (
                  <FilePreview file={file} deleteItem={() => multiple && onChange(files.filter((f) => f != file))} />
                ))}
              </div>
            ) : (
              files instanceof File && <FilePreview file={files} />
            )}

            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 text-center justify-center pb-4 pt-4">
              <VscCloudUpload size={42} className="mb-1" />
              <p className="mb-1 text-sm font-semibold">Click to upload file or drag and drop</p>
              <p className="text-xs">{convertListToText(fileTypes)}</p>
            </div>
          </div>

          <FileInput
            {...getInputProps({
              id: id,
              onChange: (e) => {
                if (multiple) {
                  onChange([...(files || []), ...getMultipleFilesFromInput(e)]);
                } else {
                  onChange(getFileFromInput(e));
                }
              },
              multiple,
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

function FilePreview({ file, deleteItem }: { file: File | null; deleteItem?: () => void }) {
  const fileType = determineFileType(file?.name || '');
  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  return file ? (
    <div className="inline-block relative w-fit h-fit" onClick={(e) => e.stopPropagation()}>
      {fileType === 'image' ? (
        <img
          src={fileUrl}
          alt="Media content file"
          className="inline-block m-4 h-full max-h-48 max-w-48 object-contain object-center"
        />
      ) : fileType === 'video' ? (
        <video src={fileUrl} className="inline-block m-4 h-48 max-h-48 max-w-48" controls></video>
      ) : (
        fileType === 'pdf' && (
          <div className="m-4 inline-flex flex-col items-center text-center">
            <FaFilePdf className="mb-2" color="#bb4338" size={40} />
            <p className="max-w-32">{truncateText(file.name, 40)}</p>
          </div>
        )
      )}
      {deleteItem && (
        <button className="p-1 absolute top-0 right-0 z-20 bg-red-500 text-white rounded-full" onClick={deleteItem}>
          <IoClose size={20} />
        </button>
      )}
    </div>
  ) : null;
}

/**
 * Creates an object for specifying the file types that
 * should be accepted by a dropzone file input field
 *
 * @param fileTypes The acceptable file types
 */
function getDropzoneAcceptValue(fileTypes: AcceptableFileTypes[]): Accept {
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
