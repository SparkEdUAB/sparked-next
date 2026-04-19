'use client';

import { List } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { T_RawMediaContentFields } from 'types/media-content';

const isValidImage = (url: string) => {
  return url && url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
};

const RelatedMediaItem = memo(
  ({
    item,
    isActive,
    onSelect,
  }: {
    item: T_RawMediaContentFields;
    isActive: boolean;
    onSelect?: (item: T_RawMediaContentFields) => void;
  }) => {
    const domainName = item.external_url ? new URL(item.external_url).hostname : '';
    const placeholderImage = `https://placehold.co/120x100?text=${domainName || item.name}`;
    const thumbnailUrl = isValidImage(item.thumbnail_url as string) ? item.thumbnail_url : placeholderImage;

    const content = (
      <div className={`flex flex-row gap-2 mb-2 rounded-lg p-1 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
        <Image
          src={thumbnailUrl as string}
          alt={item.name}
          width={120}
          height={90}
          className="object-cover rounded"
          loading="eager"
        />
        <div className="flex flex-col">
          <h4 className={`font-semibold line-clamp-2 overflow-ellipsis ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-black dark:text-white'}`}>
            {item.name}
          </h4>
          <div className="line-clamp-2 overflow-ellipsis text-sm text-gray-500">{item.description}</div>
        </div>
      </div>
    );

    if (onSelect) {
      return (
        <List.Item key={item._id}>
          <button className="w-full text-left" onClick={() => onSelect(item)}>
            {content}
          </button>
        </List.Item>
      );
    }

    return (
      <List.Item key={item._id}>
        <Link href={`/library/media/${item._id}`}>{content}</Link>
      </List.Item>
    );
  },
);

RelatedMediaItem.displayName = 'RelatedMediaItem';

export function RelatedMediaContentList({
  relatedMediaContent,
  activeMediaId,
  onSelect,
}: {
  relatedMediaContent: T_RawMediaContentFields[] | null;
  activeMediaId?: string;
  onSelect?: (item: T_RawMediaContentFields) => void;
}) {
  return (
    <section className="xl:pl-4">
      {relatedMediaContent && relatedMediaContent.length > 0 && (
        <>
          <h3 className="my-4 font-semibold text-xl">Related Media</h3>
          <List unstyled>
            {relatedMediaContent.map((item) => (
              <RelatedMediaItem
                key={item._id}
                item={item}
                isActive={item._id === activeMediaId}
                onSelect={onSelect}
              />
            ))}
          </List>
        </>
      )}
    </section>
  );
}
