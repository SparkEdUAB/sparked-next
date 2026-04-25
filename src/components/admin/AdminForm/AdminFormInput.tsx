'use client';
import { RedAsterisk } from '@components/atom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

export function AdminFormInput({
  disabled,
  name,
  label,
  defaultValue,
  required,
  onChange,
  onInput,
  onBlur,
}: {
  disabled: boolean;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onInput?: FormEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name} className="cursor-pointer">
          {label} {required ? <RedAsterisk /> : undefined}
        </Label>
      </div>
      <Input
        defaultValue={defaultValue}
        id={name}
        name={name}
        placeholder={label}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
      />
    </div>
  );
}
