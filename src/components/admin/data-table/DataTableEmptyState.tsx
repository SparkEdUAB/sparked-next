import { Button } from '@/components/ui/button';
import { IoFileTrayOutline } from 'react-icons/io5';
import { Plus } from 'lucide-react';
import i18next from 'i18next';

export function DataTableEmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <IoFileTrayOutline className="mb-4 h-16 w-16 text-muted-foreground/40" />
      <h3 className="mb-1 text-sm font-semibold text-foreground">No items yet</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Get started by creating the first one.
      </p>
      <Button size="sm" onClick={onCreateNew} className="gap-1.5">
        <Plus className="h-4 w-4" />
        {i18next.t('new')}
      </Button>
    </div>
  );
}
