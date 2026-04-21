import { Loader2 } from 'lucide-react';

export default function LibraryLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px] w-full">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}
