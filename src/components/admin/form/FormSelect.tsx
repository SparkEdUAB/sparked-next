'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RedAsterisk } from '@components/atom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function FormSelect({
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
  const [selected, setSelected] = useState(defaultValue ?? '');

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <RedAsterisk />}
      </Label>
      {loadingItems ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <>
          {/* Hidden native input for form submission */}
          <input type="hidden" name={name} value={selected} />
          <Select
            value={selected}
            onValueChange={setSelected}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
