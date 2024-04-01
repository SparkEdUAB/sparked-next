import { Card } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';

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
    <Card className="max-w-sm mx-2 my-1 dark:bg-gray-700 h-full" imgAlt={title} imgSrc={image}>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">{description}</p>
    </Card>
  </Link>
);

export default ContentDetailsCardView;
