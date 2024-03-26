'use client';

import { Card } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';

const ContentDetailsCardView = ({ title = '' }: { title: string }) => (
  <Link href="#" className="h-full">
    <Card
      className="max-w-sm mx-2 my-1 dark:bg-gray-700 h-full"
      imgAlt={title}
      imgSrc="https://cdn.pixabay.com/photo/2023/06/16/11/47/books-8067850_1280.jpg"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">This is where the description should be.</p>
    </Card>
  </Link>
);

export default ContentDetailsCardView;
