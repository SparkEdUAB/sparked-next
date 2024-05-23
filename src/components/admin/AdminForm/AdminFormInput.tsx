'use client';
import { RedAsterisk } from '@components/atom';
import { Label, TextInput } from 'flowbite-react';

export function AdminFormInput({
  disabled,
  name,
  label,
  defaultValue,
  required,
}: {
  disabled: boolean;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name}>
          {label} {required ? <RedAsterisk /> : undefined}
        </Label>
      </div>
      <TextInput
        defaultValue={defaultValue}
        id={name}
        name={name}
        placeholder={label}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
