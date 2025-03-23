import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { FaFile, FaFileAudio, FaFileImage, FaFilePdf, FaFileVideo, FaLink } from 'react-icons/fa6';
import { determineFileType } from 'utils/helpers/determineFileType';
import { truncateText } from 'utils/helpers/truncateText';

const FileTypeIcon = ({ fileType, hasExternalUrl }: { fileType: string, hasExternalUrl: boolean }) => {
  const iconClass = "inline-block mr-2";

  const fileTypeMap: Record<string, { icon: React.ElementType; color: string; text: string }> = {
    pdf: { icon: FaFilePdf, color: "text-gray-500", text: "PDF" },
    video: { icon: FaFileVideo, color: "text-gray-500", text: "Video" },
    audio: { icon: FaFileAudio, color: "text-gray-500", text: "Audio" },
    image: { icon: FaFileImage, color: "text-gray-500", text: "Image" },
    link: { icon: FaLink, color: "text-gray-500", text: "External Link" },
    default: { icon: FaFile, color: "text-gray-500", text: "File" },
  };

  const { icon: IconComponent, color: textColor, text: fileTypeText } =
    hasExternalUrl ? fileTypeMap.link : (fileTypeMap[fileType?.toLowerCase()] || fileTypeMap.default);

  return (
    <div className={`flex items-center ${textColor} mt-1`}>
      <IconComponent className={iconClass} />
      <span className='text-sm'>{fileTypeText}</span>
    </div>
  );
};

const ContentDetailsCardView = ({
  image,
  url,
  title,
  description,
  fileUrl,
  externalUrl
}: {
  url: string;
  image: string;
  title: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
}) => {

  const fileType = determineFileType(fileUrl || "") as string;
  const hasExternalUrl = Boolean(externalUrl);

  const domainName = hasExternalUrl ? new URL(externalUrl as string).hostname : '';
  const placeholderImage = `https://fakeimg.pl/600x400?text=${domainName || title}`;

  const isValidImage = useCallback((url: string) => {
    return url && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }, []);

  return (
    <Link href={url} className="block h-full content-card">
      <div className="h-full relative shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg bg-white dark:bg-gray-800">
        <div className="relative">
          <Image
            className="rounded-t-md aspect-[4/3] object-cover object-center"
            alt={title}
            src={hasExternalUrl || !isValidImage(image) ? placeholderImage : image}
            width={450}
            height={340}
          />
        </div>
        <div className="p-3">
          <h5 className="text-base font-semibold text-gray-900 dark:text-white truncate">{title}</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{truncateText(description, 60)}</p>
          <FileTypeIcon fileType={fileType} hasExternalUrl={hasExternalUrl} />
        </div>
      </div>
    </Link>
  );
};

export default ContentDetailsCardView;
