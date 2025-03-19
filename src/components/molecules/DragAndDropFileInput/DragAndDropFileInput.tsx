'use client';

import { RedAsterisk } from '@components/atom';
import { FileInput, Label } from 'flowbite-react';
import { useCallback } from 'react';
import { VscCloudUpload } from 'react-icons/vsc';
import { AcceptableFileTypes } from 'utils/helpers/determineFileType';
import { convertListToText } from 'utils/helpers/convertListToText';
import { getFileFromInput, getMultipleFilesFromInput } from 'utils/helpers/getFileFromInput';
import { useDropzone } from 'react-dropzone';
import { FilePreview } from './FilePreview';
import { getDropzoneAcceptValue } from './getDropzoneAcceptValue';

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
      (acceptedFiles: Array<File>) => {
        if (multiple) {
          onChange([...(files || []), ...acceptedFiles]);
        } else {
          onChange(acceptedFiles[0] || null);
        }
      },
      [files, multiple, onChange],
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
                  <FilePreview
                    key={file.name}
                    file={file}
                    deleteItem={() => multiple && onChange(files.filter((f) => f !== file))}
                  />
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
