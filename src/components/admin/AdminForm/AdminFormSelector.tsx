'use client';

import { RedAsterisk } from '@components/atom';
import { Label, Select, Spinner } from 'flowbite-react';
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
  let [selected, setSelected] = useState(defaultValue);

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name}>
          {label} {required ? <RedAsterisk /> : undefined}
        </Label>
      </div>
      {
        <Select
          icon={loadingItems ? () => <Spinner size="sm" /> : undefined}
          id={name}
          name={name}
          placeholder={label}
          disabled={disabled}
          required={required}
          defaultValue={defaultValue}
          onChange={(e) => setSelected(e.target.value)}
        >
          {options.map((item) => (
            <option key={item._id} value={item._id} selected={selected === item._id}>
              {item.name}
            </option>
          ))}
        </Select>
      }
    </div>
  );
}
