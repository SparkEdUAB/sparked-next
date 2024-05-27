import Link from 'next/link';
import { ReactNode } from 'react';

export default function LibraryBadge({
  children,
  color,
  href,
}: {
  href: string;
  color?: 'gray';
  children: ReactNode | ReactNode[];
}) {
  return (
    <Link className="group" href={href}>
      <span
        className={`flex text-center items-center gap-1 font-semibold  ${
          color === 'gray'
            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
            : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-300'
        } p-1 text-xs rounded px-3 py-2 h-full text-nowrap`}
        data-testid="flowbite-badge"
      >
        {children}
      </span>
    </Link>
  );
}
