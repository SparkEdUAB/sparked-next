import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
};
