'use client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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

  const label = selected
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption?.label
    : 'Select value';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={inline ? 'ghost' : 'outline'}>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((item) =>
          typeof item === 'string' ? (
            <DropdownMenuItem key={item} onClick={() => setSelected(item)}>
              {item}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={item.value} onClick={() => setSelected(item.value)}>
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
