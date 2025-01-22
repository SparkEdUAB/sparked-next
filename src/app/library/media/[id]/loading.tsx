'use client';

import { LibraryGridSkeletonLoader } from '@components/library/LibraryGridSkeletonLoader';

export default function Loading() {
  return (
    <div className="p-4">
      <LibraryGridSkeletonLoader />
    </div>
  );
}
