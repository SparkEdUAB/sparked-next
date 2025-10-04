import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { determineFileType } from 'utils/helpers/determineFileType';
import { truncateText } from 'utils/helpers/truncateText';

const ContentDetailsCardView = ({
  image,
  url,
  title,
  description,
  fileUrl,
  externalUrl,
}: {
  url: string;
  image: string;
  title: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
}) => {
  const fileType = determineFileType(fileUrl || '') as string;
  const hasExternalUrl = Boolean(externalUrl);
  const mediaType = hasExternalUrl ? 'Web Link' : fileType;

  const domainName = hasExternalUrl && externalUrl ? new URL(externalUrl).hostname : '';
  const placeholderImage = `https://placehold.co/600x400?text=${domainName || truncateText(title, 12)}`;

  const isValidImage = useCallback((url: string) => {
    return url && url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  }, []);

  return (
    <Link href={url} className="block h-full content-card group">
      <div className="h-full relative shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
        <div className="relative h-56 mb-2">
          <Image
            className="rounded-t-xl object-contain object-center transition-transform duration-300 group-hover:scale-105"
            alt={title}
            src={hasExternalUrl || !isValidImage(image) ? placeholderImage.trimEnd() : image?.trimEnd()}
            unoptimized={hasExternalUrl || !isValidImage(image)}
            fill
          />
           <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-bl-xl">
            {mediaType}
          </div>
        </div>
        <div className="p-3">
          <h5 className="text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{truncateText(description, 60)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ContentDetailsCardView;
