import { Card } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { truncateText } from 'utils/helpers/truncateText';

const ContentDetailsCardView = ({
  image,
  url,
  title,
  description,
}: {
  url: string;
  image: string;
  title: string;
  description: string;
}) => (
  <Link href={url} className="h-full">
    <Card
      className="max-w-sm mx-2 my-1 dark:bg-gray-700 h-full"
      renderImage={() => (
        <Image
          className="rounded-t-lg aspect-[5/4] object-cover object-top"
          alt={title}
          src={image}
          width={500}
          height={400}
        />
      )}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">{truncateText(description, 80)}</p>
    </Card>
  </Link>
);

export default ContentDetailsCardView;
