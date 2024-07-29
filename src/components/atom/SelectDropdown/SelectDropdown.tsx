'use client';
import { Dropdown } from 'flowbite-react';

export function SelectDropdown<ValueType extends string>({
  options,
  selected,
  setSelected,
  inline,
}: {
  options: Array<{ value: ValueType; label: string } | ValueType>;
  selected: ValueType;
  setSelected: (value: ValueType) => void;
  inline?: boolean;
}) {
  const selectedOption = options.find((value) =>
    typeof value === 'string' ? value === selected : value.value === selected,
  );

  return (
    <Dropdown
      label={selected ? (typeof selectedOption === 'string' ? selectedOption : selectedOption?.label) : 'Select value'}
      inline={inline}
    >
      {options.map((item) =>
        typeof item === 'string' ? (
          <Dropdown.Item key={item} value={item} onClick={() => setSelected(item)}>
            {item}
          </Dropdown.Item>
        ) : (
          <Dropdown.Item key={item.value} value={item.value} onClick={() => setSelected(item.value)}>
            {item.label}
          </Dropdown.Item>
        ),
      )}
    </Dropdown>
  );
}
