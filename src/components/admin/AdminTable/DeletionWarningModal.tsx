'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import i18next from 'i18next';

export function DeletionWarningModal({
  showDeletionWarning,
  toggleDeletionWarning,
  numberOfElements,
  deleteItems,
}: {
  showDeletionWarning: boolean;
  toggleDeletionWarning: () => void;
  numberOfElements: number;
  deleteItems: () => void;
}) {
  return (
    <Dialog open={showDeletionWarning} onOpenChange={toggleDeletionWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            {i18next.t(
              numberOfElements === 1
                ? 'deletion_confirmation_singular'
                : 'deletion_confirmation_plural',
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={toggleDeletionWarning}>
            {i18next.t('no_cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toggleDeletionWarning();
              deleteItems();
            }}
          >
            {i18next.t('yes_im_sure')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
