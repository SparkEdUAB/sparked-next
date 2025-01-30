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
import { FaDownload } from 'react-icons/fa'; // Import the download icon
import { Button } from 'flowbite-react'; // Import the Button component
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useEffect } from 'react';
import { FaEye } from 'react-icons/fa'; // Add eye icon for view count
import useSWR from 'swr';

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
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const fileType = determineFileType(mediaContent?.file_url || '');
  const fileUrl = mediaContent.file_url ? getFileUrl(mediaContent.file_url) : '';

  const { data: viewCountData } = useSWR(
    `/api/media-actions/getViewCount?mediaId=${mediaContent._id}`,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch view count');
      const data = await res.json();
      return data.viewCount;
    },
    {
      refreshInterval: 90000, // Refresh every 90 seconds
      fallbackData: mediaContent.viewCount || 0,
    }
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const recordView = async () => {
      if (hasRecordedView) return;

      try {
        await fetch('/api/media-actions/createMediaView', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mediaId: mediaContent._id,
            timestamp: Date.now(),
          }),
        });

        setHasRecordedView(true);
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    timeoutId = setTimeout(recordView, 45000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasRecordedView]);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!session) {
      // Show login prompt or handle unauthorized state
      return;
    }

    try {
      const response = await fetch(`/api/media/${mediaContent._id}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error('Failed to process reaction');

      const data = await response.json();
      // setLikes(data.likes);
      // setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
    } catch (error) {
      console.error('Error processing reaction:', error);
    }
  };


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
            <div className="flex items-center space-x-4">
              <Button
                color={userReaction === 'like' ? 'success' : 'gray'}
                onClick={() => handleReaction('like')}
                disabled={!session}
                className="flex items-center space-x-2"
              >
                <FaThumbsUp />
              </Button>

              <Button
                color={userReaction === 'dislike' ? 'failure' : 'gray'}
                onClick={() => handleReaction('dislike')}
                disabled={!session}
                className="flex items-center space-x-2"
              >
                <FaThumbsDown />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <FaEye className="text-xl" />
              <span>{viewCountData} views</span>
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
