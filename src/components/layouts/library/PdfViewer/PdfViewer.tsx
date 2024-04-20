'use client';

import ReactPDF from '@intelllex/react-pdf';

export default function PdfViewer({ file, className }: { file: string; className?: string }) {
  return (
    <div className="relative bg-white w-full h-[800px] max-h-[calc(100vh_-_100px)] overflow-hidden">
      <ReactPDF url={file} showProgressBar showToolbox />
    </div>
  );
}
