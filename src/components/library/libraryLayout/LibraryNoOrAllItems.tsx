import Link from 'next/link';
import styles from './Layout.module.css';
import { cn } from '@/lib/utils';

export const ShowAllOrNoItems = ({
  ItemName,
  items,
  filterItemId,
  url,
}: {
  ItemName: string;
  items: {}[];
  filterItemId: string | null;
  url: string;
}) => {
  return (
    <>
      {items && items.length > 0 ? (
        <Link
          href={url}
          className={cn(
            styles.item,
            'flex items-center px-3 py-2 text-sm rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
            !filterItemId && 'bg-gray-100 dark:bg-gray-700 font-medium',
          )}
        >
          All
        </Link>
      ) : (
        <span className={cn(styles.item, 'flex items-center px-3 py-2 text-sm rounded-lg text-gray-400 dark:text-gray-500')}>
          No {ItemName}
        </span>
      )}
    </>
  );
};
