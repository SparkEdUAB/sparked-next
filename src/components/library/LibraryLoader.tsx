import { Spinner } from 'flowbite-react';

export default function LibraryLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px] w-full">
      <Spinner size="xl" />
    </div>
  );
}
