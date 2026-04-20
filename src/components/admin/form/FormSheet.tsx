'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

export function FormSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-[460px] lg:max-w-[560px]"
      >
        <SheetHeader className="border-b border-border px-6 pb-4 pt-6">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 py-4 custom-scrollbar">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
