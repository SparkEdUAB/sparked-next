import PdfViewer from '@components/layouts/library/PdfViewer/PdfViewer';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaBook, FaBookmark } from 'react-icons/fa';
import { ImBooks } from 'react-icons/im';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers';
import { LibraryErrorMessage } from './LibraryErrorMessage/LibraryErrorMessage';

export function MediaContentView({ mediaContent }: { mediaContent: T_RawMediaContentFields }) {
  const fileType = determineFileType(mediaContent?.file_url || '');

  return (
    <div>
      <div>
        {!mediaContent.file_url ? (
          <LibraryErrorMessage className="h-fit min-h-0">
            The <code>file_url</code> property is <code>null</code>
          </LibraryErrorMessage>
        ) : fileType === 'image' ? (
          <img src={mediaContent.file_url} alt={mediaContent.name} className="max-h-[500px] max-w-full" />
        ) : fileType === 'video' ? (
          <video src={mediaContent.file_url} className="max-h-[500px] max-w-full" controls></video>
        ) : fileType === 'pdf' ? (
          <PdfViewer file={mediaContent.file_url} />
        ) : null}
      </div>
      <div>
        <h1 className="my-6 font-bold text-3xl">{mediaContent.name}</h1>
        <p className="text-lg whitespace-pre-wrap">{mediaContent.description}</p>
        <div className="my-6 flex flex-row flex-wrap text-gray-500 gap-x-8 gap-y-2">
          {mediaContent.course ? (
            <Link href={`/library?course_id=${mediaContent.course._id}`}>
              <IconWithLabel title="Course" icon={<ImBooks className="text-2xl" />} label={mediaContent.course.name} />
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
