"use client"

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { FaBook, FaBookmark } from 'react-icons/fa';
import { PiStepsFill } from 'react-icons/pi';
import { MdTopic } from 'react-icons/md';
import { ImBooks } from 'react-icons/im';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers/determineFileType';
import { LibraryErrorMessage } from './LibraryErrorMessage/LibraryErrorMessage';
import Image from 'next/image';
import { RelatedMediaContentList } from './RelatedMediaContentList';
import dynamic from 'next/dynamic';
import { getFileUrl } from 'utils/helpers/getFileUrl';
import { FaDownload } from 'react-icons/fa'; // Import the download icon
import { Button, Spinner } from 'flowbite-react'; // Import the Button component
import { API_LINKS } from 'app/links';

/**
 * Extracts text content from a PDF file at the given URL.
 * @param {string} fileUrl - The URL of the PDF file.
 * @returns {Promise<string>} - The extracted text content.
 */
// Remove pdf-parse import as it's not browser-compatible
import * as pdfjs from 'pdfjs-dist';

// Set worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function extractTextFromFile(fileUrl: string): Promise<string> {
  try {
    const pdf = await pdfjs.getDocument(fileUrl).promise;
    const numPages = pdf.numPages;

    // Process pages in parallel
    const pagePromises = Array.from({ length: numPages }, (_, i) =>
      pdf.getPage(i + 1)
        .then(page => page.getTextContent())
        .then(content => {
          // Pre-allocate array size for better performance
          const textParts = new Array(content.items.length);

          // Direct array manipulation instead of map
          for (let i = 0; i < content.items.length; i++) {
            // @ts-ignore
            textParts[i] = content.items[i].str;
          }

          // Single pass text cleaning
          return textParts.join(' ')
            .replace(/\s+|[\x00-\x1F\x7F-\x9F]|(?<=\s)[^a-zA-Z0-9\s]+(?=\s)|(.)\1{2,}/g,
              (match, p1) => {
                if (p1) return p1 + p1; // Repetitive characters
                if (match.trim() === '') return ' '; // Whitespace
                return ''; // Other matches to remove
              })
            .trim();
        })
    );

    // Wait for all pages to be processed
    const pages = await Promise.all(pagePromises);

    // Join all pages with newlines and remove empty lines in one pass
    return pages.filter(Boolean).join('\n');
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from the PDF file.');
  }
}

const PdfViewer = dynamic(() => import('@components/layouts/library/PdfViewer/PdfViewer'), {
  ssr: false,
});

const VideoViewer = dynamic(() => import('next-video/player'), {
  ssr: false,
});


export function MediaContentView({
  mediaContent,
  relatedMediaContent,
}: {
  mediaContent: T_RawMediaContentFields;
  relatedMediaContent: T_RawMediaContentFields[] | null;
}) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const textContent = await extractTextFromFile(mediaContent.file_url as string);
      // console.log(textContent)
      const response = await fetch("/api/ai/summary", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: mediaContent.description,
          fileContent: textContent,
          contentId: mediaContent._id,
          model: 'gemini-1.5',
        }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const fileType = determineFileType(mediaContent?.file_url || '');
  const fileUrl = mediaContent.file_url ? getFileUrl(mediaContent.file_url) : '';

  return (
    <div className="xl:grid xl:grid-cols-[calc(100%_-_300px)_300px] 2xl:grid-cols-[calc(100%_-_400px)_400px] px-4 md:px-8 w-full ">
      <section>
        <div>
          {!fileUrl ? (
            <LibraryErrorMessage className="h-fit min-h-0">
              The <code>file_url</code> property is <code>null</code>
            </LibraryErrorMessage>
          ) : fileType === 'image' ? (
            <Image
              src={fileUrl}
              alt={mediaContent.name}
              className="max-h-[500px] max-w-full object-contain object-left"
              width={800}
              height={600}
            />
          ) : fileType === 'video' ? (
            <VideoViewer src={fileUrl} />
          ) : fileType === 'pdf' ? (
            <div>
              <PdfViewer file={fileUrl} />
            </div>
          ) : (
            <LibraryErrorMessage>Could not recognize the file type</LibraryErrorMessage>
          )}
        </div>
        <div>
          <h1 className="my-2 font-bold text-3xl">{mediaContent.name}</h1>
          <p className="text-lg whitespace-pre-wrap">{mediaContent.description}</p>

          {/* Add Summarize Button and Summary Display */}
          <div className="mt-4">
            <Button
              onClick={handleSummarize}
              disabled={isSummarizing}
              color="light"
              className="mb-4"
            >
              {isSummarizing ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Summarizing...
                </>
              ) : (
                'Summarize Content'
              )}
            </Button>

            {summary && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">AI Summary</h3>
                <p className="text-gray-600 dark:text-gray-300">{summary}</p>
              </div>
            )}
          </div>

          <div className="my-2 flex flex-row flex-wrap text-gray-500 gap-x-8 gap-y-2">
            {mediaContent.grade ? (
              <Link href={`/library?grade_id=${mediaContent.grade._id}`}>
                <IconWithLabel
                  title="Grade"
                  icon={<PiStepsFill className="text-2xl" />}
                  label={mediaContent.grade.name}
                />
              </Link>
            ) : null}
            {mediaContent.subject ? (
              <Link href={`/library?subject_id=${mediaContent.subject._id}`}>
                <IconWithLabel
                  title="Subject"
                  icon={<MdTopic className="text-2xl" />}
                  label={mediaContent.subject.name}
                />
              </Link>
            ) : null}
            {mediaContent.course ? (
              <Link href={`/library?course_id=${mediaContent.course._id}`}>
                <IconWithLabel
                  title="Course"
                  icon={<ImBooks className="text-2xl" />}
                  label={mediaContent.course.name}
                />
              </Link>
            ) : null}
            {mediaContent.unit ? (
              <Link href={`/library?unit_id=${mediaContent.unit._id}`}>
                <IconWithLabel title="Unit" icon={<FaBook />} label={mediaContent.unit.name} />
              </Link>
            ) : null}
            {mediaContent.topic ? (
              <Link href={`/library?topic_id=${mediaContent.topic._id}`}>
                <IconWithLabel title="Topic" icon={<FaBookmark />} label={mediaContent.topic.name} />
              </Link>
            ) : null}
          </div>
          <Button
            href={fileUrl}
            // @ts-expect-error
            download
            className="inline-block mt-4 px-4 text-white rounded "
          >
            <FaDownload className="inline-block mr-2" />
            Download
          </Button>
        </div>
      </section>
      <RelatedMediaContentList relatedMediaContent={relatedMediaContent} />
    </div>
  );
}

function IconWithLabel({ icon, label, title }: { label?: string; icon: ReactNode; title: string }) {
  return label ? (
    <div className="flex flex-row items-center gap-2" title={title}>
      {icon}
      {label}
    </div>
  ) : null;
}
