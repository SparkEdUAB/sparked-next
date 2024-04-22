'use client';
import React from 'react';
import SkeletonLoaderElement from '@components/skeletonLoader/SkeletonLoaderElement';

export function LibraryGridSkeletonLoader(): React.ReactNode {
  return (
    <div className="grid pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {new Array(8).fill(0).map((_, index) => (
        <div className="p-4" key={index}>
          <SkeletonLoaderElement className="h-48 w-full mb-2" />
          <SkeletonLoaderElement className="h-8 w-full mb-2" />
          <SkeletonLoaderElement className="h-5 w-full mb-2" />
          <SkeletonLoaderElement className="h-5 w-full mb-2" />
        </div>
      ))}
    </div>
  );
}
