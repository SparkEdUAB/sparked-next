import { List } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { T_RawMediaContentFields } from 'types/media-content';

const isValidImage = (url: string) => {
  return url && url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
};

const RelatedMediaItem = memo(({ item }: { item: T_RawMediaContentFields }) => {
  const domainName = item.external_url ? new URL(item.external_url).hostname : '';
  const placeholderImage = `https://fakeimg.pl/120x100?text=${domainName || item.name}`;
  const thumbnailUrl = isValidImage(item.thumbnail_url as string) ? item.thumbnail_url : placeholderImage

  return (
    <List.Item key={item._id}>
      <Link href={`/library/media/${item._id}`} className="flex flex-row gap-2 mb-2">
        <Image
          src={thumbnailUrl as string}
          alt={item.name}
          width={120}
          height={90}
          objectFit="cover"
        />
        <div className="flex flex-col">
          <h4 className="font-semibold text-black dark:text-white line-clamp-2 overflow-ellipsis">
            {item.name}
          </h4>
          <div className="line-clamp-2 overflow-ellipsis">{item.description}</div>
        </div>
      </Link>
    </List.Item>
  );
});

export function RelatedMediaContentList({
  relatedMediaContent,
}: {
  relatedMediaContent: T_RawMediaContentFields[] | null;
}) {
  return (
    <section className="xl:pl-4">
      {relatedMediaContent && relatedMediaContent.length > 0 && (
        <>
          <h3 className="my-4 font-semibold text-xl">Related Media</h3>
          <List unstyled>
            {relatedMediaContent.map((item) => (
              <RelatedMediaItem key={item._id} item={item} />
            ))}
          </List>
        </>
      )}
    </section>
  );
}
