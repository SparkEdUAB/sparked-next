import { Spinner } from 'flowbite-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <Spinner size="xl" />
    </div>
  );
};
