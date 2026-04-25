'use client';

import Link from 'next/link';
import { ReactNode, memo, useCallback, useEffect } from 'react';
import { FaBook, FaBookmark, FaEye } from 'react-icons/fa';
import { PiStepsFill } from 'react-icons/pi';
import { MdTopic } from 'react-icons/md';
import { ImBooks } from 'react-icons/im';
import { useSession } from 'next-auth/react';
import { T_RawMediaContentFields } from 'types/media-content';
import { ReactionButtons } from '@components/atom/ReactionButtons';
import { useMediaInteractions } from '@hooks/useMediaInteractions';

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

export function MediaDetails({ mediaContent }: { mediaContent: T_RawMediaContentFields }) {
  const { data: session } = useSession();
  const { viewCount, reactionData, isLoadingReactions, recordView, handleReaction, hasRecordedView } =
    useMediaInteractions(mediaContent._id);

  const handleReactionCallback = useCallback((type: any) => handleReaction(type, session), [handleReaction, session]);

  useEffect(() => {
    const timeoutId = setTimeout(recordView, 45000);
    return () => clearTimeout(timeoutId);
  }, [mediaContent._id, hasRecordedView, recordView]);

  return (
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
      <div className="flex justify-between items-center">
        <MediaContentMetadata mediaContent={mediaContent} />
      </div>
    </div>
  );
}
