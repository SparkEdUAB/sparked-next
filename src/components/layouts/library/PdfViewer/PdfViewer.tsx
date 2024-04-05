import { Button, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { pdfjs, Document, Page } from 'react-pdf';

import styles from './PdfViewer.module.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfViewer({ file, className }: { file: string | File; className?: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<Error | null>(null);

  const changePage = (offset: number) => setPageNumber((prevPageNumber) => prevPageNumber + offset);
  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="flex flex-col items-center justify-center">
      {numPages !== undefined ? (
        <div className="flex flex-row gap-4 items-center mb-2">
          <button
            className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            disabled={pageNumber <= 1}
            onClick={previousPage}
            title="Previous"
          >
            <GrPrevious />
          </button>
          Page {pageNumber} of {numPages}
          <button
            className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
            title="Next"
          >
            <GrNext />
          </button>
        </div>
      ) : null}
      <Document
        file={file}
        onLoadError={setError}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="w-full p-10 flex items-center justify-center">
            <Spinner />
          </div>
        }
        error={
          <div className="w-full flex flex-col items-center justify-center text-red-500 p-10">
            <IoIosCloseCircleOutline className="text-6xl mb-3" />
            <p className="text-lg">
              An error occured while attempting to load the PDF{error ? <>: {error.message}</> : null}
            </p>
          </div>
        }
        noData={
          <div className="w-full flex flex-col items-center justify-center text-red-500 p-10">
            <IoIosCloseCircleOutline className="text-6xl mb-3" />
            <p className="text-lg">No PDF file specified</p>
          </div>
        }
      >
        <Page pageNumber={pageNumber} className={`${styles.page} shadow-2xl`} height={600} />
      </Document>
    </div>
  );
}
