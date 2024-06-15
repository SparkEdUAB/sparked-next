import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';

interface Props {
  uploading: boolean;
  toggleDeletionWarning: () => void;
}

export const UpdateButtons = ({ uploading, toggleDeletionWarning }: Props) => {
  return (
    <div className="flex space-x-4 mt-2">
      <Button type="submit" disabled={uploading}>
        {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
        {i18next.t('update')}
      </Button>
      <Button color="red" onClick={toggleDeletionWarning} disabled={uploading}>
        {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
        {i18next.t('delete')}
      </Button>
    </div>
  );
};
