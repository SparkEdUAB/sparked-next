'use client';

import Link from 'next/link';
import { ReactNode, memo, useCallback, useMemo, useEffect } from 'react';
import { FaBook, FaBookmark, FaEye } from 'react-icons/fa';
import { PiStepsFill } from 'react-icons/pi';
import { MdTopic } from 'react-icons/md';
import { ImBooks } from 'react-icons/im';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers/determineFileType';
import { getFileUrl } from 'utils/helpers/getFileUrl';
import { LibraryErrorMessage } from './LibraryErrorMessage/LibraryErrorMessage';
import { RelatedMediaContentList } from './RelatedMediaContentList';
import { ReactionButtons } from '@components/atom/ReactionButtons';
import { useMediaInteractions } from '@hooks/useMediaInteractions';

const VideoViewer = dynamic(() => import('next-video/player'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-[400px] w-full rounded-lg"></div>,
});

const IconWithLabel = memo(({ icon, label, title }: { label?: string; icon: ReactNode; title: string }) =>
  label ? (
    <div className="flex flex-row items-center gap-2" title={title}>
      {icon}
      {label}
    </div>
  ) : null,
);
IconWithLabel.displayName = 'IconWithLabel';

const MediaContentMetadata = memo(({ mediaContent }: { mediaContent: T_RawMediaContentFields }) => (
  <div className="my-2 flex flex-row flex-wrap text-gray-500 gap-x-8 gap-y-2">
    {mediaContent.grade && (
      <Link href={`/library?grade_id=${mediaContent.grade._id}`}>
        <IconWithLabel title="Grade" icon={<PiStepsFill className="text-2xl" />} label={mediaContent.grade.name} />
      </Link>
    )}
    {mediaContent.subject && (
      <Link href={`/library?subject_id=${mediaContent.subject._id}`}>
        <IconWithLabel title="Subject" icon={<MdTopic className="text-2xl" />} label={mediaContent.subject.name} />
      </Link>
    )}
    {mediaContent.course && (
      <Link href={`/library?course_id=${mediaContent.course._id}`}>
        <IconWithLabel title="Course" icon={<ImBooks className="text-2xl" />} label={mediaContent.course.name} />
      </Link>
    )}
    {mediaContent.unit && (
      <Link href={`/library?unit_id=${mediaContent.unit._id}`}>
        <IconWithLabel title="Unit" icon={<FaBook />} label={mediaContent.unit.name} />
      </Link>
    )}
    {mediaContent.topic && (
      <Link href={`/library?topic_id=${mediaContent.topic._id}`}>
        <IconWithLabel title="Topic" icon={<FaBookmark />} label={mediaContent.topic.name} />
      </Link>
    )}
  </div>
));
MediaContentMetadata.displayName = 'MediaContentMetadata';

export function MediaContentView({
  mediaContent,
  relatedMediaContent,
}: {
  mediaContent: T_RawMediaContentFields;
  relatedMediaContent: T_RawMediaContentFields[] | null;
}) {
  const { data: session } = useSession();
  const fileType = useMemo(() => determineFileType(mediaContent?.file_url || ''), [mediaContent?.file_url]);
  const fileUrl = useMemo(
    () => (mediaContent.file_url ? getFileUrl(mediaContent.file_url) : ''),
    [mediaContent.file_url],
  );
  const externalUrl = mediaContent.external_url;

  const { viewCount, reactionData, isLoadingReactions, recordView, handleReaction, hasRecordedView } =
    useMediaInteractions(mediaContent._id);

  const handleReactionCallback = useCallback((type: any) => handleReaction(type, session), [handleReaction, session]);

  useEffect(() => {
    const timeoutId = setTimeout(recordView, 45000);
    return () => clearTimeout(timeoutId);
  }, [hasRecordedView, recordView]);

  const renderMediaContent = useMemo(() => {
    if (!fileUrl && !externalUrl) {
      return (
        <LibraryErrorMessage className="h-fit min-h-0">
          This file cannot be rendered. Please contact the site administrator with the details.
        </LibraryErrorMessage>
      );
    }

    if (externalUrl) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;

      if (youtubeRegex.test(externalUrl)) {
        // eslint-disable-next-line no-useless-escape
        const videoId = externalUrl.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        )?.[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ width: '100%', height: '100%' }}
              title="YouTube Video"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      if (vimeoRegex.test(externalUrl)) {
        const videoId = externalUrl.match(/vimeo\.com\/(\d+)/)?.[1];
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return (
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ width: '100%', height: '100%' }}
              title="Vimeo Video"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      return (
        <div className="w-full h-[80vh] md:h-[80vh] lg:h-[80vh] rounded-lg overflow-hidden">
          <iframe
            src={externalUrl}
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin"
            style={{ width: '100%', height: '80vh' }}
            title="External Video"
          ></iframe>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <Image
            src={fileUrl}
            alt={mediaContent.name}
            className="max-h-[500px] max-w-full object-contain object-left"
            width={800}
            height={600}
            priority
            loading="eager"
          />
        );
      case 'video':
        return <VideoViewer src={fileUrl} />;
      case 'pdf':
        return (
          <div className="w-full h-[80vh] rounded-lg overflow-hidden relative">
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className="w-full h-full border-0"
              title={`PDF: ${mediaContent.name}`}
              loading="lazy"
              onLoad={(e) => {
                (e.target as HTMLIFrameElement).classList.add('pdf-loaded');
              }}
            />
            <noscript>
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p>
                  JavaScript is required to view this PDF.
                  <a href={fileUrl} className="text-blue-500 ml-2" target="_blank" rel="noopener noreferrer">
                    Download the PDF
                  </a>
                </p>
              </div>
            </noscript>
          </div>
        );
      default:
        return <LibraryErrorMessage>Could not recognize the file type</LibraryErrorMessage>;
    }
  }, [fileUrl, fileType, mediaContent.name, externalUrl]);

  return (
    <div className="xl:grid xl:grid-cols-[calc(100%_-_300px)_300px] 2xl:grid-cols-[calc(100%_-_400px)_400px] px-4 md:px-8 w-full">
      <section>
        <div>{renderMediaContent}</div>
        <div>
          <div className="mb-4 mt-2">
            <h1 className="font-bold text-3xl">{mediaContent.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <ReactionButtons
              session={session}
              isLoadingReactions={isLoadingReactions}
              reactionData={reactionData}
              handleReaction={handleReactionCallback}
            />
            <div className="flex items-center gap-2 text-gray-600">
              <FaEye className="text-xl" />
              <span>{viewCount} views</span>
            </div>
            {!session && <span className="text-sm text-gray-500">Please login to react to this content</span>}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <MediaContentMetadata mediaContent={mediaContent} />
        </div>
      </section>
      <RelatedMediaContentList relatedMediaContent={relatedMediaContent} />
    </div>
  );
}
