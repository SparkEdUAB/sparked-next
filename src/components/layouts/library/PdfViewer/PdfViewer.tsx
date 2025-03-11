"use client"

import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { Button } from 'flowbite-react';
import { useCallback, useState, useRef, useMemo, memo } from "react";
import { FaArrowLeft, FaArrowRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  disableAutoFetch: false,
  disableStream: false,
  disableRange: false,
};

const resizeObserverOptions = {};

const maxWidth = 800;

const PdfSkeleton = memo(() => {
  return (
    <div className="animate-pulse">
      <div className="w-full max-w-[800px] h-[1000px] bg-gray-200 rounded-lg mx-auto" />
    </div>
  );
});
PdfSkeleton.displayName = 'PdfSkeleton';

const MemoizedPage = memo(({ pageNumber, scale, width, className }: {
  pageNumber: number,
  scale?: number,
  width?: number,
  className?: string
}) => {
  return (
    <Page
      pageNumber={pageNumber}
      scale={scale}
      width={width}
      className={className}
      renderTextLayer={false}
      renderAnnotationLayer={false}
      loading={null}
      error={null}
    />
  );
});
MemoizedPage.displayName = 'MemoizedPage';

export default function PdfReactPdf({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [preloadedPages, setPreloadedPages] = useState<Set<number>>(new Set());
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [scale, setScale] = useState<number>(1.0);

  const documentRef = useRef<any>(null);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    // Preload next page
    preloadPage(currentPage + 1);
  }

  const preloadPage = useCallback((pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= (numPages || 0) && !preloadedPages.has(pageNumber)) {
      setPreloadedPages((prev) => new Set(prev).add(pageNumber));
    }
  }, [numPages, preloadedPages]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      preloadPage(newPage - 1);
      return newPage;
    });
  }, [preloadPage]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => {
      const newPage = Math.min(prevPage + 1, numPages || 1);
      preloadPage(newPage + 1);
      return newPage;
    });
  }, [numPages, preloadPage]);

  const handleZoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  }, []);

  const pageWidth = useMemo(() =>
    containerWidth ? containerWidth : maxWidth,
    [containerWidth]
  );

  return (
    <div className="Example" style={{ textAlign: 'center' }}>
      <div className="pdfviewer__container">
        <div className="pdfviewer__container__document" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<PdfSkeleton />}
            options={options}
            ref={documentRef}
            externalLinkTarget="_blank"
          >
            <MemoizedPage
              pageNumber={currentPage}
              scale={scale}
              width={pageWidth}
            />
            {preloadedPages.has(currentPage + 1) && (
              <MemoizedPage
                pageNumber={currentPage + 1}
                className="mx-auto hidden"
                width={pageWidth}
              />
            )}
          </Document>
        </div>
        <div className="pdfviewer__buttons">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="mr-2">
            <FaArrowLeft />
          </Button>
          <span className="px-2 py-1 rounded text-teal-500">{currentPage} of {numPages}</span>
          <Button onClick={handleNextPage} disabled={currentPage === numPages || !numPages} className="ml-2">
            <FaArrowRight />
          </Button>
          <Button onClick={handleZoomIn} className="ml-2">
            <FaSearchPlus />
          </Button>
          <Button onClick={handleZoomOut} className="ml-2">
            <FaSearchMinus />
          </Button>
        </div>
      </div>
    </div>
  );
}