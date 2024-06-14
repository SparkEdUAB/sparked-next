'use client';

import { Button, Modal } from 'flowbite-react';
import { useMemo, useState } from 'react';
import { IoMdEye } from 'react-icons/io';
import { determineFileType } from 'utils/helpers/determineFileType';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@components/layouts/library/PdfViewer/PdfViewer'), {
  ssr: false,
});

export default function PreviewButton({ file }: { file: File }) {
  let [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Button className="mb-4 p-0" color="gray" onClick={() => setShowPreview(true)}>
        <IoMdEye size={24} className="mr-2" /> Preview File
      </Button>
      <Modal show={showPreview} dismissible onClose={() => setShowPreview(false)} popup size="3xl">
        <Modal.Header />
        <Modal.Body className="custom-scrollbar">
          <h1 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">{file.name}</h1>
          {showPreview && <FilePreview file={file} />}
        </Modal.Body>
      </Modal>
    </>
  );
}

function FilePreview({ file }: { file: File }) {
  const fileType = determineFileType(file.name || '');
  const fileUrl = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div>
      {fileType === 'image' ? (
        <img
          src={fileUrl}
          alt="Media content file"
          className="max-h-[calc(100vh_-_200px)] inline-block my-2 object-contain object-center"
        />
      ) : fileType === 'video' ? (
        <video src={fileUrl} className="max-h-[calc(100vh_-_200px)] inline-block my-2" controls></video>
      ) : (
        fileType === 'pdf' && <PdfViewer file={fileUrl} className="max-h-[calc(100vh_-_200px)]" />
      )}
    </div>
  );
}
