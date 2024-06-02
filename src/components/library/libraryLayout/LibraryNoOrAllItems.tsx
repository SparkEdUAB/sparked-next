import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import styles from './Layout.module.css';

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
        <Sidebar.Item active={!filterItemId} className={styles.item} as={Link} href={url}>
          All
        </Sidebar.Item>
      ) : (
        <Sidebar.Item disabeld as={Link} href="#" className={styles.item}>
          No {ItemName}
        </Sidebar.Item>
      )}
    </>
  );
};
