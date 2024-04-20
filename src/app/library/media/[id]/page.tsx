'use client';

import PdfViewer from '@components/layouts/library/PdfViewer/PdfViewer';
import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import LibraryLoader from '@components/library/LibraryLoader';
import useMediaContent from '@hooks/use-media-content';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import { FaBook, FaBookmark, FaSchool } from 'react-icons/fa';
import { ImBooks } from 'react-icons/im';
import { IoIosCloseCircleOutline, IoMdDownload, IoMdSchool } from 'react-icons/io';
import { determineFileType } from 'utils/helpers';

export default function MediaContentPage({ params }: { params: { id: string } }) {
  let { fetchMediaContentById, isLoading, targetMediaContent } = useMediaContent();

  useEffect(() => {
    fetchMediaContentById({ mediaContentId: params.id, withMetaData: true });
  }, []);

  const fileType = determineFileType(targetMediaContent?.fileUrl || '');

  return (
    <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)] py-6 px-4">
      {targetMediaContent === null ? (
        isLoading ? (
          <LibraryLoader />
        ) : (
          <EmptyContentIndicator>Nothing to show</EmptyContentIndicator>
        )
      ) : (
        <div>
          <div>
            {!targetMediaContent.fileUrl ? (
              <div className="w-full flex flex-col items-center justify-center text-red-500 p-10">
                <IoIosCloseCircleOutline className="text-6xl mb-3" />
                <p className="text-lg">
                  The <code>fileUrl</code> property is <code>null</code>
                </p>
              </div>
            ) : fileType === 'image' ? (
              <img
                src={targetMediaContent.fileUrl}
                alt={targetMediaContent.name}
                className="max-h-[500px] max-w-full"
              />
            ) : fileType === 'video' ? (
              <video src={targetMediaContent.fileUrl} className="max-h-[500px] max-w-full" controls></video>
            ) : fileType === 'pdf' ? (
              <PdfViewer file={targetMediaContent.fileUrl} />
            ) : null}
          </div>
          {/* <a
            className="mt-6 group inline-flex items-center justify-center px-4 py-2 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:enabled:hover:bg-cyan-700 dark:focus:ring-cyan-800 rounded-lg focus:ring-2"
            href={targetMediaContent.fileUrl}
            download
            target="_blank"
          >
            <IoMdDownload className="mr-2 text-xl" /> Download
          </a> */}
          <div>
            <h1 className="my-6 font-bold text-3xl">{targetMediaContent.name}</h1>
            <p className="text-lg whitespace-pre-wrap">{targetMediaContent.description}</p>
            <div className="my-6 flex flex-row flex-wrap text-gray-500 gap-x-8 gap-y-2">
              {/* <IconWithLabel icon={<FaSchool className="text-2xl" />} label={targetMediaContent.schoolName} />
              <IconWithLabel icon={<IoMdSchool className="text-2xl" />} label={targetMediaContent.programName} /> */}
              <Link href={`/library?course_id=${targetMediaContent.courseId}`}>
                <IconWithLabel
                  title="Course"
                  icon={<ImBooks className="text-2xl" />}
                  label={targetMediaContent.courseName}
                />
              </Link>
              <Link href={`/library?unit_id=${targetMediaContent.unitId}`}>
                <IconWithLabel title="Unit" icon={<FaBook />} label={targetMediaContent.unitName} />
              </Link>
              <Link href={`/library?topic_id=${targetMediaContent.topicId}`}>
                <IconWithLabel title="Topic" icon={<FaBookmark />} label={targetMediaContent.topicName} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
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
