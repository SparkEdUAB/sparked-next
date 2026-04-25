'use client';

import { RedAsterisk } from '@components/atom';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function AdminFormSelector({
  disabled,
  loadingItems,
  options,
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  disabled: boolean;
  loadingItems: boolean;
  options: Array<{ _id: string; name: string }>;
  defaultValue?: string;
  required?: boolean;
}) {
  /**
   * The only reason why this state variable exists is to ensure that `defaultValue`
   * is respected by making the `Select` a controlled input. Initially, I just assigned
   * the value of `defaultValue` to the `defaultValue` prop of the `Select` component.
   * However, probably since the list of options is initially not loaded, it was getting
   * disregarded by the `Select` component. So making it controlled allows the
   * `defaultValue` to be respected. However, the actual value is retrieved via the form
   */
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name} className="cursor-pointer">
          {label} {required ? <RedAsterisk /> : undefined}
        </Label>
      </div>
      <div className="relative">
        {loadingItems && (
          <span className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
            <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
          </span>
        )}
        <select
          id={name}
          name={name}
          disabled={disabled}
          required={required}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          {options.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
