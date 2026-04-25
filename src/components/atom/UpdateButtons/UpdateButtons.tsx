import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import i18next from 'i18next';

interface Props {
  uploading: boolean;
  toggleDeletionWarning: () => void;
}

export const UpdateButtons = ({ uploading, toggleDeletionWarning }: Props) => {
  return (
    <div className="flex space-x-4 mt-2">
      <Button type="submit" disabled={uploading}>
        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" /> : undefined}
        {i18next.t('update')}
      </Button>
      <Button variant="destructive" onClick={toggleDeletionWarning} disabled={uploading}>
        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" /> : undefined}
        {i18next.t('delete')}
      </Button>
    </div>
  );
};
