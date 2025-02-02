import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFilePdf, FaFileVideo, FaFileAudio, FaFileImage, FaFile } from 'react-icons/fa6';
import { determineFileType } from 'utils/helpers/determineFileType';
import { truncateText } from 'utils/helpers/truncateText';

const FileTypeIcon = ({ fileType }: { fileType: string }) => {
  const iconClass = "w-5 h-5 absolute top-2 right-2 drop-shadow-lg";

  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return <FaFilePdf className={`${iconClass} text-red-500`} />;
    case 'video':
      return <FaFileVideo className={`${iconClass} text-blue-500`} />;
    case 'audio':
      return <FaFileAudio className={`${iconClass} text-green-500`} />;
    case 'image':
      return <FaFileImage className={`${iconClass} text-purple-500`} />;
    default:
      return <FaFile className={`${iconClass} text-gray-500`} />;
  }
};

const ContentDetailsCardView = ({
  image,
  url,
  title,
  description,
  fileUrl
}: {
  url: string;
  image: string;
  title: string;
  description: string;
  fileUrl?: string
}) => {
  const fileType = determineFileType(fileUrl || "") as string;

  return (
    <Link href={url} className="block h-full">
      <div className="h-full relative shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg bg-white dark:bg-gray-800">
        <div className="relative">
          <Image
            className="rounded-t-md aspect-[4/3] object-cover object-center"
            alt={title}
            src={image}
            width={400}
            height={300}
          />
          <FileTypeIcon fileType={fileType} />
        </div>
        <div className="p-2">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</h5>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{truncateText(description, 60)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ContentDetailsCardView;
