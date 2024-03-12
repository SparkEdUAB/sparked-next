/* eslint-disable react-hooks/exhaustive-deps */
'use client';
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
  console.log(arguments);
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name} value={label} />
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
