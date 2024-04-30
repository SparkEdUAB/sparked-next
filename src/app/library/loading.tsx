import { LibraryGridSkeletonLoader } from '@components/library/LibraryGridSkeletonLoader';
import SkeletonLoaderElement from '@components/skeletonLoader/SkeletonLoaderElement';

export default function Loading() {
  <main className="overflow-y-scroll custom-scrollbar h-[calc(100vh_-_62px)]">
    <div className="overflow-x-scroll custom-scrollbar flex flex-row gap-2 sticky top-0 bg-white dark:bg-gray-800 p-2">
      {new Array(10).fill(0).map((_, index) => (
        <SkeletonLoaderElement key={index} className="h-7 w-32" />
      ))}
    </div>
    <LibraryGridSkeletonLoader />
  </main>;
}
