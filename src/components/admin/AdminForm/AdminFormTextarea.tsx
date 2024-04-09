'use client';
import { RedAsterisk } from '@components/atom';
import { Label, Textarea } from 'flowbite-react';

export function AdminFormTextarea({
  disabled,
  name,
  label,
  defaultValue,
  required,
  rows,
}: {
  disabled: boolean;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name}>
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
      />
    </div>
  );
}
