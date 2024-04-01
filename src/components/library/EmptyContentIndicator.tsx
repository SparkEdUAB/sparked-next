import { ReactNode } from 'react';
import { CiFileOff } from 'react-icons/ci';

export default function EmptyContentIndicator({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="h-full min-h-[500px] w-full flex flex-col items-center justify-center text-gray-500">
      <CiFileOff className="text-6xl mb-3" />
      <p className="text-lg">{children}</p>
    </div>
  );
}
