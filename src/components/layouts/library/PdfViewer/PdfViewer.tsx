'use client';

import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { Button } from 'flowbite-react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './viewer.css';

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

const MemoizedPage = memo(
  ({
    pageNumber,
    scale,
    width,
    className,
  }: {
    pageNumber: number;
    scale?: number;
    width?: number;
    className?: string;
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
  },
);
MemoizedPage.displayName = 'MemoizedPage';

export default function PdfReactPdf({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [preloadedPages, setPreloadedPages] = useState<Set<number>>(new Set());
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pageInput, setPageInput] = useState<string>('');

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

  const preloadPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber > 0 && pageNumber <= (numPages || 0) && !preloadedPages.has(pageNumber)) {
        setPreloadedPages((prev) => new Set(prev).add(pageNumber));
      }
    },
    [numPages, preloadedPages],
  );

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      preloadPage(newPage - 1);
      return newPage;
    });
    containerRef?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [preloadPage, containerRef]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => {
      const newPage = Math.min(prevPage + 1, numPages || 1);
      preloadPage(newPage + 1);
      return newPage;
    });
    containerRef?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [numPages, preloadPage, containerRef]);

  const handlePageJump = useCallback(() => {
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= (numPages || 0)) {
      setCurrentPage(pageNum);
      // Preload adjacent pages
      preloadPage(pageNum - 1);
      preloadPage(pageNum + 1);
      containerRef?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPageInput('');
  }, [pageInput, numPages, preloadPage, containerRef]);

  const pageWidth = useMemo(() => (containerWidth ? containerWidth : maxWidth), [containerWidth]);

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
            <MemoizedPage pageNumber={currentPage} width={pageWidth} />
            {preloadedPages.has(currentPage + 1) && (
              <MemoizedPage pageNumber={currentPage + 1} className="mx-auto hidden" width={pageWidth} />
            )}
          </Document>
        </div>
        <div className="pdfviewer__buttons flex items-center justify-center flex-wrap gap-1 p-1 bg-white shadow-sm rounded-md mt-2">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="!p-1 !h-7 min-w-[32px] !bg-gray-50 hover:!bg-gray-100 !border-gray-200 !text-gray-700"
            size="xs"
          >
            <FaArrowLeft className="text-xs" />
          </Button>
          <div className="flex items-center px-1">
            <span className="text-gray-700 text-xs font-medium">
              {currentPage} / {numPages || '?'}
            </span>
          </div>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === numPages || !numPages}
            className="!p-1 !h-7 min-w-[32px] !bg-gray-50 hover:!bg-gray-100 !border-gray-200 !text-gray-700"
            size="xs"
          >
            <FaArrowRight className="text-xs" />
          </Button>
          <div className="flex items-center ml-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              max={numPages}
              value={pageInput}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setPageInput(value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePageJump()}
              className="w-16 h-7 px-0.5 text-xs text-center border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              aria-label="Go to page"
              placeholder={`Page #`}
            />
            <Button
              onClick={handlePageJump}
              className="!h-7 rounded-l-none rounded-r-md !py-0 !px-1 !text-xs !bg-gray-50 hover:!bg-gray-100 !border-gray-200 !text-gray-700"
              size="xs"
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
