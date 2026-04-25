'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RedAsterisk } from '@components/atom';
import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

export function FormInput({
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
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <RedAsterisk />}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={label}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
      />
    </div>
  );
}
