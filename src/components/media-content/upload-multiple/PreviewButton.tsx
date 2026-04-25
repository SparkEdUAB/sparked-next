'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <Button className="mb-4 p-0" variant="outline" onClick={() => setShowPreview(true)}>
        <IoMdEye size={24} className="mr-2" /> Preview File
      </Button>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl custom-scrollbar">
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          <FilePreview file={file} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilePreview({ file }: { file: File }) {
  const fileType = determineFileType(file.name || '');
  const fileUrl = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div>
      {fileType === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fileUrl}
          alt="Media content file"
          className="max-h-[calc(100vh_-_200px)] inline-block my-2 object-contain object-center"
        />
      ) : fileType === 'video' ? (
        <video src={fileUrl} className="max-h-[calc(100vh_-_200px)] inline-block my-2" controls></video>
      ) : (
        fileType === 'pdf' && <PdfViewer file={fileUrl} />
      )}
    </div>
  );
}
