import Image from 'next/image';
import { ReactNode } from 'react';
// import { CiFileOff } from 'react-icons/ci';

// The image was taken from: https://undraw.co
export default function EmptyContentIndicator({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="h-full min-h-[500px] w-full flex flex-col items-center justify-center text-gray-500">
      {/* <CiFileOff className="text-6xl mb-3" /> */}
      <Image width={258.810969} height={193.435776} src="/assets/images/empty-content.svg" alt="Empty content" />
      <p className="text-2xl mt-4">{children}</p>
    </div>
  );
}
