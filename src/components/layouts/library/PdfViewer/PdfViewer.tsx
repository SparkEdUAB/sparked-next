"use client"

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfReactPdf({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div style={{ width: "100%", height: "90vh", overflowY: "auto", padding: "1rem" }}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="my-react-pdf"
        loading={<div>Loading document...</div>} // Add loading indicator for document
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={window.innerWidth * 0.6} // Adjust width for better zoom level
            className="mb-4"
            renderMode="canvas"
            loading={<div>Loading page...</div>}
          />
        ))}
      </Document>
    </div>
  );
}