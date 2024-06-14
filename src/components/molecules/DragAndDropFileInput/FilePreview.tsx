/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useMemo } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { determineFileType } from 'utils/helpers/determineFileType';
import { truncateText } from 'utils/helpers/truncateText';
import { IoClose } from 'react-icons/io5';

export function FilePreview({ file, deleteItem }: { file: File | null; deleteItem?: () => void }) {
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
