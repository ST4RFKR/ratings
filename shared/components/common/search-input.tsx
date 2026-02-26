'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';

import { Combobox, ComboboxInput, InputGroupAddon } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

interface SearchInputProps extends Omit<ComponentProps<typeof ComboboxInput>, 'value' | 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  wrapperClassName?: string;
}

export function SearchInput({
  value = '',
  onValueChange,
  onDebouncedChange,
  debounceMs = 400,
  wrapperClassName,
  className,
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onDebouncedChange?.(localValue);
    }, debounceMs);

    return () => window.clearTimeout(timeout);
  }, [debounceMs, localValue, onDebouncedChange]);

  return (
    <Combobox>
      <ComboboxInput
        className={cn('max-w-sm', wrapperClassName, className)}
        value={localValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setLocalValue(nextValue);
          onValueChange?.(nextValue);
        }}
        showClear
        showTrigger={false}
        {...props}
      >
        <InputGroupAddon align='inline-start'>
          <Search className='text-muted-foreground size-4' />
        </InputGroupAddon>
      </ComboboxInput>
    </Combobox>
  );
}
