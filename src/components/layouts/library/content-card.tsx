import { Card } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFilePdf, FaFileVideo, FaFileAudio, FaFileImage, FaFile } from 'react-icons/fa6';
import { determineFileType } from 'utils/helpers/determineFileType';
import { truncateText } from 'utils/helpers/truncateText';

const FileTypeIcon = ({ fileType }: { fileType: string }) => {
  const iconClass = "w-6 h-6 absolute top-3 right-3 drop-shadow-lg";

  switch (fileType.toLowerCase()) {
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
  const fileType = determineFileType(fileUrl || "");

  return (
    <Link href={url} className="h-full">
      <Card
        className="max-w-sm mx-2 my-1 dark:bg-gray-700 h-full relative"
        renderImage={() => (
          <div className="relative">
            <Image
              className="rounded-t-lg aspect-[5/4] object-cover object-top"
              alt={title}
              src={image}
              width={500}
              height={400}
            />
            <FileTypeIcon fileType={fileType as string} />
          </div>
        )}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">{truncateText(description, 80)}</p>
      </Card>
    </Link>
  );
};

export default ContentDetailsCardView;
