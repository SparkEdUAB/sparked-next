export default function SkeletonLoaderElement({ className }: { className?: string }) {
  return <div className={`inline-block animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md ${className}`}></div>;
}
