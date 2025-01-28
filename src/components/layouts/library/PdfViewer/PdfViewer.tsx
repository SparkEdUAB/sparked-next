"use client"

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

function CustomSkeleton({ height }: { height: number }) {
  return (
    <div
      style={{
        height: `${height}px`,
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '1rem',
      }}
      className="animate-pulse"
    />
  );
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfReactPdf({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageWidth, setPageWidth] = useState<number>(window.innerWidth * 0.6);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.6;
      setPageWidth(newWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div style={{ width: "100%", height: "90vh", overflowY: "auto", padding: "1rem" }}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="my-react-pdf"
        loading={<CustomSkeleton height={700} />}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth} // Use responsive width
            className="mb-4"
            renderMode="canvas"
            loading={<CustomSkeleton height={700} />}
          />
        ))}
      </Document>
    </div>
  );
}