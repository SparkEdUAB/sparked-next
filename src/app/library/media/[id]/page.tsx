'use client';

import EmptyContentIndicator from '@components/library/EmptyContentIndicator';
import LibraryLoader from '@components/library/LibraryLoader';
import useMediaContent from '@hooks/use-media-content';
import { Button } from 'flowbite-react';
import { ReactNode, useEffect } from 'react';
import { FaBook, FaBookmark, FaSchool } from 'react-icons/fa';
import { ImBooks } from 'react-icons/im';
import { IoMdDownload, IoMdSchool } from 'react-icons/io';

export default function MediaContentPage({ params }: { params: { id: string } }) {
  let { fetchMediaContentById, isLoading, targetMediaContent } = useMediaContent();

  useEffect(() => {
    fetchMediaContentById({ mediaContentId: params.id, withMetaData: true });
  }, []);

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
            <img className="max-h-[500px] max-w-full" src={targetMediaContent.fileUrl} alt={targetMediaContent.name} />
          </div>
          <a
            className="mt-6 group inline-flex items-center justify-center px-4 py-2 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:enabled:hover:bg-cyan-700 dark:focus:ring-cyan-800 rounded-lg focus:ring-2"
            href={targetMediaContent.fileUrl}
            download
            target="_blank"
          >
            <IoMdDownload className="mr-2 text-xl" /> Download
          </a>
          <div>
            <h1 className="my-6 font-bold text-3xl">{targetMediaContent.name}</h1>
            <p className="text-lg">{targetMediaContent.description}</p>
            <div className="my-6 flex flex-row flex-wrap text-gray-500 gap-x-8 gap-y-2">
              <IconWithLabel icon={<FaSchool className="text-2xl" />} label={targetMediaContent.schoolName} />
              <IconWithLabel icon={<IoMdSchool className="text-2xl" />} label={targetMediaContent.programName} />
              <IconWithLabel icon={<ImBooks className="text-2xl" />} label={targetMediaContent.courseName} />
              <IconWithLabel icon={<FaBook />} label={targetMediaContent.unitName} />
              <IconWithLabel icon={<FaBookmark />} label={targetMediaContent.topicName} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function IconWithLabel({ icon, label }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-2">
      {icon}
      {label}
    </div>
  );
}
