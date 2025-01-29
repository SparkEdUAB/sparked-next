"use client"

import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { Button } from 'flowbite-react';
import { useCallback, useState } from "react";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import icons
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

export default function PdfReactPdf({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [preloadedPages, setPreloadedPages] = useState<Set<number>>(new Set());

  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);



  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    preloadPage(currentPage + 1); // Preload the next page initially
  }

  const preloadPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= (numPages || 0) && !preloadedPages.has(pageNumber)) {
      setPreloadedPages((prev) => new Set(prev).add(pageNumber));
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      preloadPage(newPage - 1); // Preload the previous page
      return newPage;
    });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = Math.min(prevPage + 1, numPages || 1);
      preloadPage(newPage + 1); // Preload the next page
      return newPage;
    });
  };



  return (
    <div className="Example" style={{ textAlign: 'center' }}>
      <div className="flex justify-center items-center mb-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="mr-2">
          <FaArrowLeft />
        </Button>
        <span>{currentPage} of {numPages}</span>
        <Button onClick={handleNextPage} disabled={currentPage === numPages} className="ml-2">
          <FaArrowRight />
        </Button>
      </div>
      <div className="pdfviewer__container">
        <div className="pdfviewer__container__document" ref={setContainerRef}>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
            <Page
              pageNumber={currentPage}
              width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
              className="mx-auto" // Center the page
            />
            {preloadedPages.has(currentPage + 1) && (
              <Page
                pageNumber={currentPage + 1}
                className="mx-auto hidden" // Preload the next page
              />
            )}
          </Document>
        </div>
      </div>
    </div>
  );
}