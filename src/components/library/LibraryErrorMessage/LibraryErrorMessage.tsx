import { ReactNode } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

import styles from './LibraryErrorMessage.module.css';

export function LibraryErrorMessage({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div
      className={`h-full min-h-[500px] w-full flex flex-col items-center justify-center text-red-500 ${styles.container}`}
    >
      <IoIosCloseCircleOutline className="text-6xl mb-3" />
      <p className="text-lg">{children}</p>
    </div>
  );
}
