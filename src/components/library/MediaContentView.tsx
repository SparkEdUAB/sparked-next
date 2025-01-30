"use client"

import Link from 'next/link';
import { ReactNode } from 'react';
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
import { FaDownload } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { ReactionButtons } from '@components/atom/ReactionButtons';
import { useMediaInteractions } from '@hooks/useMediaInteractions';


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
  const { data: session } = useSession();

  const fileType = determineFileType(mediaContent?.file_url || '');
  const fileUrl = mediaContent.file_url ? getFileUrl(mediaContent.file_url) : '';

  const {
    viewCount,
    reactionData,
    isLoadingReactions,
    recordView,
    handleReaction,
    hasRecordedView
  } = useMediaInteractions(mediaContent._id);


  useEffect(() => {
    const timeoutId = setTimeout(recordView, 45000);
    return () => clearTimeout(timeoutId);
  }, [hasRecordedView, recordView]);

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
          <div>
            <h1 className="font-bold text-3xl mb-4">{mediaContent.name}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <ReactionButtons
              session={session}
              isLoadingReactions={isLoadingReactions}
              reactionData={reactionData}
              handleReaction={(type: any) => handleReaction(type, session)}
            />

            <div className="flex items-center gap-2 text-gray-600">
              <FaEye className="text-xl" />
              <span>{viewCount} views</span>
            </div>

            {!session && (
              <span className="text-sm text-gray-500">
                Please login to react to this content
              </span>
            )}
          </div>

        </div>
        <div className="flex justify-between items-center">

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
