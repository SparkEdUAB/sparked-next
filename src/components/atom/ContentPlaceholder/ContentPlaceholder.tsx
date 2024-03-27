export default function ContentPlaceholder({
  message,
  className = '',
  textClassName = '',
}: {
  className?: string;
  textClassName?: string;
  message: string;
}) {
  return (
    <div
      className={`w-full h-full border-dashed border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-500 text-xl border-2 flex items-center justify-center p-12 py-24 ${className}`}
    >
      <p className={`${textClassName}`}>{message}</p>
    </div>
  );
}
