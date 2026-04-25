'use client';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RedAsterisk } from '@components/atom';
import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

export function FormTextarea({
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
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onInput?: FormEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <RedAsterisk />}
      </Label>
      <Textarea
        id={name}
        name={name}
        placeholder={label}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        rows={rows}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
        className="custom-scrollbar resize-none"
      />
    </div>
  );
}
