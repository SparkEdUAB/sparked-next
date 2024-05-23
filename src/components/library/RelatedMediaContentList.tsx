import Link from 'next/link';
import { T_RawMediaContentFields } from 'types/media-content';
import Image from 'next/image';
import { List } from 'flowbite-react';

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
              <List.Item key={item._id}>
                <Link href={`/library/media/${item._id}`} className="flex flex-row gap-2 mb-2">
                  <Image
                    src={item.thumbnailUrl || '/assets/images/no picture yet.svg'}
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
            ))}
          </List>
        </>
      )}
    </section>
  );
}
