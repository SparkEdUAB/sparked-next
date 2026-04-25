'use client';
import { RedAsterisk } from '@components/atom';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

export function AdminFormTextarea({
  disabled,
  name,
  label,
  defaultValue,
  required,
  rows,
  onChange,
  onInput,
  onBlur,
}: {
  disabled: boolean;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onInput?: FormEventHandler<HTMLTextAreaElement> | undefined;
  onBlur?: FocusEventHandler<HTMLTextAreaElement> | undefined;
}) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name} className="cursor-pointer">
          {label} {required ? <RedAsterisk /> : undefined}
        </Label>
      </div>
      <Textarea
        className="custom-scrollbar"
        defaultValue={defaultValue}
        id={name}
        name={name}
        placeholder={label}
        disabled={disabled}
        required={required}
        rows={rows}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
      />
    </div>
  );
}
